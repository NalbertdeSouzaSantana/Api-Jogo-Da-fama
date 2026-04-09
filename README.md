🏆 Api-Jogo-Da-Fama
Este projeto é uma API REST desenvolvida para realizar o gerenciamento completo (CRUD) de informações sobre jogos, autores, empresas e usuários.

🚀 Funcionalidades
A API está dividida em quatro entidades principais, todas testadas via Insomnia:

👤 Usuários
POST /Criarusuario: Cadastro de novos usuários.

POST /usuariologin: Autenticação no sistema.

DEL /deletarusuario: Remoção de conta.

🎮 Jogos
GET /buscajogo: Lista todos os jogos cadastrados.

POST /criarjogo: Adiciona um novo jogo com informações de nome, ano e troféus.

PUT /atualizarjogo: Edita detalhes de um jogo existente.

🏢 Empresas e Autores
POST /criarempresa / /criarautor: Cadastro de desenvolvedoras e criadores.

GET /buscarempresa: Consulta de empresas parceiras.

🛠️ Tecnologias Utilizadas
Node.js: Ambiente de execução.

JavaScript: Linguagem principal.

MySQL: Banco de dados relacional para persistência.

Insomnia: Ferramenta de teste e documentação de rotas.

### ⚙️ Configuração do Banco de Dados

Para que a API funcione, você deve configurar suas credenciais no arquivo de conexão:

```javascript
const conexao = mysql.createConnection({
    host: "SEU_HOST",
    port: "SUA_PORTA",
    user: "SEU_USUARIO",
    password: "SUA_PASSWORD",
    database: "NOME_DO_SEU_BANCO"
}
