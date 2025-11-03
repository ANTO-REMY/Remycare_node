import { Request, Response } from 'express';
import * as motherService from '../services/motherService';

export const createCheckIn = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const checkIn = await motherService.createHealthCheckIn(userId, req.body);
    res.status(201).json(checkIn);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create check-in' });
  }
};

export const getCheckIns = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const motherId = req.query.motherId as string;
    const checkIns = await motherService.getHealthCheckIns(motherId || userId);
    res.json(checkIns);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch check-ins' });
  }
};

export const getCheckInById = async (req: Request, res: Response) => {
  try {
    const checkIn = await motherService.getHealthCheckInById(req.params.id);
    res.json(checkIn);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch check-in' });
  }
};

export const getWeeklyTips = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const tips = await motherService.getWeeklyTipsForMother(userId);
    res.json(tips);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch tips' });
  }
};

export const updateEmergencyContact = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const updated = await motherService.updateEmergencyContact(userId, req.body.emergencyContact);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update emergency contact' });
  }
};

export const getAssignedCHW = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const chw = await motherService.getAssignedCHW(userId);
    res.json(chw);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch assigned CHW' });
  }
};
