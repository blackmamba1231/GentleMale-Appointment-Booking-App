import type { Request, Response, NextFunction } from "express";
import * as service from "../services/appointment.service";

export async function bookAppointment(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.bookAppointment(req.body, req);
    res.status(201).json(result);
  } catch (e) { next(e); }
}

export async function getMyAppointments(req: Request, res: Response, next: NextFunction) {
    try{
        const result = await service.getMyAppointments(req);
        res.status(200).json(result);
    }catch (e) { next(e); }
}

export async function getAllAppointments(req: Request, res: Response, next: NextFunction) {
  try{
    const result = await service.getAllAppointments(req);
    res.status(200).json(result);
  }catch (e) { next(e); }
}

export async function confirmAppointment(req: Request, res: Response, next: NextFunction) {
  try{
    const { id } = req.params;
    if (typeof id !== 'string') throw new Error('Invalid appointment id');
    const result = await service.confirmAppointment({ id }, req);
    res.status(200).json(result);
  }catch (e) { next(e); }
}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try{
    const { id } = req.params; 
    if (typeof id !== 'string') throw new Error('Invalid appointment id');

    const result = await service.cancelAppointment({ id }, req);
      res.status(200).json(result);
    } catch (e) { next(e); }
}

export async function getServices(req: Request, res: Response, next: NextFunction) {
  try{
    const result = await service.getServices(req);
    res.status(200).json(result);
  }catch (e) { next(e); }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try{
    const result = await service.createService(req);
    res.status(200).json(result);
  }catch (e) { next(e); }
}