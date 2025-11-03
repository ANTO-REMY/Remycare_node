import prisma from '../utils/prisma.js';

export const getEscalatedCases = async (filters: { status?: string; priority?: string }) => {
  const where: any = {};
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.priority) {
    where.priority = filters.priority;
  }

  return prisma.caseEscalation.findMany({
    where,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
  });
};

export const getCaseById = async (id: string) => {
  const caseData = await prisma.caseEscalation.findUnique({
    where: { id },
  });

  if (!caseData) {
    throw new Error('Case not found');
  }

  // Get additional details about mother and CHW
  const mother = await prisma.mother.findUnique({
    where: { id: caseData.motherId },
    include: { user: true },
  });

  const chw = await prisma.cHW.findUnique({
    where: { id: caseData.chwId },
    include: { user: true },
  });

  return {
    ...caseData,
    mother: mother ? {
      id: mother.id,
      name: mother.user.name,
      phone: mother.user.phone,
      pregnancyWeek: mother.pregnancyWeek,
    } : null,
    chw: chw ? {
      id: chw.id,
      name: chw.user.name,
      phone: chw.user.phone,
    } : null,
  };
};

export const assignCaseToNurse = async (caseId: string, nurseId: string) => {
  return prisma.caseEscalation.update({
    where: { id: caseId },
    data: {
      nurseId,
      status: 'in_progress',
      updatedAt: new Date(),
    },
  });
};

export const resolveCase = async (caseId: string, data: any) => {
  return prisma.caseEscalation.update({
    where: { id: caseId },
    data: {
      status: 'resolved',
      resolution: data.resolution,
      notes: data.notes,
      resolvedAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

export const getNurseStatistics = async (nurseId: string) => {
  const totalCases = await prisma.caseEscalation.count({
    where: { nurseId },
  });

  const openCases = await prisma.caseEscalation.count({
    where: { nurseId, status: 'open' },
  });

  const inProgressCases = await prisma.caseEscalation.count({
    where: { nurseId, status: 'in_progress' },
  });

  const resolvedCases = await prisma.caseEscalation.count({
    where: { nurseId, status: 'resolved' },
  });

  const criticalCases = await prisma.caseEscalation.count({
    where: { nurseId, priority: 'critical' },
  });

  return {
    totalCases,
    openCases,
    inProgressCases,
    resolvedCases,
    criticalCases,
  };
};
