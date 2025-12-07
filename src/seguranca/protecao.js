import jwt from 'jsonwebtoken';

const chavepublica = 'chave_publica';

export function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Token não fornecido');

    jwt.verify(token, chavepublica, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user;
        next();
    });
}

export const chaveprivada = chavepublica;
