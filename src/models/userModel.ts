// ============================================================
// 🎯 TODO 4: Model de Usuários com bcrypt
// ============================================================
// import { readFile, writeFile } from "fs/promises";
// import bcrypt from "bcrypt";
//
// interface User { id: number; nome: string; email: string; senha: string; }
// const ARQUIVO = "dados/usuarios.json";
// const SALT_ROUNDS = 10;
//
// Funções para criar:
//   carregar(): Promise<User[]>
//   salvar(users: User[]): Promise<void>
//   buscarPorEmail(email: string): Promise<User | undefined>
//   buscarPorId(id: number): Promise<User | undefined>
//   registrar(nome, email, senhaTexto): Promise<User>
//     → verificar email duplicado
//     → bcrypt.hash(senhaTexto, SALT_ROUNDS)
//     → salvar com hash
//   login(email, senhaTexto): Promise<User | null>
//     → buscar por email
//     → bcrypt.compare(senhaTexto, user.senha)
//     → retornar user se correto, null se errado
// ============================================================

import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

const ARQUIVO = "dados/usuarios.json";
const SALT_ROUNDS = 10;

async function carregar(): Promise<User[]> {
  try {
    const conteudo = await readFile(ARQUIVO, "utf-8");
    return JSON.parse(conteudo);
  } catch {
    await writeFile(ARQUIVO, "[]");
    return [];
  }
}

async function salvar(users: User[]): Promise<void> {
  await writeFile(ARQUIVO, JSON.stringify(users, null, 2));
}

export async function buscarPorEmail(email: string): Promise<User | undefined> {
  const users = await carregar();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
}

export async function buscarPorId(id: number): Promise<User | undefined> {
  const users = await carregar();
  return users.find(u => u.id === id);
}

export async function registrar(nome: string, email: string, senhaTexto: string): Promise<User> {
  const users = await carregar();
  const emailTratado = email.toLowerCase().trim();

  if (users.some(u => u.email.toLowerCase() === emailTratado)) {
    throw new Error("Identificador de e-mail já existente no banco de dados.");
  }

  const hashSenha = await bcrypt.hash(senhaTexto, SALT_ROUNDS);

  const novoUsuario: User = {
    id: (users.at(-1)?.id ?? 0) + 1,
    nome: nome.trim(),
    email: emailTratado,
    senha: hashSenha,
  };

  users.push(novoUsuario);
  await salvar(users);
  return novoUsuario;
}

export async function login(email: string, senhaTexto: string): Promise<User | null> {
  const usuario = await buscarPorEmail(email);
  if (!usuario) return null;

  const correspondencia = await bcrypt.compare(senhaTexto, usuario.senha);
  return correspondencia ? usuario : null;
}