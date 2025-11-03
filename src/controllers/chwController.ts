import { Request, Response } from 'express';
import * as chwService from '../services/chwService';

export const getAssignedMothers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const mothers = await chwService.getAssignedMothers(userId);
    res.json(mothers);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch assigned mothers' });
  }
};

export const getMotherDetails = async (req: Request, res: Response) => {
  try {
    const mother = await chwService.getMotherDetails(req.params.id);
    res.json(mother);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch mother details' });
  }
};

export const escalateCase = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const escalation = await chwService.escalateCase(userId, req.body);
    res.status(201).json(escalation);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to escalate case' });
  }
};

export const createMotherCheckIn = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const checkIn = await chwService.createMotherCheckIn(userId, req.params.motherId, req.body);
    res.status(201).json(checkIn);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create check-in' });
  }
};
