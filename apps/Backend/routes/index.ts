import { Router } from "express";
import authRoutes from "./auth.routes";
import appointmentRoutes from "./appointment.routes";

const router = Router();
router.use("/v1/auth", authRoutes);
router.use("/v1/appointments", appointmentRoutes);

export default router;
