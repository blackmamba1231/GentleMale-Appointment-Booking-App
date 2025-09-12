import { Router } from "express";
import * as ctrl from "../controllers/appointment.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema, refreshSchema, verifySchema } from "../schemas/auth.schema";
import { optionalAuth, requireAuth, requireAuthforadmins } from "../middlewares/auth";

const r = Router();

r.post("/book",requireAuth, ctrl.bookAppointment);
r.post("/confirm/:id", requireAuthforadmins, ctrl.confirmAppointment);
r.get("/my-appointments", requireAuth, ctrl.getMyAppointments);
r.get("/all-appointments", requireAuthforadmins, ctrl.getAllAppointments);
r.delete("/cancel/:id", requireAuth, ctrl.cancelAppointment);
export default r;
