# Nutrition and Diet Recommendation Tool

This repository contains a Docker-based application stack for a nutrition and diet recommendation tool, including database, backend API, and frontend

## System Architecture

The application consists of three main components:

1. **SQLite Database** - Stores all nutrition data and user information
2. **Node.js Backend API** - Provides data access and business logic
3. **React Frontend** - Delivers the user interface

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
3. Make sure to copy the branded_foods.csv into your /database folder or the system will use the sample_data as a backup.  https://fdc.nal.usda.gov/download-datasets
4. To use the LLM recommender service you need to get an api key from https://aistudio.google.com/apikey create a .env file in the /frontend folder and add the api key  VITE_GEMINI_API_KEY=INSERT_API_KEY_HERE
5. Build and start the Docker containers:

```bash
docker-compose up --build
```
6. For second run you can without build assuming your database and data is initalized

```bash
docker-compose up 
```

This will:
- Create a SQLite database
- Create the necessary tables
- Populate the database with sample food data
- Make the database ready for use
- Run the backend
- Run the frontend
- 

### Accessing the Application

- **Frontend**: Access the web application at `http://localhost:5173`
- **Backend API**: Available at `http://localhost:3000`
- **Database**: The SQLite database is accessible at `/data/nutrition.db` within the container

### Docker Compose Structure

The application uses a three-service Docker Compose setup:

```yaml
version: '3'

services:
  sqlite:
    build:
      context: ./database
    volumes:
      - nutrition-data:/data
    command: >
      sh -c "if [ ! -f /data/.initialized ]; then
               python sample_data.py &&
               touch /data/.initialized;
             fi &&
             echo 'Database is ready!' &&
             tail -f /dev/null"
  
  api:
    build:
      context: ./backend
    volumes:
      - ./backend:/app
      - /app/node_modules
      - nutrition-data:/data
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DB_PATH=/data/nutrition.db
    depends_on:
      - sqlite
    command: npm run dev

  frontend:
    build:
      context: ./frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=development
    depends_on:
      - api
    command: npm run dev

volumes:
  nutrition-data:
```

### Accessing the Database Directly

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

