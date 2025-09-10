import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema, refreshSchema, verifySchema } from "../schemas/auth.schema";
import { optionalAuth, requireAuth } from "../middlewares/auth";

const r = Router();

r.post("/register", validate(registerSchema), ctrl.register);
r.post("/login", validate(loginSchema), ctrl.login);
r.post("/verify", validate(verifySchema), ctrl.verify);
r.post("/refresh", validate(refreshSchema), ctrl.refresh);
r.post("/logout",optionalAuth , ctrl.logout);
r.get("/me", requireAuth, ctrl.me);

export default r;
