import prisma from '../utils/prisma.js';

export const createHealthCheckIn = async (userId: string, data: any) => {
  const mother = await prisma.mother.findUnique({ where: { id: userId } });
  if (!mother) {
    throw new Error('Mother profile not found');
  }

  const checkIn = await prisma.healthCheckIn.create({
    data: {
      motherId: userId,
      status: data.status,
      symptoms: data.symptoms,
      notes: data.notes,
      createdBy: userId,
    },
  });

  // Update lastCheckIn on mother
  await prisma.mother.update({
    where: { id: userId },
    data: { lastCheckIn: new Date(), status: data.status },
  });

  return checkIn;
};

export const getHealthCheckIns = async (motherId: string) => {
  return prisma.healthCheckIn.findMany({
    where: { motherId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getHealthCheckInById = async (id: string) => {
  return prisma.healthCheckIn.findUnique({ where: { id } });
};

export const getWeeklyTipsForMother = async (userId: string) => {
  const mother = await prisma.mother.findUnique({ where: { id: userId } });
  if (!mother) {
    throw new Error('Mother profile not found');
  }

  const week = mother.pregnancyWeek || 1;
  
  // Generate tips based on pregnancy week
  const tips = [
    {
      week,
      title: `Week ${week} Pregnancy Tips`,
      tips: [
        'Eat a balanced diet rich in fruits and vegetables',
        'Stay hydrated - drink at least 8 glasses of water daily',
        'Get adequate rest and sleep',
        'Attend all scheduled prenatal appointments',
        'Take your prenatal vitamins as prescribed',
      ],
    },
  ];

  return tips;
};

export const updateEmergencyContact = async (userId: string, emergencyContact: string) => {
  return prisma.mother.update({
    where: { id: userId },
    data: { emergencyContact },
  });
};

export const getAssignedCHW = async (userId: string) => {
  const mother = await prisma.mother.findUnique({
    where: { id: userId },
    include: {
      assignedChw: {
        include: { user: true },
      },
    },
  });

  if (!mother || !mother.assignedChw) {
    return null;
  }

  return {
    id: mother.assignedChw.id,
    name: mother.assignedChw.user.name,
    phone: mother.assignedChw.user.phone,
    location: mother.assignedChw.user.location,
  };
};
