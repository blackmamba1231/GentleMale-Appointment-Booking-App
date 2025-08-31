import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema, refreshSchema } from "../schemas/auth.schema";
import { requireAuth } from "../middlewares/auth";

const r = Router();

r.post("/register", validate(registerSchema), ctrl.register);
r.post("/login", validate(loginSchema), ctrl.login);
r.post("/refresh", validate(refreshSchema), ctrl.refresh);
r.post("/logout", requireAuth, ctrl.logout);
r.get("/me", requireAuth, ctrl.me);

export default r;
