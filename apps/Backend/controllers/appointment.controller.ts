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
        
    }catch (e) { next(e); }
}

export async function getAllAppointments(req: Request, res: Response, next: NextFunction) {

}

export async function confirmAppointment(req: Request, res: Response, next: NextFunction) {

}

export async function cancelAppointment(req: Request, res: Response, next: NextFunction) {

}