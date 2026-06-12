import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

const ARQUIVO = "dados/usuarios.json";
const SALT_ROUNDS = 10;

async function carregar(): Promise<User[]> {
  try {
    return JSON.parse(await readFile(ARQUIVO, "utf-8"));
  } catch {
    await writeFile(ARQUIVO, "[]");
    return [];
  }
}

async function salvar(users: User[]): Promise<void> {
  await writeFile(ARQUIVO, JSON.stringify(users, null, 2));
}

export async function listarTodos(): Promise<User[]> {
  return await carregar();
}

export async function registrar(nome: string, email: string, senhaTexto: string): Promise<User> {
  const users = await carregar();
  const emailTratado = email.toLowerCase().trim();

  if (users.some(u => u.email.toLowerCase() === emailTratado)) {
    throw new Error("E-mail duplicado.");
  }

  // Atribuição automática de ADMIN para o primeiro registro (coleção vazia)
  const role = users.length === 0 ? Role.ADMIN : Role.USER;
  const hashSenha = await bcrypt.hash(senhaTexto, SALT_ROUNDS);

  const novoUsuario: User = {
    id: (users.at(-1)?.id ?? 0) + 1,
    nome: nome.trim(),
    email: emailTratado,
    senha: hashSenha,
    role
  };

  users.push(novoUsuario);
  await salvar(users);
  return novoUsuario;
}

export async function login(email: string, senhaTexto: string): Promise<User | null> {
  const users = await carregar();
  const usuario = users.find(u => u.email === email.toLowerCase().trim());
  if (!usuario) return null;

  const match = await bcrypt.compare(senhaTexto, usuario.senha);
  return match ? usuario : null;
}