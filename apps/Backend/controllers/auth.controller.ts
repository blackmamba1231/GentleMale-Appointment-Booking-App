import type { Request, Response, NextFunction } from "express";
import * as service from "../services/auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.register(req.body);
    res.status(201).json(result);
  } catch (Error: any) { res.status(500).json({ error: "Registration failed" , "message": Error.message }); }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.verify(req.body);
    res.status(201).json(result);
  } catch (e: any) { res.status(500).json({ error: "OTP verification failed" , "message": e.message }); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.login(req.body, req);
    res.status(201).json(result);
  } catch (e: any) { res.status(500).json({ error: "Login failed" , "message": e.message }); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await service.refresh(req.body);
    res.status(201).json(result);
  } catch (e: any) { res.status(500).json({ error: "Token refresh failed" , "message": e.message }); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await service.logout(req.body.sessionId);
    res.status(201).end();
  } catch (e: any) { res.status(500).json({ error: "Logout failed" , "message": e.message }); }
}

export async function me(req: Request, res: Response) {
  try{
  if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
  const result = await service.me(req);
  res.status(201).json(result);
  }catch(e: any){
    res.status(500).json({ error: "Me failed" , "message": e.message });
  }
}

export async function googleOAuth(req: Request, res: Response) {
  const googleAuthUrl = service.googleOAuthService.getGoogleOAuthUrl();
  res.status(201).redirect(googleAuthUrl);
}

export async function googleOAuthCallback(req: Request, res: Response,next: NextFunction) {
   try {
    const { code } = req.query as { code: string };
    const tokens = await service.googleOAuthService.handleGoogleCallback(code);
    res.status(201).json(tokens);
  } catch (e: any) {
    res.status(500).json({ error: "Google OAuth callback failed" , "message": e.message });
  }
}
