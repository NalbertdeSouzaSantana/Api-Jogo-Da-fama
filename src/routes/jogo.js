import express from "express";
import conexao from "../../database/conexao.js";

const router = express.Router();

//Rotas mysql

//Rotas (1)
router.get('/nomejogo/:nomejogo', (req, res) => {
    const nomejogo = req.params.nomejogo;

    const sql = "SELECT * FROM jogo WHERE nomejogo LIKE ?";
    conexao.query(sql, [`%${nomejogo}%`], (erro, resultado) => {
        if (erro) return res.status(500).json({ erro });
        if (resultado.length === 0) return res.status(404).json({ mensagem: 'Jogo não encontrado.' });
        res.status(200).json(resultado);
    });
});

//Rotas (2)
router.get('/jogo', (req, res) => {

    const sql = "SELECT * FROM jogo";
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            res.status(404).json({ 'erro': erro });
        } else {
            res.status(200).json(resultado)
        }
    });
});

//Rotas (3)
router.get('/idjogo/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM jogo WHERE idjogo = ?";
    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            res.status(404).json({ 'erro': erro });
        } else {
            res.status(200).json(resultado)
        }
    });
});

//Rotas (4)
router.post('/criarjogo', (req, res) => {
    const cjogo = req.body
    const sql = "INSERT INTO jogo SET ?"
    conexao.query(sql, cjogo, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (5)
router.post('/criarjogo', (req, res) => {
    const cjogo = req.body
    const sql = "INSERT INTO jogo SET ?"
    conexao.query(sql, cjogo, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (6)
router.post('/criarjogo', (req, res) => {
    const cjogo = req.body
    const sql = "INSERT INTO jogo SET ?"
    conexao.query(sql, cjogo, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (7)
router.delete('/deletajogo/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM jogo WHERE idjogo=?"
    conexao.query(sql, id, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

//Rotas (8)
router.put('/atualizarjogo/:id', (req, res) => {
    const id = req.params.id
    const ajogo = req.body
    const sql = "UPDATE jogo SET ? WHERE idjogo=?"
    conexao.query(sql, [ajogo, id], (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        } else {
            res.status(201).json(resultado)
        }
    })
})

export default router;
