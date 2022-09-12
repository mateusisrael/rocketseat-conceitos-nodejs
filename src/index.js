const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const user = request.body.data
  const userExists = users.find(item => user.username === item.username)

  if(userExists !== undefined) {
    response.status(400).json({ message: "Nome de usuário não disponível" })
  }

  next()
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  try {
    const { data } = request.body

    const user = {
      id: uuidv4(),
      name: data.name,
      username: data.username,
      todos: []
    }
  
    users.push(user)
    response.status(201).json(user)
  } catch (error) {
    response.status(500).send()
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;