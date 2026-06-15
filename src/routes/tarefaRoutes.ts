import { Router } from "express";
import * as TarefaController from "../controllers/tarefaController"; // Removed .ts extension
import { requireAuth } from "../middlewares/authMiddleware";

export const tarefaRoutes = Router();

// Middleware applied to all routes in this router
tarefaRoutes.use(requireAuth);

tarefaRoutes.get("/tarefas", TarefaController.listar);
tarefaRoutes.post("/tarefas", TarefaController.adicionar);
tarefaRoutes.post("/tarefas/:id/concluir", TarefaController.concluir);
tarefaRoutes.post("/tarefas/:id/remover", TarefaController.remover);