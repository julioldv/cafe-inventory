CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,

    CONSTRAINT category_name_not_blank
        CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE TABLE items (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id INTEGER NOT NULL
        REFERENCES categories(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(5) NOT NULL
        CHECK (unit IN ('g', 'ml', 'pcs')),

    CONSTRAINT item_name_not_blank
        CHECK (LENGTH(TRIM(name)) > 0)
);