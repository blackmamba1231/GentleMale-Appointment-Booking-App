import { Router } from "express";
import * as ctrl from "../controllers/appointment.controller";
import { validate } from "../middlewares/validate";
import { createAppointmentSchema } from "../schemas/appointment.schema";
import { requireAuth } from "../middlewares/auth";

const r = Router();

r.post("/", requireAuth, validate(createAppointmentSchema), ctrl.createAppointment);
r.get("/", requireAuth, ctrl.getAppointments);
r.get("/:id", requireAuth, ctrl.getAppointmentById);
r.delete("/:id", requireAuth, ctrl.deleteAppointment);

export default r;
