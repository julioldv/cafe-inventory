import { pool } from './pool.js';

async function getAllCategories() {
  const { rows } = await pool.query('SELECT name, description FROM categories ORDER BY name ASC');

  return rows;
}

export { getAllCategories };
