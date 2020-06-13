const express = require("express")
const server = express()

const db = require("./database/db")

// Configurar pasta pública
server.use(express.static("public"))

// Habilitar o uso do req.body da aplicação
server.use(express.urlencoded({extended: true}))

// Utilizando a template engine nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true

  // Meu servidor (express: server)
  // Não quero cache (nocache: true)
})


// Abaixo as configurações de caminhos da minha aplicação

// Página inicial / index
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um title"})
    // Requesição(req)
    // Resposta(res)
})
// Creat-points
server.get("/create-point", (req, res) => {
    // req.query: Query Strings da url
    console.log(req.query)
    
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: o corpo do nosso formulário
    // console.log(req.body)

    // inserir dados no banco de dados
        const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
            ) VALUES (?,?,?,?,?,?,?);
        `
        
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items
        ]

        function afterInsertData(err) {
            if(err) {
                console.log(err)
                return res.send("Erro no cadastro!")
            }

            console.log("Cadastrado com sucesso")
            console.log(this)

            return res.render("create-point.html", { saved: true})
        }
        
        db.run(query, values, afterInsertData)
})

// Search-results
server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }

    // pegar os dados do banco de dados
    // 3º Consultar dados na tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }
        const total = rows.length
        // console.log("Aqui estão seus registros: ")
        // console.log(rows)

        // Mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})
    })

})

// Ligar o servidor
server.listen(3000)
// Sem a template engine terei que usar o __dirname