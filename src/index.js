const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    return response.status(400).json({ error: 'User already registered! '});
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {

  const { username } = request.headers;
  const { name } = request.body;

  const checksExistsUserAccount = users.some(user => user.username === username);

  if (checksExistsUserAccount) {
    return response.status(400).json({ error: 'User already registered' });
  }

  const user = {id: uuid(), name, username, todos:[]}
  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const user = users.find(user => user.username == username);

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { username } = request.headers;

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  const userIndex = users.findIndex(user => user.username === username);
  users[userIndex].todos.push(todo);

  return response.status(201).json(todo);
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