import { Router, Request, Response } from "express";
import * as UserModel from "../models/userModel";
import { listarTodas } from "../models/tarefaModel"; // Necessário implementar listarTodas no model
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { Role } from "../models/userModel";

export const adminRoutes = Router();

adminRoutes.get("/admin", requireAuth, requireRole(Role.ADMIN), async (req: Request, res: Response) => {
  const usuarios = await UserModel.listarTodos();
  const tarefas = await listarTodas(); // Lista tarefas de todos os usuários
  
  res.render("admin", { 
    usuarios, 
    tarefas, 
    userName: req.session.userName,
    flash: req.session.flash 
  });
  req.session.flash = null;
});