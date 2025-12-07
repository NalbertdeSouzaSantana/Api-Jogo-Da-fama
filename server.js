import app from './src/app.js'

import conexao from './database/conexao.js'

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando no endereço http://localhost:${PORT}`)
})