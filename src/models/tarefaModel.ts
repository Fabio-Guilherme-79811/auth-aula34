import { promises as fs } from "fs";
import path from "path";

const caminhoArquivo = path.join(__dirname, "../../dados/tarefas.json");

export interface Tarefa {
  id: number;
  descricao: string;
  userId: number;
  concluida: boolean;
}

async function carregar(): Promise<Tarefa[]> {
  try {
    const dados = await fs.readFile(caminhoArquivo, "utf-8");
    return JSON.parse(dados) as Tarefa[];
  } catch (error) {
    if ((error as { code?: string }).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function salvar(tarefas: Tarefa[]): Promise<void> {
  await fs.writeFile(caminhoArquivo, JSON.stringify(tarefas, null, 2), "utf-8");
}

export async function listarPorUsuario(userId: number): Promise<Tarefa[]> {
  const todas = await carregar();
  return todas.filter(t => t.userId === userId);
}

export async function listarTodas(): Promise<Tarefa[]> {
  return await carregar();
}

export async function adicionar(descricao: string, userId: number): Promise<Tarefa> {
  const todas = await carregar();
  const nova: Tarefa = {
    id: todas.length > 0 ? todas[todas.length - 1].id + 1 : 1,
    descricao,
    userId,
    concluida: false,
  };
  todas.push(nova);
  await salvar(todas);
  return nova;
}

export async function concluir(id: number, userId: number): Promise<boolean> {
  const todas = await carregar();
  const t = todas.find(t => t.id === id && t.userId === userId);
  if (!t) return false;
  t.concluida = !t.concluida;
  await salvar(todas);
  return true;
}

export async function remover(id: number, userId: number): Promise<boolean> {
  const todas = await carregar();
  const i = todas.findIndex(t => t.id === id && t.userId === userId);
  if (i === -1) return false;
  todas.splice(i, 1);
  await salvar(todas);
  return true;
}