import express from "express";
import conexao from "../../database/conexao.js";

const router = express.Router();

//Rotas (1)
router.get('/empresa', (req, res) => {

    const sql = "SELECT * FROM empresa";
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            res.status(404).json({ 'erro': erro });
        } else {
            res.status(200).json(resultado)
        }
    });
});

//Rotas (2)
router.post('/criarempresa', (req, res) => {

    const cempresa = req.body
    const sql = "INSERT INTO empresa SET ?"
    conexao.query(sql, cempresa, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (3)
router.delete('/deletaempresa/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM empresa WHERE idempresa=?"
    conexao.query(sql, id, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (4)
router.put('/atualizarempresa/:id', (req, res) => {
    const id = req.params.id
    const aempresa = req.body
    const sql = "UPDATE empresa SET ? WHERE idempresa=?"
    conexao.query(sql, [aempresa, id], (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

export default router;
