import db from '../mock/db.json';

export default function handler(req, res) {
  let { page = 1, limit = 10, personId, completed, search } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  let todos = data.todos;


  if (personId) {
    const id = parseInt(personId, 10);
    todos = todos.filter((todo) => todo.personId === id);
  }

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    todos = todos.filter((todo) => todo.completed === isCompleted);
  }

  if (search) {
    const keyword = search.toLowerCase();
    todos = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(keyword) ||
        (todo.description && todo.description.toLowerCase().includes(keyword)) ||
        (todo.labels && todo.labels.some((label) => label.toLowerCase().includes(keyword)))
    );
  }

  const totalItems = todos.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedTodos = todos.slice(start, end);

  res.status(200).json({
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
    },
    data: paginatedTodos,
    persons: data.persons,
  });
}
