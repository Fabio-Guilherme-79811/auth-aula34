import { Router, Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";

export const tarefaRoutes = Router();

tarefaRoutes.get("/tarefas", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    req.session.flash = "Acesso negado. Autenticação requerida.";
    return res.redirect("/login");
  }

  const flash = req.session.flash || null;
  req.session.flash = null;

  const tarefas = await TarefaModel.listarPorUsuario(req.session.userId);
  return res.render("tarefas", {
    nome: req.session.userName,
    tarefas,
    flash
  });
});

tarefaRoutes.post("/tarefas", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }

  const { texto } = req.body;

  if (!texto || (texto as string).trim() === "") {
    req.session.flash = "O conteúdo da tarefa não preenche os requisitos mínimos de validação.";
    return res.redirect("/tarefas");
  }

  await TarefaModel.adicionar(req.session.userId, texto);
  req.session.flash = "Tarefa adicionada!";
  return res.redirect("/tarefas");
});

tarefaRoutes.post("/tarefas/:id/concluir", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }

  const idTarefa = parseInt(req.params.id, 10);
  if (isNaN(idTarefa)) {
    return res.redirect("/tarefas");
  }

  await TarefaModel.concluir(idTarefa, req.session.userId);
  return res.redirect("/tarefas");
});

tarefaRoutes.post("/tarefas/:id/remover", async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }

  const idTarefa = parseInt(req.params.id, 10);
  if (isNaN(idTarefa)) {
    return res.redirect("/tarefas");
  }

  await TarefaModel.remover(idTarefa, req.session.userId);
  return res.redirect("/tarefas");
});