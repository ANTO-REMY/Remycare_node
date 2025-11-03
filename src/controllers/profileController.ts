import { Request, Response } from 'express';
import * as profileService from '../services/profileService.js';

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await profileService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch profile' });
  }
};

export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const updated = await profileService.updateUserProfile(userId, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update profile' });
  }
};

export const getMotherProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getMotherProfile(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch mother profile' });
  }
};

export const updateMotherProfile = async (req: Request, res: Response) => {
  try {
    const updated = await profileService.updateMotherProfile(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update mother profile' });
  }
};

export const getCHWProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getCHWProfile(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch CHW profile' });
  }
};

export const updateCHWProfile = async (req: Request, res: Response) => {
  try {
    const updated = await profileService.updateCHWProfile(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update CHW profile' });
  }
};

export const getNurseProfile = async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getNurseProfile(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch nurse profile' });
  }
};

export const updateNurseProfile = async (req: Request, res: Response) => {
  try {
    const updated = await profileService.updateNurseProfile(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update nurse profile' });
  }
};
