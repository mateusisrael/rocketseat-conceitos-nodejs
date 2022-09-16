const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const username = request.headers.username
  const user = users.find(item => username === item.username)

  if(user === undefined) {
    response.status(400).json({ error: "Usuário não encontrado!" })
  }

  request.user = user
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
    const data = request.body
    const username = request.headers.username

    const newTodo = {
      id: uuidv4(),
      title: data.title,
      deadline: new Date(data.deadline),
      done: false,
      created_at: new Date()
    }

    const currentUser = users.find(item => username === item.username)
    currentUser.todos.push(newTodo)

    response.status(201).send(newTodo)
  } catch (error) {
    response.status(500).send()
  }
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  try {
    const { title, deadline } = request.body
    const todoId = request.params.id
    
    // encontrar o todo na lista de todos
    const todosList = request.user.todos
    const todo = todosList.find(item => item.id == todoId)
    if(!todo) response.status(404).json({ error: "Todo não encontrado" })

    // atualizar todo
    todo.title = title ? title : todo.title,
    todo.deadline = deadline ? new Date(deadline) : new Date()
    
    response.status(200).json(todo)
  } catch (error) {
    response.status(500).send()
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  try {
    const todoId = request.params.id
    const user = request.user

    // Encontrar todo
    const todosList = user.todos
    const todo = todosList.find(item => item.id === todoId)
    if(!todo) response.status(404).json({error: "Todo não encontrado"})

    todo.done = true

    response.status(200).json(todo)
  } catch (error) {
    response.status(500).send()
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    try {
    const todoId = request.params.id
    const user = request.user

    // Encontrar todo
    const todo = user.todos.find(item => item.id === todoId)
    if(!todo) response.status(404).json({error: "Todo não encontrado"})

    user.todos = user.todos.filter(i => i.id !== todoId)

    response.status(204).send()
  } catch (error) {
    response.status(500).send()
  }
});

module.exports = app;