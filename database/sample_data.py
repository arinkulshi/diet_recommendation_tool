import sqlite3
import pandas as pd
import random

# Connect to the SQLite database
conn = sqlite3.connect('/data/nutrition.db')
cursor = conn.cursor()

try:
    # Try to load the sample data from CSV
    df = pd.read_csv('branded_food.csv')
    print(f"Loaded {len(df)} records from CSV")
    
    # Generate random nutritional values for each food item
    # In a real application, you would use actual nutritional data
    for index, row in df.iterrows():
        calories = random.uniform(50, 500)
        protein = random.uniform(0, 30)
        total_fat = random.uniform(0, 25)
        carbohydrates = random.uniform(0, 50)
        fiber = random.uniform(0, 10)
        sugars = random.uniform(0, 20)
        sodium = random.uniform(0, 1000)
        
        # Insert the food item with nutritional data
        cursor.execute('''
        INSERT INTO foods (
            fdc_id, brand_owner, brand_name, subbrand_name, gtin_upc, 
            ingredients, not_a_significant_source_of, serving_size, 
            serving_size_unit, household_serving_fulltext, branded_food_category, 
            data_source, package_weight, modified_date, available_date, 
            market_country, discontinued_date, preparation_state_code, 
            trade_channel, short_description, material_code,
            calories, protein, total_fat, carbohydrates, fiber, sugars, sodium
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            row.get('fdc_id', ''), 
            row.get('brand_owner', ''), 
            row.get('brand_name', ''), 
            row.get('subbrand_name', ''), 
            row.get('gtin_upc', ''), 
            row.get('ingredients', ''), 
            row.get('not_a_significant_source_of', ''),
            row.get('serving_size', 0),
            row.get('serving_size_unit', ''),
            row.get('household_serving_fulltext', ''),
            row.get('branded_food_category', ''),
            row.get('data_source', ''),
            row.get('package_weight', ''),
            row.get('modified_date', ''),
            row.get('available_date', ''),
            row.get('market_country', ''),
            row.get('discontinued_date', ''),
            row.get('preparation_state_code', ''),
            row.get('trade_channel', ''),
            row.get('short_description', ''),
            row.get('material_code', ''),
            calories,
            protein,
            total_fat,
            carbohydrates,
            fiber,
            sugars,
            sodium
        ))
    
    print(f"Inserted {len(df)} records into the database")

except Exception as e:
    print(f"Error loading CSV data: {e}")
    
    # If the CSV fails to load, create some sample data manually
    sample_foods = [
        # Format: brand_name, calories, protein, fat, carbs, fiber, sugars, sodium
        ('Generic Oatmeal', 150, 5, 3, 27, 4, 1, 0),
        ('Protein Bar Plus', 220, 20, 9, 23, 3, 5, 140),
        ('Plain Greek Yogurt', 120, 15, 0, 9, 0, 9, 80),
        ('Chicken Breast', 165, 31, 3.6, 0, 0, 0, 74),
        ('Mixed Vegetables', 50, 2, 0, 10, 4, 4, 50),
        ('Whole Wheat Bread', 80, 4, 1, 15, 3, 2, 160),
        ('Atlantic Salmon', 206, 22, 13, 0, 0, 0, 60),
        ('Brown Rice', 215, 5, 1.8, 45, 3.5, 0, 10),
        ('Avocado', 240, 3, 22, 12, 10, 1, 10),
        ('Almond Milk', 40, 1, 3, 2, 0, 0, 150)
    ]
    
    for food in sample_foods:
        cursor.execute('''
        INSERT INTO foods (
            brand_name, calories, protein, total_fat, carbohydrates, fiber, sugars, sodium
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', food)
    
    print(f"Inserted {len(sample_foods)} sample food items")

# Create a sample user
cursor.execute('''
INSERT OR IGNORE INTO users (username, email, password_hash)
VALUES ('demo_user', 'demo@example.com', 'hashed_password_would_go_here')
''')

# Add some sample favorites for the user
user_id = cursor.lastrowid or 1
for food_id in range(1, min(6, cursor.execute("SELECT COUNT(*) FROM foods").fetchone()[0] + 1)):
    try:
        cursor.execute('''
        INSERT OR IGNORE INTO favorites (user_id, food_id)
        VALUES (?, ?)
        ''', (user_id, food_id))
    except sqlite3.IntegrityError:
        pass

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Sample data loaded successfully!")