import { Request, Response, NextFunction } from "express";
import { Role } from "../models/userModel";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    req.session.flash = "Sessão expirada ou inexistente. Autentique-se.";
    return res.redirect("/login");
  }
  next();
}

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session.role !== role) {
      req.session.flash = "Acesso negado: privilégios insuficientes.";
      return res.redirect("/tarefas");
    }
    next();
  };
}