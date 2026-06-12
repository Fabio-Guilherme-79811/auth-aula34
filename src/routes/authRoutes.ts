import { Router, Request, Response } from "express";
import * as UserModel from "../models/userModel";

export const authRoutes = Router();

authRoutes.get("/login", (req: Request, res: Response) => {
  const flash = req.session.flash || null;
  req.session.flash = null; 
  res.render("login", { flash });
});

authRoutes.get("/registro", (req: Request, res: Response) => {
  const flash = req.session.flash || null;
  req.session.flash = null;
  res.render("registro", { flash });
});

authRoutes.post("/registro", async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha || senha.trim().length < 6) {
    req.session.flash = "Inconsistência nos dados fornecidos. A senha deve possuir no mínimo 6 caracteres.";
    return res.redirect("/registro");
  }

  try {
    await UserModel.registrar(nome, email, senha);
    req.session.flash = "Conta criada com sucesso!";
    return res.redirect("/login");
  } catch (error: any) {
    req.session.flash = error.message || "Falha operacional ao registrar usuário.";
    return res.redirect("/registro");
  }
});

authRoutes.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    req.session.flash = "Parâmetros obrigatórios ausentes.";
    return res.redirect("/login");
  }

  const usuario = await UserModel.login(email, senha);

  if (!usuario) {
    req.session.flash = "Email ou senha incorretos";
    return res.redirect("/login");
  }

  req.session.userId = usuario.id;
  req.session.userName = usuario.nome;
  return res.redirect("/tarefas");
});

authRoutes.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/tarefas");
    }
    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
});