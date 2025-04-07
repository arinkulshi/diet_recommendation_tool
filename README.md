# Nutrition and Diet Recommendation Tool - Database Setup

This repository contains a Docker-based SQLite database setup for a nutrition and diet recommendation application.

## Database Structure

The database contains three main tables:

1. **Foods** - Contains nutritional information for various food items
   - Includes data from branded food products
   - Contains essential nutritional data like calories, protein, fats, and carbohydrates

2. **Users** - Stores basic user information
   - Username, email, and password (hashed)

3. **Favorites** - Manages user-food relationships
   - Allows users to save their favorite foods

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system

### Setup Instructions

1. Clone this repository
2. Navigate to the project directory
3. Build and start the Docker container:

```bash
docker-compose up
```

This will:
- Create a SQLite database
- Create the necessary tables
- Populate the database with sample food data
- Make the database ready for use

### Accessing the Database

The SQLite database is accessible at `/data/nutrition.db` within the container. 

You can connect to the database using:

```bash
docker exec -it <container_name> sqlite3 /data/nutrition.db
```

Where `<container_name>` is the name of your Docker container (typically something like `nutrition-sqlite-1`).

### Sample Queries

Here are some useful queries to explore the database:

```sql
-- Count all food items
SELECT COUNT(*) FROM foods;

-- Find foods by brand name
SELECT id, brand_name, calories, protein, total_fat, carbohydrates 
FROM foods 
WHERE brand_name LIKE '%Cheerios%';

-- Get a user's favorite foods
SELECT f.brand_name, f.calories, f.protein, f.total_fat, f.carbohydrates
FROM favorites fav
JOIN foods f ON fav.food_id = f.id
WHERE fav.user_id = 1;
```

## Next Steps

This database setup is the foundation for the nutrition and diet recommendation tool. The next steps would be to:

1. Set up the backend API using Express.js to access this database
2. Create frontend components to search for foods and display nutritional information
3. Implement user authentication and favorite foods management

## Data Model Extension

You can extend the database schema to include:

- Meal plans
- Dietary restrictions
- Nutritional goals
- More detailed nutritional information

Simply update the `init_db.py` file with additional table definitions and constraints.