import { Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";

export async function listar(req: Request, res: Response) {
  const userId = req.session.userId;
  if (!userId) {
    req.session.flash = "Você precisa estar logado para acessar suas tarefas.";
    return res.redirect("/login");
  }

  const tarefas = await TarefaModel.listarPorUsuario(userId);
  res.render("tarefas", { tarefas, nome: req.session.userName, flash: req.session.flash });
  req.session.flash = null;
}

export async function adicionar(req: Request, res: Response) {
  const userId = req.session.userId;
  const { texto } = req.body;

  if (!userId || !texto) {
    req.session.flash = "Erro ao adicionar tarefa. Parâmetros inválidos.";
    return res.redirect("/tarefas");
  }

  await TarefaModel.adicionar(texto, userId);
  req.session.flash = "Tarefa adicionada com sucesso!";
  res.redirect("/tarefas");
}

export async function concluir(req: Request, res: Response) {
  const userId = req.session.userId;
  const id = parseInt(req.params.id, 10);

  if (!userId || isNaN(id)) {
    req.session.flash = "Erro ao concluir tarefa. Parâmetros inválidos.";
    return res.redirect("/tarefas");
  }

  const sucesso = await TarefaModel.concluir(id, userId);
  req.session.flash = sucesso ? "Tarefa concluída com sucesso!" : "Erro ao concluir tarefa.";
  res.redirect("/tarefas");
}

export async function remover(req: Request, res: Response) {
  const userId = req.session.userId;
  const id = parseInt(req.params.id, 10);

  if (!userId || isNaN(id)) {
    req.session.flash = "Erro ao remover tarefa. Parâmetros inválidos.";
    return res.redirect("/tarefas");
  }

  const sucesso = await TarefaModel.remover(id, userId);
  req.session.flash = sucesso ? "Tarefa removida com sucesso!" : "Erro ao remover tarefa.";
  res.redirect("/tarefas");
}