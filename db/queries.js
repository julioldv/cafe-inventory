import { pool } from './pool.js';

async function getAllCategories() {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC');

  return rows;
}

async function getCategoryById(id) {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id=$1', [id]);

  return rows[0];
}

async function getItemsByCategoryId(id) {
  const { rows } = await pool.query(
    'SELECT * FROM items WHERE category_id = $1 ORDER BY name ASC',
    [id],
  );

  return rows;
}

export { getAllCategories, getCategoryById, getItemsByCategoryId };
