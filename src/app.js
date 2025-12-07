import express from "express";
import autorRouter from "./routes/autor.js"
import empresaRouter from "./routes/empresa.js";
import jogoRoutes from "./routes/jogo.js";
import usuarioRoutes from "./routes/usuario.js";


const app = express();

// Middleware
app.use(express.json());

// Rotas
app.use("/buscar", autorRouter);
app.use("/buscar", empresaRouter);
app.use("/buscar", jogoRoutes);
app.use("/usuarios", usuarioRoutes);

// Rota base para verificação
app.get("/", (req, res) => {
    res.send("API Jogo da Fama está funcionando!");
});

export default app;
