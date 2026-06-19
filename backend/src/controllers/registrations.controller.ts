import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';
import { generateJoinCode } from '../utils/helpers';
import { generateTicketPdf } from '../services/ticket';
import { AuthRequest } from '../middleware/clerkAuth';
import { AdminAuthRequest } from '../middleware/adminAuth';

export async function registerForEvent(req: AuthRequest, res: import('express').Response) {
  const userId = req.userId!;
  const event_id = req.body.event_id as string;
  const team_name = req.body.team_name as string | undefined;
  const team_members = req.body.team_members as string[] | undefined;

  // Validate user profile onboarding exists
  const userExists = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!userExists) {
    throw new AppError(400, 'Profile onboarding not completed. Please complete your profile onboarding on the dashboard first.');
  }

  const event = await prisma.events.findFirst({
    where: {
      id: event_id,
      deleted_at: null,
    },
  });

  if (!event) throw new AppError(404, 'Event not found');
  if (event.status !== 'open') throw new AppError(400, 'Registration is not open');
  const now = new Date();
  if (now < event.reg_start_at || now > event.reg_end_at) {
    throw new AppError(400, 'Registration window is closed');
  }

  const existing = await prisma.registrations.findFirst({
    where: {
      event_id,
      user_id: userId,
    },
    select: { id: true },
  });
  if (existing) throw new AppError(400, 'Already registered for this event');

  if (event.participant_cap) {
    const count = await prisma.registrations.count({
      where: {
        event_id,
        status: { not: 'cancelled' },
      },
    });
    if (count >= event.participant_cap) {
      throw new AppError(400, 'Event is full');
    }
  }

  let teamId: string | null = null;
  let registration_no = '';

  if (event.is_team_event) {
    if (!team_name) throw new AppError(400, 'Team name required for team events');
    const members = team_members || [];
    const totalSize = members.length + 1; // leader + teammates
    if (totalSize > event.max_team_size) {
      throw new AppError(400, `Team size cannot exceed ${event.max_team_size} members`);
    }
    const joinCode = generateJoinCode();
    const regNo = `TF26-${joinCode}`;
    try {
      const team = await prisma.teams.create({
        data: {
          event_id,
          name: team_name,
          registration_no: regNo,
          leader_id: userId,
          members: team_members || [],
          code_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      });
      teamId = team.id;
      registration_no = regNo;
    } catch (teamError: any) {
      throw new AppError(400, teamError.message);
    }
  } else {
    const randomCode = generateJoinCode();
    registration_no = `TF26-${randomCode}`;
  }

  // Enforce payment proof if event requires payment
  const requiresPayment = !!event.payment_qr_url || !!event.bank_name;
  if (requiresPayment && !req.body.payment_proof_url) {
    throw new AppError(400, 'Payment proof screenshot is required for this event');
  }

  // Admin approval required if event requires_approval OR has payment details configured
  const requiresApproval = event.requires_approval || requiresPayment;
  const status = requiresApproval ? 'pending' : 'confirmed';

  try {
    const registration = await prisma.registrations.create({
      data: {
        event_id,
        user_id: userId,
        team_id: teamId,
        status,
        qr_token: uuidv4(),
        registration_no,
        payment_proof_url: req.body.payment_proof_url || null,
        payment_proof_file_id: req.body.payment_proof_file_id || null,
      },
      include: {
        team: {
          select: { registration_no: true, name: true, members: true },
        },
      },
    }) as any;

    const { team, ...rest } = registration;
    res.status(201).json({ success: true, data: { ...rest, teams: team } });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function joinTeam(req: AuthRequest, res: import('express').Response) {
  const userId = req.userId!;
  const join_code = req.body.join_code as string;
  const event_id = req.body.event_id as string;

  // Validate user profile onboarding exists
  const userExists = await prisma.users.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!userExists) {
    throw new AppError(400, 'Profile onboarding not completed. Please complete your profile onboarding on the dashboard first.');
  }

  const formattedCode = join_code.toUpperCase().startsWith('TF26-') ? join_code.toUpperCase() : `TF26-${join_code.toUpperCase()}`;
  const team = await prisma.teams.findFirst({
    where: {
      registration_no: formattedCode,
      event_id,
    },
    include: {
      event: true,
    },
  }) as any;

  if (!team) throw new AppError(404, 'Invalid registration code');
  if (team.code_expires_at < new Date()) throw new AppError(400, 'Registration code expired');

  const count = await prisma.registrations.count({
    where: {
      team_id: team.id,
      status: { not: 'cancelled' },
    },
  });

  const event = team.event;
  if (count >= event.max_team_size) {
    throw new AppError(400, 'Team is full');
  }

  const existing = await prisma.registrations.findFirst({
    where: {
      event_id,
      user_id: userId,
    },
    select: { id: true },
  });
  if (existing) throw new AppError(400, 'Already registered');

  // Admin approval required if event requires_approval OR has payment details configured
  const requiresApproval = event.requires_approval || !!event.payment_qr_url || !!event.bank_name;
  const status = requiresApproval ? 'pending' : 'confirmed';

  try {
    const registration = await prisma.registrations.create({
      data: {
        event_id,
        user_id: userId,
        team_id: team.id,
        status,
        qr_token: uuidv4(),
        registration_no: team.registration_no,
        payment_proof_url: req.body.payment_proof_url || null,
        payment_proof_file_id: req.body.payment_proof_file_id || null,
      },
      include: {
        team: {
          select: { name: true, registration_no: true, members: true },
        },
      },
    }) as any;

    const { team: teamData, ...rest } = registration;
    res.status(201).json({ success: true, data: { ...rest, teams: teamData } });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function myRegistrations(req: AuthRequest, res: import('express').Response) {
  try {
    const data = await prisma.registrations.findMany({
      where: { user_id: req.userId! },
      include: {
        event: true,
        team: {
          select: { name: true, registration_no: true },
        },
      },
      orderBy: { registered_at: 'desc' },
    }) as any[];

    const formatted = data.map((r) => {
      const { event, team, ...rest } = r;
      return {
        ...rest,
        events: event,
        teams: team,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function downloadTicket(req: AuthRequest, res: import('express').Response) {
  const regId = req.params.id as string;
  const reg = await prisma.registrations.findFirst({
    where: {
      id: regId,
      user_id: req.userId!,
    },
    include: {
      event: {
        select: { title: true, event_start_at: true, venue: true, category: true },
      },
      user: {
        select: { name: true, college: true, email: true, phone: true, branch: true },
      },
      team: {
        select: { name: true, members: true },
      },
    },
  }) as any;

  if (!reg) throw new AppError(404, 'Registration not found');
  if (reg.status !== 'confirmed') throw new AppError(400, 'Ticket available only for confirmed registrations');

  const membersList = Array.isArray(reg.team?.members) ? (reg.team.members as string[]) : [];

  const pdf = await generateTicketPdf({
    eventTitle: reg.event.title,
    userName: reg.user.name,
    college: reg.user.college,
    qrToken: reg.qr_token,
    eventDate: reg.event.event_start_at.toLocaleString('en-IN'),
    venue: reg.event.venue || undefined,
    userEmail: reg.user.email,
    userPhone: reg.user.phone || undefined,
    userBranch: reg.user.branch || undefined,
    teamName: reg.team?.name || undefined,
    teamMembers: membersList.length > 0 ? membersList : undefined,
    category: reg.event.category,
    registrationNo: reg.registration_no || undefined,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ticket-${reg.id}.pdf`);
  res.send(pdf);
}

export async function cancelRegistration(req: AuthRequest, res: import('express').Response) {
  const regId = req.params.id as string;
  const reg = await prisma.registrations.findFirst({
    where: {
      id: regId,
      user_id: req.userId!,
    },
    include: {
      event: {
        select: { allow_cancellation: true, reg_end_at: true },
      },
    },
  }) as any;

  if (!reg) throw new AppError(404, 'Registration not found');
  if (!reg.event.allow_cancellation) throw new AppError(400, 'Cancellation not allowed');
  if (new Date() > reg.event.reg_end_at) throw new AppError(400, 'Cancellation deadline passed');

  try {
    const data = await prisma.registrations.update({
      where: { id: regId },
      data: { status: 'cancelled' },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function scanQr(req: AdminAuthRequest, res: import('express').Response) {
  let qr_token = req.body.qr_token as string;

  // Extract from URL if scanned as verify URL
  if (qr_token.includes('/')) {
    const parts = qr_token.split('/');
    qr_token = parts[parts.length - 1];
  }
  qr_token = qr_token.trim();

  const reg = await prisma.registrations.findFirst({
    where: {
      OR: [
        { qr_token: qr_token },
        { registration_no: qr_token }
      ]
    },
    include: {
      event: { select: { title: true } },
      user: { select: { name: true, email: true, college: true } },
    },
  }) as any;

  if (!reg) throw new AppError(404, 'Invalid Registration ID');
  if (reg.status !== 'confirmed') throw new AppError(400, 'Registration not confirmed');

  if (reg.attended_at) {
    const { event, user, ...rest } = reg;
    return res.json({
      success: true,
      data: {
        ...rest,
        events: event,
        users: user,
        duplicate: true,
        message: 'Already checked in',
      },
    });
  }

  try {
    const data = await prisma.registrations.update({
      where: { id: reg.id },
      data: { attended_at: new Date() },
      include: {
        event: { select: { title: true } },
        user: { select: { name: true, email: true, college: true } },
      },
    }) as any;

    const { event, user, ...rest } = data;
    res.json({
      success: true,
      data: {
        ...rest,
        events: event,
        users: user,
        duplicate: false,
      },
    });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function updateRegistrationStatus(req: AdminAuthRequest, res: import('express').Response) {
  const { status } = req.body;
  const regId = req.params.id as string;
  try {
    const data = await prisma.registrations.update({
      where: { id: regId },
      data: { status: status as any },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function toggleBookmark(req: AuthRequest, res: import('express').Response) {
  const event_id = req.body.event_id as string;
  const userId = req.userId!;

  const existing = await prisma.bookmarks.findFirst({
    where: {
      user_id: userId,
      event_id,
    },
    select: { id: true },
  });

  if (existing) {
    await prisma.bookmarks.delete({
      where: { id: existing.id },
    });
    return res.json({ success: true, data: { bookmarked: false } });
  }

  try {
    await prisma.bookmarks.create({
      data: {
        user_id: userId,
        event_id,
      },
    });
    res.json({ success: true, data: { bookmarked: true } });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}

export async function myBookmarks(req: AuthRequest, res: import('express').Response) {
  try {
    const data = await prisma.bookmarks.findMany({
      where: { user_id: req.userId! },
      include: {
        event: true,
      },
    }) as any[];

    const formatted = data.map((b) => {
      const { event, ...rest } = b;
      return {
        ...rest,
        events: event,
      };
    });

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    throw new AppError(500, error.message);
  }
}

export async function toggleAttendance(req: AdminAuthRequest, res: import('express').Response) {
  const regId = req.params.id as string;
  const reg = await prisma.registrations.findUnique({
    where: { id: regId },
  });

  if (!reg) throw new AppError(404, 'Registration not found');

  try {
    const data = await prisma.registrations.update({
      where: { id: regId },
      data: {
        attended_at: reg.attended_at ? null : new Date(),
      },
    });
    res.json({ success: true, data });
  } catch (error: any) {
    throw new AppError(400, error.message);
  }
}
