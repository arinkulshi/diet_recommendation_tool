# Nutrition and Diet Recommendation Tool

This repository contains a Docker-based application stack for a nutrition and diet recommendation tool, including database, backend API, and frontend

## System Architecture

The application consists of three main components:

1. **SQLite Database** - Stores all nutrition data and user information
2. **Node.js Backend API** - Provides data access and business logic
3. **React Frontend** - Delivers the user interface

## Database Structure

The database contains three tables:

1. **Foods** - Contains nutritional information for various food items
   - Includes data from branded food products
   - Contains essential nutritional data like calories, protein, fats, and carbohydrates
2. **Users** - Stores basic user information
   - Username, email, and password (hashed)
3. **Favorites** - Manages user-food relationships
   - Allows users to save their favorite foods

# Design Decisions and Future Improvements

## Key Design Decisions

### Overall Architecture

1. **Containerized Microservices**
   - We chose a Docker-based architecture to ensure consistency across envs
   - Each component (database, API, frontend) runs in its own container for better isolation
   - Volume mounting ensures data persistence between container restarts

2. **MVC Pattern for Backend**
   - Adopted the Model-View-Controller pattern for the API to improve code organization and maintainability
   - Models handle data access and business logic
   - Controllers process requests and coordinate with models
   - Routes define the API endpoints and connect them to controllers

3. **SQLite for Database**
   - Chose SQLite for simplicity
   - Efficient for read-heavy operations common in nutritional data lookup
   - No separate database server needed, reducing complexity
   - Appropriate for the expected data size and query patterns

### Frontend Architecture

1. **React + TypeScript**
   - TypeScript for type safety and better development experience
   - React for component-based UI architecture
   - Custom hooks for encapsulating and sharing logic

2. **State Management**
   - React Query for server state management (API data)
   - React Context for client state (user information)
   - Component-local state for UI elements

3. **UI Design**
   - Tailwind CSS for utility-first styling approach
   - Mobile-responsive design from the ground up
   - Card-based UI for consistent presentation of food items
   - Minimalist design focusing on nutritional data clarity

### Data Flow

1. **Food Search and Display**
   - Query parameters for flexible search
   - Pagination to handle large result sets efficiently
   - Detailed view for comprehensive nutritional information

2. **Favorites System**
   - Simple toggle mechanism for adding/removing favorites
   - Efficient lookups for determining favorite status
   - Separate page for managing favorited items

3. **API Integration**
   - Axios for HTTP requests with interceptors for error handling
   - Type-safe API responses mapped to frontend models
   - Optimistic updates for better user experience

## What We'd Improve or Expand With More Time

### Backend Enhancements

1. **Authentication and Authorization**
   - Implement JWT-based authentication
   - Role-based access control
   - Secure password storage

2. **Database Optimization**
   - Migration to PostgreSQL for larger datasets and concurrent users
   - Additional indexes for improved query performance
   - Database connection pooling

3. **API Expansion**
   - Implement filtering for more nutritional attributes
   - Add endpoints for user dietary preferences

4. **Performance and Scalability**
   - Implement caching layers (Redis)
   - Add rate limiting for API protection


### Frontend Improvements

1. **Enhanced User Experience**
   - Advanced filtering options for nutritional values
   - Data visualization with charts and graphs
   - Compare feature for multiple food items

2. **Expanded Features**
   - Meal planning functionality
   - Daily nutrition tracking
   - Nutrition goals and progress tracking


3. **Testing and Quality**
   - Comprehensive unit test coverage
   - Integration tests
   - End-to-end testing with Cypress
   - Accessibility improvements WCAG

### Integration with LLM Recommender

1. **Enhanced AI Features**
   - Fine-tune the model for more accurate nutritional recommendations
   - Personalized recommendations based on user history
   - Natural language search capabilities

2. **Model Improvements**
   - Caching common recommendations
   - Implementing feedback loops for improved suggestions
   - Multi-language support
   - Explanation of recommendations

3. **Health and Dietary Analytics**
   - Nutritional gap analysis
   - Dietary pattern recognition
   - Meal suggestions based on available favorites
   - Allergen and dietary restriction awareness

### DevOps and Infrastructure

1. **CI/CD Pipeline**
   - Automated testing in the deployment pipeline
   - Infrastructure as code
   - Environment promotion strategy
   - Automated database migrations

2. **Monitoring and Observability**
   - Application performance monitoring
   - System health dashboards

3. **Security Enhancements**
   - Regular security audits


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
- Populate the database with sample food data (can take up to 5 minutes to seed the data)
- Make the database ready for use
- Run the backend
- Run the frontend

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


 
