import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { AdminAuthRequest } from '../middleware/adminAuth';
import bcrypt from 'bcryptjs';

export async function getDashboard(req: AdminAuthRequest, res: import('express').Response) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const [eventsCount, registrationsCount, checkinsCount, confirmedRegistrations] = await Promise.all([
      prisma.events.count({ where: { deleted_at: null } }),
      prisma.registrations.count({ where: { status: { not: 'cancelled' } } }),
      prisma.registrations.count({ where: { attended_at: { gte: today } } }),
      prisma.registrations.findMany({
        where: { status: 'confirmed' },
        select: {
          event: {
            select: {
              is_team_event: true,
              amount: true,
              per_person_amount: true,
            },
          },
          team: {
            select: {
              members: true,
            },
          },
        },
      }),
    ]);

    const revenue = confirmedRegistrations.reduce((sum, reg) => {
      const event = reg.event;
      if (!event) return sum;
      let cost = event.amount || 0;
      if (event.is_team_event && reg.team) {
        const baseAmount = event.per_person_amount || event.amount || 0;
        let membersCount = 0;
        if (Array.isArray(reg.team.members)) {
          membersCount = reg.team.members.length;
        } else if (typeof reg.team.members === 'string') {
          try {
            membersCount = JSON.parse(reg.team.members).length;
          } catch (e) {
            membersCount = 0;
          }
        }
        cost = baseAmount * (membersCount + 1);
      }
      return sum + cost;
    }, 0);

    res.json({
      success: true,
      data: {
        totalEvents: eventsCount,
        totalRegistrations: registrationsCount,
        checkinsToday: checkinsCount,
        revenue,
      },
    });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function getAnalytics(req: AdminAuthRequest, res: import('express').Response) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const registrations = await prisma.registrations.findMany({
      where: {
        registered_at: { gte: thirtyDaysAgo },
        status: { not: 'cancelled' },
      },
      select: {
        registered_at: true,
        user_id: true,
        event_id: true,
        user: { select: { college: true } },
        event: { select: { title: true } },
      },
    }) as any[];

    const dailyCounts: Record<string, number> = {};
    const collegeCounts: Record<string, number> = {};
    const eventCounts: Record<string, number> = {};

    registrations.forEach((r: any) => {
      const day = r.registered_at.toISOString().split('T')[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;

      const college = r.user?.college || 'Unknown';
      collegeCounts[college] = (collegeCounts[college] || 0) + 1;

      const title = r.event?.title || r.event_id;
      eventCounts[title] = (eventCounts[title] || 0) + 1;
    });

    const topEvents = Object.entries(eventCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, count]) => ({ title, count }));

    res.json({
      success: true,
      data: {
        dailyRegistrations: Object.entries(dailyCounts).map(([date, count]) => ({ date, count })),
        collegeBreakdown: Object.entries(collegeCounts).map(([college, count]) => ({ college, count })),
        topEvents,
      },
    });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function listUsers(req: AdminAuthRequest, res: import('express').Response) {
  const { role, q, page = '1', limit = '20' } = req.query as Record<string, string>;
  const p = Math.max(1, Number(page));
  const l = Math.min(100, Number(limit));
  const from = (p - 1) * l;

  const where: any = {};
  if (role) where.role = role as any;
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { college: { contains: q, mode: 'insensitive' } },
    ];
  }

  try {
    const [data, count] = await prisma.$transaction([
      prisma.users.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: from,
        take: l,
      }),
      prisma.users.count({ where }),
    ]);

    res.json({ success: true, data, meta: { page: p, limit: l, total: count } });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function listAdminUsers(req: AdminAuthRequest, res: import('express').Response) {
  try {
    const data = await prisma.admin_users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totp_enabled: true,
        last_login_at: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function updateUserRole(req: AdminAuthRequest, res: import('express').Response) {
  const { role } = req.body;
  const adminUserId = req.params.id as string;
  try {
    const data = await prisma.admin_users.update({
      where: { id: adminUserId },
      data: { role: role as any },
      select: { id: true, email: true, name: true, role: true },
    });

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'update_role',
        resource_type: 'admin_users',
        resource_id: adminUserId,
        metadata: { role },
      },
    });

    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function createAnnouncement(req: AdminAuthRequest, res: import('express').Response) {
  const body = req.body;
  try {
    const data = await prisma.announcements.create({
      data: {
        ...body,
        created_by: req.admin!.id,
        sent_at: body.scheduled_at ? null : new Date(),
      },
    });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function listAnnouncements(req: AdminAuthRequest, res: import('express').Response) {
  try {
    const data = await prisma.announcements.findMany({
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function listPublicAnnouncements(_req: import('express').Request, res: import('express').Response) {
  try {
    const data = await prisma.announcements.findMany({
      where: {
        scope: 'all',
        sent_at: { not: null },
      },
      select: {
        id: true,
        title: true,
        body: true,
        scope: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function getEventAttendanceCount(req: AdminAuthRequest, res: import('express').Response) {
  const eventId = req.params.id as string;
  try {
    const [total, attended] = await Promise.all([
      prisma.registrations.count({
        where: {
          event_id: eventId,
          status: 'confirmed',
        },
      }),
      prisma.registrations.count({
        where: {
          event_id: eventId,
          attended_at: { not: null },
        },
      }),
    ]);

    res.json({
      success: true,
      data: { total, attended },
    });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function updateUser(req: AdminAuthRequest, res: import('express').Response) {
  const userId = req.params.id as string;
  try {
    const data = await prisma.users.update({
      where: { id: userId },
      data: req.body,
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function deleteUser(req: AdminAuthRequest, res: import('express').Response) {
  const userId = req.params.id as string;
  try {
    // Delete registrations, bookmarks, and teams leader links first if needed, or let DB cascade delete.
    // The teams model hasleader_id as foreign key. 
    // In schema.prisma, teams.leader has no cascade delete set, but let's delete user cleanly.
    // If cascade delete is not set on leader, we should delete registrations and then user.
    // Prisma will throw error if foreign key fails, so let's delete teams led by the user or registrations.
    // Let's do a transaction:
    await prisma.$transaction([
      prisma.registrations.deleteMany({ where: { user_id: userId } }),
      prisma.bookmarks.deleteMany({ where: { user_id: userId } }),
      prisma.teams.deleteMany({ where: { leader_id: userId } }),
      prisma.users.delete({ where: { id: userId } }),
    ]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

const SALT_ROUNDS = 12;

export async function updateAdminUser(req: AdminAuthRequest, res: import('express').Response) {
  const adminUserId = req.params.id as string;
  const { email, password, name, role } = req.body;

  try {
    const existing = await prisma.admin_users.findUnique({
      where: { id: adminUserId },
    });
    if (!existing) {
      throw new AppError(404, 'Admin user not found');
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (role !== undefined) {
      if (req.admin!.id === adminUserId && existing.role === 'super_admin' && role !== 'super_admin') {
        throw new AppError(400, 'You cannot demote yourself from super_admin role');
      }
      updateData.role = role as any;
    }
    if (password) {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      updateData.password_hash = hash;
    }

    const data = await prisma.admin_users.update({
      where: { id: adminUserId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, created_at: true },
    });

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'update_admin_user',
        resource_type: 'admin_users',
        resource_id: adminUserId,
        metadata: {
          updated_fields: Object.keys(updateData).filter(k => k !== 'password_hash'),
        },
      },
    });

    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function deleteAdminUser(req: AdminAuthRequest, res: import('express').Response) {
  const adminUserId = req.params.id as string;

  try {
    if (req.admin!.id === adminUserId) {
      throw new AppError(400, 'You cannot delete your own account');
    }

    const existing = await prisma.admin_users.findUnique({
      where: { id: adminUserId },
    });
    if (!existing) {
      throw new AppError(404, 'Admin user not found');
    }

    await prisma.$transaction([
      prisma.events.updateMany({
        where: { created_by: adminUserId },
        data: { created_by: null },
      }),
      prisma.announcements.updateMany({
        where: { created_by: adminUserId },
        data: { created_by: null },
      }),
      prisma.audit_logs.updateMany({
        where: { admin_id: adminUserId },
        data: { admin_id: null },
      }),
      prisma.admin_users.delete({
        where: { id: adminUserId },
      }),
    ]);

    await prisma.audit_logs.create({
      data: {
        admin_id: req.admin!.id,
        action: 'delete_admin_user',
        resource_type: 'admin_users',
        resource_id: adminUserId,
        metadata: {
          deleted_email: existing.email,
          deleted_name: existing.name,
        },
      },
    });

    res.json({ success: true, message: 'Admin user deleted successfully' });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function deleteAnnouncement(req: AdminAuthRequest, res: import('express').Response) {
  const announcementId = req.params.id as string;
  try {
    const existing = await prisma.announcements.findUnique({
      where: { id: announcementId },
    });
    if (!existing) {
      throw new AppError(404, 'Announcement not found');
    }

    await prisma.announcements.delete({
      where: { id: announcementId },
    });

    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}


