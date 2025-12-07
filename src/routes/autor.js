import express from "express";
import conexao from "../../database/conexao.js";

const router = express.Router();

//Rotas (1)
router.get('/autor', (req, res) => {

    const sql = "SELECT * FROM autor";
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            res.status(404).json({ 'erro': erro });
        } else {
            res.status(200).json(resultado)
        }
    });
});

//Rotas (2)
router.post('/criarautor', (req, res) => {

    const cautor = req.body
    const sql = "INSERT INTO autor SET ?"
    conexao.query(sql, cautor, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (3)
router.delete('/deletaautor/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM autor WHERE idautor=?"
    conexao.query(sql, id, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (4)
router.put('/atualizarautor/:id', (req, res) => {
    const id = req.params.id
    const aautor = req.body
    const sql = "UPDATE autor SET ? WHERE idautor=?"
    conexao.query(sql, [aautor, id], (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

export default router;
