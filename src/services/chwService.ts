import { PrismaClient } from '@prisma/client';
import * as auditService from './auditService.js';

const prisma = new PrismaClient();

export const getAssignedMothers = async (chwId: string) => {
  const chw = await prisma.cHW.findUnique({
    where: { id: chwId },
    include: {
      mothers: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!chw) {
    throw new Error('CHW profile not found');
  }

  return chw.mothers.map((mother: any) => ({
    id: mother.id,
    name: mother.user.name,
    phone: mother.user.phone,
    location: mother.user.location,
    dueDate: mother.dueDate,
    pregnancyWeek: mother.pregnancyWeek,
    status: mother.status,
    lastCheckIn: mother.lastCheckIn,
  }));
};

export const getMotherDetails = async (motherId: string) => {
  const mother = await prisma.mother.findUnique({
    where: { id: motherId },
    include: {
      user: true,
    },
  });

  if (!mother) {
    throw new Error('Mother not found');
  }

  // Get recent check-ins separately
  const recentCheckIns = await (prisma as any).healthCheckIn.findMany({
    where: { motherId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    id: mother.id,
    name: mother.user.name,
    phone: mother.user.phone,
    location: mother.user.location,
    email: mother.user.email,
    dueDate: mother.dueDate,
    pregnancyWeek: mother.pregnancyWeek,
    postpartumWeek: mother.postpartumWeek,
    status: mother.status,
    medicalHistory: mother.medicalHistory,
    emergencyContact: mother.emergencyContact,
    lastCheckIn: mother.lastCheckIn,
    recentCheckIns,
  };
};

export const escalateCase = async (chwId: string, data: any) => {
  const escalation = await (prisma as any).caseEscalation.create({
    data: {
      motherId: data.motherId,
      chwId,
      priority: data.priority || 'medium',
      status: 'open',
      issueType: data.issueType,
      description: data.description,
      notes: data.notes,
    },
  });

  // Audit log
  await auditService.createAuditLog({
    userId: chwId,
    action: 'CASE_ESCALATED',
    resourceType: 'CaseEscalation',
    resourceId: escalation.id,
    newValues: { motherId: data.motherId, priority: data.priority, issueType: data.issueType },
  });

  return escalation;
};

export const createMotherCheckIn = async (chwId: string, motherId: string, data: any) => {
  // Verify the mother is assigned to this CHW
  const mother = await prisma.mother.findFirst({
    where: {
      id: motherId,
      assignedChwId: chwId,
    },
  });

  if (!mother) {
    throw new Error('Mother not assigned to this CHW');
  }

  const checkIn = await (prisma as any).healthCheckIn.create({
    data: {
      motherId,
      status: data.status,
      symptoms: data.symptoms,
      notes: data.notes,
      createdBy: chwId,
    },
  });

  // Update lastCheckIn on mother
  await prisma.mother.update({
    where: { id: motherId },
    data: { lastCheckIn: new Date(), status: data.status },
  });

  return checkIn;
};
