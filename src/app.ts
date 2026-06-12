import express from "express";
import session from "express-session";
import { authRoutes } from "./routes/authRoutes";
import { tarefaRoutes } from "./routes/tarefaRoutes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "3f8c8d8b4e6d4212a4e9b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 
    }
  })
);

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("public"));

app.use(authRoutes);
app.use(tarefaRoutes);

app.listen(3000, () => console.log("Servidor HTTP inicializado na porta 3000"));