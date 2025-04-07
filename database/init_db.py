import sqlite3
import os

# Create data directory if it doesn't exist
os.makedirs('/data', exist_ok=True)

# Connect to SQLite database (will be created if it doesn't exist)
conn = sqlite3.connect('/data/nutrition.db')
cursor = conn.cursor()

# Create Foods table
cursor.execute('''
CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fdc_id TEXT,
    brand_owner TEXT,
    brand_name TEXT,
    subbrand_name TEXT,
    gtin_upc TEXT,
    ingredients TEXT,
    not_a_significant_source_of TEXT,
    serving_size REAL,
    serving_size_unit TEXT,
    household_serving_fulltext TEXT,
    branded_food_category TEXT,
    data_source TEXT,
    package_weight TEXT,
    modified_date TEXT,
    available_date TEXT,
    market_country TEXT,
    discontinued_date TEXT,
    preparation_state_code TEXT,
    trade_channel TEXT,
    short_description TEXT,
    material_code TEXT,
    calories REAL,
    protein REAL,
    total_fat REAL,
    carbohydrates REAL,
    fiber REAL,
    sugars REAL,
    sodium REAL
)
''')

# Create Users table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Create Favorites table
cursor.execute('''
CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (food_id) REFERENCES foods(id),
    UNIQUE(user_id, food_id)
)
''')

cursor.execute('CREATE INDEX IF NOT EXISTS idx_food_name ON foods(brand_name)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_food_category ON foods(branded_food_category)')

conn.commit()
conn.close()

print("Database initialized successfully!")