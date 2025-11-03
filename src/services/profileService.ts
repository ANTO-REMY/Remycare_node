import { PrismaClient } from '@prisma/client';
import * as auditService from './auditService.js';

const prisma = new PrismaClient();

export const getUserProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      mother: true,
      chw: true,
      nurse: true,
    },
  });
};

export const updateUserProfile = async (userId: string, data: any) => {
  const oldProfile = await prisma.user.findUnique({ where: { id: userId } });
  
  const updated = await prisma.user.update({
    where: { id: userId },
    data,
  });

  // Audit log
  await auditService.createAuditLog({
    userId,
    action: 'PROFILE_UPDATED',
    resourceType: 'User',
    resourceId: userId,
    oldValues: oldProfile,
    newValues: updated,
  });

  return updated;
};

export const getMotherProfile = async (id: string) => {
  return prisma.mother.findUnique({
    where: { id },
    include: { user: true, assignedChw: true },
  });
};

export const updateMotherProfile = async (id: string, data: any) => {
  return prisma.mother.update({
    where: { id },
    data,
  });
};

export const getCHWProfile = async (id: string) => {
  return prisma.chw.findUnique({
    where: { id },
    include: { user: true, mothers: true },
  });
};

export const updateCHWProfile = async (id: string, data: any) => {
  return prisma.chw.update({
    where: { id },
    data,
  });
};

export const getNurseProfile = async (id: string) => {
  return prisma.nurse.findUnique({
    where: { id },
    include: { user: true },
  });
};

export const updateNurseProfile = async (id: string, data: any) => {
  return prisma.nurse.update({
    where: { id },
    data,
  });
};
