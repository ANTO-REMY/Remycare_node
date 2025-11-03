import { Request, Response } from 'express';
import * as nurseService from '../services/nurseService';

export const getEscalatedCases = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const priority = req.query.priority as string;
    const cases = await nurseService.getEscalatedCases({ status, priority });
    res.json(cases);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch cases' });
  }
};

export const getCaseById = async (req: Request, res: Response) => {
  try {
    const caseData = await nurseService.getCaseById(req.params.id);
    res.json(caseData);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch case' });
  }
};

export const assignCaseToSelf = async (req: Request, res: Response) => {
  try {
    const nurseId = (req as any).user.userId;
    const updated = await nurseService.assignCaseToNurse(req.params.id, nurseId);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to assign case' });
  }
};

export const resolveCase = async (req: Request, res: Response) => {
  try {
    const updated = await nurseService.resolveCase(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to resolve case' });
  }
};

export const getNurseStats = async (req: Request, res: Response) => {
  try {
    const nurseId = (req as any).user.userId;
    const stats = await nurseService.getNurseStatistics(nurseId);
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch statistics' });
  }
};
