const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../mock/db.json');

function readDB() {
  const raw = fs.readFileSync(dbPath);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function handler(req, res) {
  const db = readDB();
  let todos = db.todos;

  const { search = '', page = 1, limit = 10, priority, label, personId } = req.query;

  if (req.method === 'GET') {
    if (search) todos = todos.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
    if (priority) todos = todos.filter((t) => t.priority === priority);
    if (label) todos = todos.filter((t) => t.labels?.includes(label));
    if (personId) todos = todos.filter((t) => t.personId === parseInt(personId));

    const start = (page - 1) * parseInt(limit);
    const paginated = todos.slice(start, start + parseInt(limit));

    return res.status(200).json(paginated);
  }

  if (req.method === 'POST') {
    const newTodo = { id: Date.now(), ...req.body };
    db.todos.push(newTodo);
    writeDB(db);
    return res.status(201).json(newTodo);
  }

  if (req.method === 'PUT') {
    const { id, ...data } = req.body;
    const index = db.todos.findIndex((t) => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    db.todos[index] = { ...db.todos[index], ...data };
    writeDB(db);
    return res.status(200).json(db.todos[index]);
  }

  if (req.method === 'DELETE') {
    const parsedUrl = url.parse(req.url);
    const idFromPath = parsedUrl.pathname.split('/').pop();
    const id = parseInt(idFromPath);

    const index = db.todos.findIndex((t) => t.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    const deleted = db.todos.splice(index, 1)[0];
    writeDB(db);
    return res.status(200).json(deleted);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
