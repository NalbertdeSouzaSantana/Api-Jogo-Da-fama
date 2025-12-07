import mysql from 'mysql'

const conexao = mysql.createConnection({
    host: "precisa criar DB_HOST",
    port: "precisa criar DB_PORT",
    user: "precisa criar DB_USER",
    password: "precisa criar DB_PASS",
    database: "precisa criar DB_NAME"
})

conexao.connect()

export default conexao
