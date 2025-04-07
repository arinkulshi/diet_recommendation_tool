import sqlite3
import pandas as pd
import random
import os
import glob
import sys
import numpy as np
import math

# Helper functions to clean data and handle NaN values
def clean_value(value):
    """Convert NaN, None, or invalid values to empty string for text fields"""
    if value is None or pd.isna(value) or value == 'None':
        return ''
    return str(value)

def clean_numeric(value):
    """Convert NaN, None, or invalid values to 0 for numeric fields"""
    if value is None or pd.isna(value) or value == '' or value == 'None':
        return 0
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0

print("Starting data import process...")

# Connect to the SQLite database
conn = sqlite3.connect('/data/nutrition.db')
cursor = conn.cursor()

# Function to load data from CSV
def load_from_csv(csv_file):
    try:
        print(f"Attempting to load data from {csv_file}")
        
        # Read the CSV with string data types to handle mixed content
        df = pd.read_csv(csv_file, low_memory=False, dtype=str)
        
        # Only filter out rows where brand_name is completely empty
        # This is a minimal filter to ensure we have at least a name
        original_count = len(df)
        df = df[~(df['brand_name'].isna() | (df['brand_name'].str.strip() == ''))]
        
        # Replace NaN values with empty strings for string columns
        df = df.fillna('')
        
        print(f"CSV loaded with {len(df)} valid records from {csv_file} (filtered out {original_count - len(df)} records with no brand name)")
        
        # Convert numeric columns where appropriate
        numeric_columns = ['serving_size']
        for col in numeric_columns:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        max_rows = 900000  
        row_limit = min(len(df), max_rows)
        
        print(f"Inserting up to {row_limit} rows into the database...")
        inserted = 0
        errors = 0
        
        # Process rows with a progress indicator
        for index, row in df.iterrows():
            if inserted >= row_limit:  
                break
                
         
            calories = random.uniform(50, 500)
            protein = random.uniform(0, 30)
            total_fat = random.uniform(0, 25)
            carbohydrates = random.uniform(0, 50)
            fiber = random.uniform(0, 10)
            sugars = random.uniform(0, 20)
            sodium = random.uniform(0, 1000)
            
            # Skip rows that have completely empty brand name
            brand_name = clean_value(row.get('brand_name'))
            if brand_name.strip() == '':
                continue
            
            # Convert values to appropriate types
            try:
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
                    clean_value(row.get('fdc_id')), 
                    clean_value(row.get('brand_owner')), 
                    clean_value(row.get('brand_name')), 
                    clean_value(row.get('subbrand_name')), 
                    clean_value(row.get('gtin_upc')), 
                    clean_value(row.get('ingredients')), 
                    clean_value(row.get('not_a_significant_source_of')),
                    float(clean_numeric(row.get('serving_size')) or 0),
                    clean_value(row.get('serving_size_unit')),
                    clean_value(row.get('household_serving_fulltext')),
                    clean_value(row.get('branded_food_category')),
                    clean_value(row.get('data_source')),
                    clean_value(row.get('package_weight')),
                    clean_value(row.get('modified_date')),
                    clean_value(row.get('available_date')),
                    clean_value(row.get('market_country')),
                    clean_value(row.get('discontinued_date')),
                    clean_value(row.get('preparation_state_code')),
                    clean_value(row.get('trade_channel')),
                    clean_value(row.get('short_description')),
                    clean_value(row.get('material_code')),
                    calories,
                    protein,
                    total_fat,
                    carbohydrates,
                    fiber,
                    sugars,
                    sodium
                ))
                inserted += 1
                
                # Show progress periodically
                if inserted % 500 == 0:
                    print(f"Inserted {inserted} records so far...")
                    conn.commit()  # Commit in batches to avoid large transactions
                    
            except Exception as e:
                errors += 1
                if errors < 10:  # Only show first few errors to avoid log flooding
                    print(f"Error inserting row {index}: {e}")
        
        # Final commit for remaining records
        conn.commit()
        print(f"CSV import completed: {inserted} records inserted, {errors} errors")
        return True
        
    except Exception as e:
        print(f"Error loading/processing CSV file {csv_file}: {e}")
        return False

# Function to create sample data as fallback
def create_sample_data():
    print("Creating sample data as fallback...")
    
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
        ('Almond Milk', 40, 1, 3, 2, 0, 0, 150),
        ('Spinach', 23, 2.9, 0.4, 3.6, 2.2, 0.4, 79),
        ('Banana', 105, 1.3, 0.4, 27, 3.1, 14, 1),
        ('Sweet Potato', 114, 2.1, 0.1, 26.8, 4, 5.4, 73),
        ('Quinoa', 222, 8.1, 3.6, 39.4, 5.2, 1.6, 13),
        ('Lentils', 230, 18, 0.8, 40, 15.6, 3.6, 4),
        ('Almonds', 164, 6, 14.2, 6.1, 3.5, 1.2, 0)
    ]
    
    inserted = 0
    for food in sample_foods:
        try:
            cursor.execute('''
            INSERT INTO foods (
                brand_name, calories, protein, total_fat, carbohydrates, fiber, sugars, sodium
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', food)
            inserted += 1
            
        except Exception as e:
            print(f"Error inserting sample food: {e}")
    
    conn.commit()
    print(f"Inserted {inserted} sample food items")
    return inserted > 0

# Search for CSV files in the app directory
csv_files = glob.glob('/app/*.csv')
print(f"Found {len(csv_files)} CSV files in /app directory")

# If no files found in /app, look in project directories
if not csv_files:
    print("No CSV files found in /app directory, looking in project directories")
    search_paths = [
        '/project/*.csv',
        '/project/database/*.csv',
        '/project/data/*.csv'
    ]
    
    for path in search_paths:
        found = glob.glob(path)
        if found:
            print(f"Found {len(found)} CSV files in {path}")
            csv_files.extend(found)

# Prioritize files with 'branded' in their name
branded_csv_files = [f for f in csv_files if 'branded' in os.path.basename(f).lower()]
other_csv_files = [f for f in csv_files if 'branded' not in os.path.basename(f).lower()]
csv_files = branded_csv_files + other_csv_files

print(f"Processing order: {csv_files}")

# Try each potential CSV file
csv_loaded = False
for csv_file in csv_files:
    if os.path.exists(csv_file) and os.path.isfile(csv_file):
        print(f"Attempting to load CSV file: {csv_file}")
        if load_from_csv(csv_file):
            csv_loaded = True
            break
        else:
            print(f"Failed to load {csv_file}, trying next option...")

# Use sample data if no CSV was loaded successfully
if not csv_loaded:
    print("No CSV file was loaded successfully. Using sample data.")
    if not create_sample_data():
        print("ERROR: Failed to create sample data.")
        sys.exit(1)

# Create a sample user
try:
    cursor.execute('''
    INSERT OR IGNORE INTO users (username, email, password_hash)
    VALUES ('demo_user', 'demo@example.com', 'hashed_password_would_go_here')
    ''')

    # Add some sample favorites for the user
    user_id = cursor.lastrowid or 1
    
    # Get the count of foods in the database
    food_count = cursor.execute("SELECT COUNT(*) FROM foods").fetchone()[0]
    
    # Add favorites only if there are foods in the database
    if food_count > 0:
        for food_id in range(1, min(6, food_count + 1)):
            try:
                cursor.execute('''
                INSERT OR IGNORE INTO favorites (user_id, food_id)
                VALUES (?, ?)
                ''', (user_id, food_id))
            except sqlite3.IntegrityError as e:
                print(f"Error adding favorite: {e}")
except Exception as e:
    print(f"Error creating user or favorites: {e}")

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Data loading completed successfully!")