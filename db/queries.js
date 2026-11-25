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

async function getItemById(id) {
  const { rows } = await pool.query(
    `SELECT
        i.id,
        i.name,
        i.quantity,
        i.unit,
        i.category_id,
        c.name AS category_name
     FROM items AS i
     INNER JOIN categories AS c
        ON i.category_id = c.id
     WHERE i.id = $1`,
    [id],
  );

  return rows[0];
}

async function createCategory(categoryData) {
  const { name, description } = categoryData;

  const { rows } = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description ?? null],
  );

  return rows[0];
}

export { getAllCategories, getCategoryById, getItemsByCategoryId, getItemById, createCategory };
