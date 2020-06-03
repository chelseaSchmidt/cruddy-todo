
// Todo Model //////////////////////////////////////////////////////////////////

const Todo = require('./datastore');

// Configure Express ///////////////////////////////////////////////////////////

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, './public')));

// RESTful Routes for CRUD operations //////////////////////////////////////////

// Create (Crud) -- collection route
app.post('/todo', (req, res) => {
  Todo.create(req.body.todoText)
    .then(newTodo => res.status(201).json(newTodo))
    .catch(() => res.sendStatus(400));
});

// Read all (cRud) -- collection route
app.get('/todo', (req, res) => {
  Todo.readAll()
    .then(todos => res.status(200).json(todos))
    .catch(() => res.sendStatus(400));
});

// Read one (cRud) -- member route
app.get('/todo/:id', (req, res) => {
  Todo.readOne(req.params.id)
    .then(todo => res.status(200).json(todo))
    .catch(() => res.sendStatus(404));
});

// Update (crUd) -- member route
app.put('/todo/:id', (req, res) => {
  Todo.update(req.params.id, req.body.todoText)
    .then(todo => res.status(200).json(todo))
    .catch(() => res.sendStatus(404));
});

// Delete (cruD) -- member route
app.delete('/todo/:id', (req, res) => {
  Todo.delete(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(() => res.sendStatus(404));
});

// Start & Initialize Web Server ///////////////////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log('CRUDdy Todo server is running in the terminal');
  console.log(`To get started, visit: http://localhost:${port}`);
});

Todo.initialize();
