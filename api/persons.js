const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../mock/db.json');

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = function handler(req, res) {
  const db = readDB();
  let persons = db.persons;

  const { search = '', page = 1, limit = 10 } = req.query;

  if (req.method === 'GET') {
    if (search) persons = persons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const start = (page - 1) * parseInt(limit);
    const paginated = persons.slice(start, start + parseInt(limit));

    return res.status(200).json(paginated);
  }

  if (req.method === 'POST') {
    const newPerson = { id: Date.now(), ...req.body };
    db.persons.push(newPerson);
    writeDB(db);
    return res.status(201).json(newPerson);
  }

  if (req.method === 'PUT') {
    const { id, ...data } = req.body;
    const index = db.persons.findIndex(p => p.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    db.persons[index] = { ...db.persons[index], ...data };
    writeDB(db);
    return res.status(200).json(db.persons[index]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const index = db.persons.findIndex(p => p.id === parseInt(id));
    if (index === -1) return res.status(404).json({ error: 'Not found' });

    const deleted = db.persons.splice(index, 1)[0];
    writeDB(db);
    return res.status(200).json(deleted);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
