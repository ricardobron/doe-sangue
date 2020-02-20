const express = require('express')
const nunjuncks = require('nunjucks')
const Pool = require('pg').Pool

const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const db = new Pool({
  user: 'postgres',
  password: 'docker',
  host: 'localhost',
  port: 5432,
  database: 'doepostgres'
})


nunjuncks.configure("./", {
  express: app,
  noCache: true
})

app.get("/", (req, res) => {
  db.query(`SELECT * FROM donors`, (err, result) => {
    if(err) return res.send("Erro de banco de dados")

    const donors = result.rows

    return res.render("index.html", { donors })
  })  
})

app.post("/", (req, res) => {

  const { name, email, blood } = req.body

  if(name == "" || email == "" || blood == ""){
    return res.send("Todos os campos são obrigatórios")
  }

  const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

  const values = [name, email, blood]

  db.query(query, values, (err) => {
    if(err) return res.send("Erro no banco de dados")
    

    return res.redirect("/")
  })

})

app.listen(3333, () => {
  console.log("INICIEI O SERVIDOR")
})