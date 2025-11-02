import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface RegisterData {
  phone: string;
  password: string;
  name: string;
  role: 'mother' | 'chw' | 'nurse';
  email?: string;
  location?: string;
}

export interface LoginData {
  phone: string;
  password: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
}

export const registerUser = async (data: RegisterData): Promise<AuthTokens> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { phone: data.phone }
  });

  if (existingUser) {
    throw new Error('User with this phone number already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      phone: data.phone,
      password: hashedPassword,
      name: data.name,
      role: data.role,
      email: data.email,
      location: data.location
    }
  });

  // Create role-specific record
  if (data.role === 'mother') {
    await prisma.mother.create({
      data: {
        id: user.id,
        status: 'ok'
      }
    });
  } else if (data.role === 'chw') {
    await prisma.cHW.create({
      data: {
        id: user.id
      }
    });
  } else if (data.role === 'nurse') {
    await prisma.nurse.create({
      data: {
        id: user.id
      }
    });
  }

  // Create session
  const sessionId = uuidv4();
  const accessToken = generateAccessToken({ userId: user.id, role: user.role, sessionId });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, sessionId });

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    }
  };
};

export const loginUser = async (data: LoginData): Promise<AuthTokens> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { phone: data.phone }
  });

  if (!user || user.role !== data.role) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await comparePassword(data.password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Create session
  const sessionId = uuidv4();
  const accessToken = generateAccessToken({ userId: user.id, role: user.role, sessionId });
  const refreshToken = generateRefreshToken({ userId: user.id, role: user.role, sessionId });

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role
    }
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      isActive: true,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  });

  if (!session) {
    throw new Error('Invalid or expired refresh token');
  }

  const accessToken = generateAccessToken({
    userId: session.user.id,
    role: session.user.role,
    sessionId: session.id
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { lastUsed: new Date() }
  });

  return { accessToken };
};

export const logoutUser = async (sessionId: string): Promise<void> => {
  await prisma.session.update({
    where: { id: sessionId },
    data: { isActive: false }
  });
};
