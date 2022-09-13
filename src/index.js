const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
// const todos = [];

function checksExistsUserAccount(request, response, next) {
  const username = request.headers.username
  const userExists = users.find(item => username === item.username)

  if(userExists === undefined) {
    response.status(400).json({ error: "Usuário não encontrado!" })
  }

  next()
}

app.post('/users', (request, response) => {
  try {
    const data = request.body

    const userExists = users.find(item => data.username === item.username)

    if(userExists !== undefined) {
      response.status(400).json({ error: "Usuário não encontrado!" })
    }

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
  try {
    const username = request.headers.username
    const userTodos = users.find(item => username === item.username).todos

    response.status(200).json(userTodos)
  } catch (error) {
    response.status(500).send()
  }
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  try {
    console.log('Aqui')
    const data = request.body
    // const username = request.headers.username

    const newTodo = {
      id: uuidv4(),
      title: data.title,
      deadline: new Date(data.deadline),
      done: false,
      created_at: new Date()
    }

    // pegar o usuário a partir do nome
    // dar push do newTodo no array de todos dele
    const currentUser = users.find(item => username = item.username)
    // currentUser.todos.push(newTodo)
    Object.assign(currentUser, {
      ...currentUser,
      todos: [
        ...currentUser.todos,
        newTodo
      ]
    })

    response.status(201).send(newTodo)
  } catch (error) {
    response.status(500).send()
  }
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