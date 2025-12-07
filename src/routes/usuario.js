import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, chaveprivada } from '../seguranca/protecao.js';
import conexao from "../../database/conexao.js"

const router = express.Router();

const users = []

// Rota de registro
router.post('/registrar', async (req, res) => {
    const { nome, email, senha, idade, jogofavorito, ano } = req.body;

    if (!nome || !email || !senha || !idade || !jogofavorito || isNaN(idade) || idade <= 0) {
        return res.status(400).json({ erro: "Campos obrigatórios inválidos." });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const novoUsuario = { nome, email, senha: hashedPassword, idade, jogofavorito, ano };

        conexao.query("INSERT INTO usuario SET ?", novoUsuario, (erro, resultado) => {
            if (erro) return res.status(500).json({ erro: erro.message });
            res.status(201).json({ mensagem: "Usuário registrado com sucesso!", id: resultado.insertId });
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Rota de login

// Login puxa o id junto com token esse id e usados pelas rotas 5 e 6.
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Campos obrigatórios: email e senha." });
    }

    try {
        const sql = "SELECT * FROM usuario WHERE email = ?";
        conexao.query(sql, [email], async (erro, resultado) => {
            if (erro) return res.status(500).json({ erro: erro.message });

            const user = resultado[0];
            if (!user) {
                return res.status(404).json({ erro: "Usuário não encontrado." });
            }

            const senhaCorreta = await bcrypt.compare(senha, user.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ erro: "Senha incorreta." });
            }

            const token = jwt.sign(
                { idusuario: user.idusuario },
                chaveprivada,
                { expiresIn: '60s' }
            );


            res.json({
                mensagem: "Login feito.",
                token,
                idusuario: user.idusuario
            });
        });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// Rota de buscar
// Essa rota e para o usuario que fez login ou nao usar. 

router.get('/buscarjogo/:jogo', (req, res) => {
    let { jogo } = req.params;
    jogo = jogo.trim();

    const sql = `
        SELECT 
            jogo.nomejogo, 
            jogo.ano, 
            jogo.trofeu, 
            jogo.avaliacoes,
            autor.nomeautor AS autor, 
            empresa.nomeempresa AS empresa 
        FROM 
            jogo 
        JOIN autor ON jogo.idautor = autor.idautor
        JOIN empresa ON jogo.idempresa = empresa.idempresa
        WHERE jogo.nomejogo LIKE ?`;

    const queryParam = `%${jogo}%`;

    conexao.query(sql, [queryParam], (erro, resultadoJogo) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        if (!resultadoJogo.length) {
            return res.status(404).json({ erro: 'Nenhum jogo encontrado.' });
        }

        res.status(200).json(resultadoJogo);
    });
});

//Rotas protegida exigidas autorização

// Rota segura (1)
// Obs: so use a rota (1) quando usa a rota (2)!
// (Essa rota so buscar o jogo quando adicionar o jogo aos favoritos)

router.get('/buscarjogofavorito/:jogo?', authenticateToken, (req, res) => {
    const usuarioId = req.user.idusuario;
    let { jogo } = req.params;
    jogo = jogo ? `%${jogo.trim()}%` : '%';

    const sql = `
        SELECT jogo.nomejogo, jogo.ano, autor.nomeautor, empresa.nomeempresa
        FROM usuariojogo
        JOIN jogo ON usuariojogo.idjogo = jogo.idjogo
        JOIN autor ON jogo.idautor = autor.idautor
        JOIN empresa ON jogo.idempresa = empresa.idempresa
        WHERE usuariojogo.idusuario = ? AND jogo.nomejogo LIKE ?`;

    conexao.query(sql, [usuarioId, jogo], (erro, resultadoJogo) => {
        if (erro) return res.status(500).json({ erro: erro.message });
        if (!resultadoJogo.length) return res.status(404).json({ erro: 'Nenhum jogo encontrado.' });
        res.status(200).json(resultadoJogo);
    });
});

// Rota segura (2)
router.post('/adicionarjogo', authenticateToken, (req, res) => {
    const { nomejogo } = req.body;
    const usuarioId = req.user.idusuario;

    if (!nomejogo) return res.status(400).json({ erro: 'Nome do jogo é necessário.' });

    const sqlBuscaJogo = 'SELECT idjogo FROM jogo WHERE LOWER(nomejogo) LIKE LOWER(?)';
    const queryParam = `%${nomejogo.trim()}%`;

    conexao.query(sqlBuscaJogo, [queryParam], (erroBusca, resultadoJogo) => {
        if (erroBusca) return res.status(500).json({ erro: erroBusca.message });
        if (!resultadoJogo.length) return res.status(404).json({ erro: 'Jogo não encontrado.' });

        const idjogo = resultadoJogo[0].idjogo;

        const sqlVerificaFavorito = 'SELECT * FROM usuariojogo WHERE idusuario = ? AND idjogo = ?';
        conexao.query(sqlVerificaFavorito, [usuarioId, idjogo], (erroVerifica, resultadoVerifica) => {
            if (erroVerifica) return res.status(500).json({ erro: erroVerifica.message });
            if (resultadoVerifica.length) return res.status(400).json({ erro: 'Jogo já adicionado.' });

            const sqlAdicionaFavorito = 'INSERT INTO usuariojogo (idusuario, idjogo) VALUES (?, ?)';
            conexao.query(sqlAdicionaFavorito, [usuarioId, idjogo], (erroAdiciona) => {
                if (erroAdiciona) return res.status(500).json({ erro: erroAdiciona.message });
                res.status(200).json({ mensagem: 'Jogo adicionado aos favoritos!' });
            });
        });
    });
});

// Rota segura (3)
router.post('/puxaperfil', authenticateToken, (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ erro: 'Nome do usuário é obrigatório.' });
    }

    const sql = 'SELECT nome, email, idade, ano FROM usuario WHERE nome = ?';

    conexao.query(sql, [nome], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json({
            nome: resultado[0].nome,
            email: resultado[0].email,
            idade: resultado[0].idade,
            ano: resultado[0].ano
        });
    });
});

// Rota segura (4)
router.put('/atualizarperfil', authenticateToken, (req, res) => {
    const { username } = req.user;
    const { email, } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).send('Usuário não encontrado.');
    }

    if (email) {
        user.email = email;
    }

    res.send('Perfil atualizado com sucesso!');
});

// Rota segura (5)
router.put('/atualizarjogofavorito/:id', authenticateToken, (req, res) => {
    const usuarioId = req.params.id;
    const { jogofavorito } = req.body;

    if (!jogofavorito) {
        return res.status(400).send('Nome do jogo não fornecido');
    }

    const updateQuery = 'UPDATE usuario SET jogofavorito = ? WHERE idusuario = ?';
    conexao.query(updateQuery, [jogofavorito, usuarioId], (erroUpdate, resultados) => {
        if (erroUpdate) {
            return res.status(500).json({ erro: erroUpdate.message });
        }

        if (resultados.affectedRows === 0) {
            return res.status(404).send('Usuário não encontrado para atualizar o jogo favorito.');
        }

        res.status(200).send('Nome do jogo atualizado com sucesso!');
    });
});

// Rota segura (6)
router.delete('/deletarusuario/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ erro: 'ID do usuário é obrigatório.' });
    }

    const sql = 'DELETE FROM usuario WHERE idusuario = ?';
    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }
        res.status(200).json({ mensagem: 'Usuário deletado com sucesso!' });
    });
});

export default router;
