# NutriTracker Frontend

## Overview

The NutriTracker frontend is a React/TypeScript application that provides a user-friendly interface for searching and managing nutritional information about food products. It connects to a RESTful backend API to retrieve and store data.

## Features

- **Food Search**: Search for foods by name and filter by category
- **Nutritional Information Display**: View detailed nutrition facts in a clean, card-based UI
- **Favorites Management**: Save foods to your favorites list for quick access
- **Responsive Design**: Fully functional on both desktop and mobile devices

## Tech Stack

- **React 18**: UI component library
- **TypeScript**: Type-safe JavaScript
- **React Query**: Data fetching, caching, and state management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API requests
- **Vite**: Fast build tool and development server

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or Yarn

### Installation and Setup

1. Clone the repository (or extract to a directory)

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Configure the API endpoint:
   - Create a `.env` file in the frontend directory
   - Add `VITE_API_URL=http://localhost:3000/api` (adjust the URL if your API is hosted elsewhere)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── api/                    # API integration
│   ├── client.ts           # Axios configuration
│   ├── foodsApi.ts         # Food-related API requests
│   ├── favoritesApi.ts     # Favorites-related API requests
│   └── types.ts            # TypeScript interfaces for API data
│
├── components/             # Reusable UI components
│   ├── foods/              # Food-related components
│   │   ├── FoodCard.tsx    # Card component for food items
│   │   ├── FoodList.tsx    # List of food cards with pagination
│   │   ├── FoodSearch.tsx  # Search form for foods
│   │   └── NutritionInfo.tsx # Displays nutritional information
│   │
│   ├── favorites/          # Favorites-related components
│   │   ├── FavoriteButton.tsx # Toggle for favorite status
│   │   └── FavoritesList.tsx  # List of favorite foods
│   │
│   └── layout/             # Page layout components
│       ├── Header.tsx      # Application header with navigation
│       └── MainLayout.tsx  # Main page layout wrapper
│
├── hooks/                  # Custom React hooks
│   ├── useFoods.ts         # Hook for food search and selection
│   └── useFavorites.ts     # Hook for favorites management
│
├── pages/                  # Page components
│   ├── SearchPage.tsx      # Main search page
│   └── FavoritesPage.tsx   # User's favorites page
│
├── context/                # React context
│   └── UserContext.tsx     # User state management
│
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles (includes Tailwind)
```

## Component Descriptions

### Main Pages

- **SearchPage**: The primary page where users can search for foods and view detailed nutrition information
- **FavoritesPage**: Displays the user's saved favorite foods

### Key Components

- **FoodSearch**: Form component for searching foods by name and filtering by category
- **FoodList**: Displays search results with pagination
- **FoodCard**: Card component showing basic food information and nutrition highlights
- **NutritionInfo**: Displays detailed nutritional information for a selected food
- **FavoriteButton**: Toggle button to add/remove foods from favorites
- **FavoritesList**: Displays the user's saved favorite foods

### Custom Hooks

- **useFoods**: Manages food search state, pagination, and selection
- **useFavorites**: Handles adding/removing favorites and retrieving the user's favorite foods

## API Integration

The frontend communicates with the backend through a RESTful API. The main endpoints used are:

- `GET /api/foods/search` - Search for foods by name and category
- `GET /api/foods/:id` - Get detailed food information
- `GET /api/categories` - Get all food categories
- `GET /api/users/:id/favorites` - Get a user's favorite foods
- `POST /api/users/:id/favorites` - Add a food to favorites
- `DELETE /api/users/:userId/favorites/:favoriteId` - Remove a food from favorites

## Build and Deployment

1. Create a production build:
   ```bash
   npm run build
   ```

2. The compiled assets will be in the `dist` directory, which can be deployed to any static web server.

## Development Notes

- The application uses React Query for efficient data fetching and caching
- Tailwind CSS is used for styling - modifications can be made in `tailwind.config.js`
- The mock user (id: "123") is used for development purposes and should be replaced with proper authentication in production

## Future Enhancements

- User authentication and registration
- Enhanced nutrition visualization with charts
- Food comparison tool
- Customizable dashboard
- Dark mode theme option