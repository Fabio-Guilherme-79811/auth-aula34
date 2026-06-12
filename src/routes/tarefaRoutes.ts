import { Router } from "express";
import * as TarefaController from "../controllers/tarefaController"; // Exemplo de refatoração para controller
import { requireAuth } from "../middlewares/authMiddleware";

export const tarefaRoutes = Router();

// Middleware aplicado a todas as rotas do roteador
tarefaRoutes.use(requireAuth);

tarefaRoutes.get("/tarefas", TarefaController.listar);
tarefaRoutes.post("/tarefas", TarefaController.adicionar);
tarefaRoutes.post("/tarefas/:id/concluir", TarefaController.concluir);
tarefaRoutes.post("/tarefas/:id/remover", TarefaController.remover);