
const Express = require('express'); // importação do Express
const { response } = require('express');
const { ObjectId } = require('mongodb');
const app = new Express(); // instaciar o Express 
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const PORT = 3000;
const DB_URL = "mongodb+srv://todolist:DEHjSL6NIBP0GNtR@cluster0.smlub.gcp.mongodb.net/toodolistdb?retryWrites=true&w=majority";
let connection 
let db
let tarefasCollection

// configuração JSON
app.use(Express.json()) // habilita a descompactação das requisições {body} em formato JSON
app.use(cors())
// conexao com o DB
MongoClient.connect(DB_URL,(err,client)=>{
  if (err) {
    console.log("Erro ao conectar com o Banco de Dados");
    process.exit(0);
  } 
  else{
    connection = client;
    db = connection.db('toodolistdb');
    tarefasCollection = db.collection('tarefas');
    console.log("Banco de Dados conectado com sucesso!");
  }
})
//Endpoints
app.get("/",(req, res) => {
  console.log(req.body);
  //Envia HTTP response
  res.send("API todo-list!");
});

//endpoint cadastro de tarefa
app.post("/tarefas", async (req, res)=>{
   const resultado = await tarefasCollection.insertOne(req.body);
  res.json(resultado);
});
//endpoint edição de tarefa
app.put("/tarefas",async (req, res)=>{
  const resultado = await tarefasCollection.updateOne({_id: ObjectId(req.body._id)},  {
    $set: {
      titulo : req.body.titulo,
      descricao: req.body.descricao
     }
    });
  res.json(resultado);
});
//endpoint remoção de tarefa
app.delete("/tarefas/:id", async (req,res) => {
  const resultado = await tarefasCollection.deleteOne({_id: ObjectId(req.params.id)})
  res.send(resultado);
});

//endpoint de listagem de tarefas
app.get("/tarefas", async (req,res)=>{
  
  res.json(await tarefasCollection.find().toArray())
  //res.send("Listagem de Tarefas");
});

//Startar o sevidor
app.listen(PORT, ()=>{
    console.log(`A API está rodando na porta ${PORT}`);
});


