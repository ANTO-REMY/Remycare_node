import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogData {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export const createAuditLog = async (data: AuditLogData) => {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
      newValues: data.newValues ? JSON.stringify(data.newValues) : null,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  });
};

export const getAuditLogs = async (filters: { userId?: string; resourceType?: string; action?: string }) => {
  const where: any = {};
  
  if (filters.userId) {
    where.userId = filters.userId;
  }
  
  if (filters.resourceType) {
    where.resourceType = filters.resourceType;
  }
  
  if (filters.action) {
    where.action = filters.action;
  }

  return prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
};
