import { validate as isUuid } from 'uuid';
import * as XLSX from 'xlsx';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { slugify, paginate } from '../utils/helpers';
import { AdminAuthRequest } from '../middleware/adminAuth';

export async function listEvents(req: import('express').Request, res: import('express').Response) {
  const { category, status, q, featured, page, limit } = req.query as Record<string, string>;
  const { from, to, page: p, limit: l } = paginate(Number(page), Number(limit));

  const where: any = {
    deleted_at: null,
    status: { not: 'draft' },
  };

  if (category) where.category = category as any;
  if (status) where.status = status as any;
  if (featured === 'true') where.is_featured = true;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  try {
    const [data, count] = await prisma.$transaction([
      prisma.events.findMany({
        where,
        orderBy: { event_start_at: 'asc' },
        skip: from,
        take: l,
      }),
      prisma.events.count({ where }),
    ]) as any;

    res.json({ success: true, data, meta: { page: p, limit: l, total: count } });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function getEventBySlug(req: import('express').Request, res: import('express').Response) {
  const slugVal = req.params.slug as string;
  const isId = isUuid(slugVal);

  const where: any = {
    deleted_at: null,
  };

  if (isId) {
    where.id = slugVal;
  } else {
    where.slug = slugVal;
    where.status = { not: 'draft' };
  }

  const data = await prisma.events.findFirst({ where });

  if (!data) throw new AppError(404, 'Event not found');
  res.json({ success: true, data });
}

export async function adminListEvents(req: AdminAuthRequest, res: import('express').Response) {
  try {
    const data = await prisma.events.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function createEvent(req: AdminAuthRequest, res: import('express').Response) {
  const body = req.body;
  const slug = body.slug || slugify(body.title);

  const existing = await prisma.events.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) throw new AppError(400, 'Event slug already exists');

  try {
    const data = await prisma.events.create({
      data: {
        ...body,
        slug,
        created_by: req.admin!.id,
      },
    });

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'create_event',
        resource_type: 'events',
        resource_id: data.id,
      },
    });

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function updateEvent(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  try {
    const data = await prisma.events.update({
      where: { id: eventId },
      data: req.body,
    });

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'update_event',
        resource_type: 'events',
        resource_id: eventId,
      },
    });

    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function deleteEvent(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  try {
    const data = await prisma.$transaction(async (tx) => {
      // Hard delete related announcements first as they don't have cascade delete
      await tx.announcements.deleteMany({
        where: { event_id: eventId },
      });

      // Now delete the event itself (registrations, teams, bookmarks will cascade delete)
      return await tx.events.delete({
        where: { id: eventId },
      });
    });

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'delete_event',
        resource_type: 'events',
        resource_id: eventId,
      },
    });

    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function updateEventStatus(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  const { status } = req.body;
  try {
    const data = await prisma.events.update({
      where: { id: eventId },
      data: { status },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function duplicateEvent(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  const original = await prisma.events.findUnique({
    where: { id: eventId },
  });

  if (!original) throw new AppError(404, 'Event not found');

  const { id, created_at, updated_at, deleted_at, slug, ...rest } = original;
  const newSlug = `${slug}-copy-${Date.now()}`;

  try {
    const data = await prisma.events.create({
      data: {
        ...rest,
        prizes: (rest.prizes as any) || {},
        coordinators: (rest.coordinators as any) || [],
        slug: newSlug,
        title: `${rest.title} (Copy)`,
        status: 'draft',
        created_by: req.admin!.id,
      },
    });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function getEventRegistrations(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  const { status, q, page, limit } = req.query as Record<string, string>;
  const { from, to, page: p, limit: l } = paginate(Number(page || 1), Number(limit || 20));

  const where: any = { event_id: eventId };
  if (status) where.status = status as any;

  try {
    const [registrations, count] = await prisma.$transaction([
      prisma.registrations.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, college: true, branch: true, year: true, phone: true, membership_no: true },
          },
          team: {
            select: { name: true, registration_no: true, members: true },
          },
        },
        orderBy: { registered_at: 'desc' },
        skip: from,
        take: l,
      }),
      prisma.registrations.count({ where }),
    ]) as any;

    // Map singular user/team back to users/teams for frontend compatibility
    let filtered = registrations.map((r: any) => {
      const { user, team, ...rest } = r;
      return {
        ...rest,
        users: user,
        teams: team,
      };
    });

    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (r: any) =>
          r.users?.name?.toLowerCase().includes(lower) ||
          r.users?.college?.toLowerCase().includes(lower) ||
          r.users?.membership_no?.toLowerCase().includes(lower)
      );
    }

    res.json({ success: true, data: filtered, meta: { page: p, limit: l, total: count } });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function exportRegistrations(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  try {
    const data = await prisma.registrations.findMany({
      where: { event_id: eventId },
      include: {
        user: {
          select: { name: true, email: true, college: true, branch: true, phone: true, membership_no: true },
        },
        team: {
          select: { name: true, members: true },
        },
      },
    }) as any[];

    const headers = [
      'Team Leader Name',
      'Team Leader Email',
      'Team Leader Membership ID / Reg No',
      'College',
      'Branch',
      'Team Name',
      'Member 2 Name',
      'Member 2 Membership ID',
      'Member 3 Name',
      'Member 3 Membership ID',
      'Member 4 Name',
      'Member 4 Membership ID',
      'All Teammates (Name & Membership ID)',
      'Status',
      'Registered At',
      'Attended',
      'UTR / Transaction ID',
    ];
    const rows = data.map((r: any) => {
      const membersList = Array.isArray(r.team?.members) ? r.team.members : [];
      
      const m2 = typeof membersList[0] === 'object' && membersList[0] !== null ? membersList[0] : (membersList[0] ? { name: String(membersList[0]), membership_no: '' } : null);
      const m3 = typeof membersList[1] === 'object' && membersList[1] !== null ? membersList[1] : (membersList[1] ? { name: String(membersList[1]), membership_no: '' } : null);
      const m4 = typeof membersList[2] === 'object' && membersList[2] !== null ? membersList[2] : (membersList[2] ? { name: String(membersList[2]), membership_no: '' } : null);

      const formattedMembers = membersList.map((m: any, idx: number) => {
        if (typeof m === 'object' && m !== null) {
          return `Member ${idx + 2}: ${m.name}${m.membership_no ? ` (ID: ${m.membership_no})` : ''}`;
        }
        return `Member ${idx + 2}: ${String(m)}`;
      }).join('; ');

      return [
        r.user?.name || '',
        r.user?.email || '',
        r.user?.membership_no || 'N/A',
        r.user?.college || '',
        r.user?.branch || '',
        r.team?.name || 'Solo',
        m2?.name || '',
        m2?.membership_no || '',
        m3?.name || '',
        m3?.membership_no || '',
        m4?.name || '',
        m4?.membership_no || '',
        formattedMembers || 'N/A',
        r.status,
        r.registered_at.toISOString(),
        r.attended_at ? r.attended_at.toISOString() : 'No',
        r.transaction_id || '',
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=registrations-${eventId}.xlsx`);
    res.send(Buffer.from(buffer));
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}
