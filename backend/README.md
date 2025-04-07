# Nutrition API

RESTful API for the Nutrition and Diet Recommendation Tool.

## API Endpoints

### Search Foods

```
GET /api/foods/search
```

Query Parameters:
- `query` (optional): Search term for food name or ingredients
- `category` (optional): Filter by food category
- `limit` (optional, default: 20): Number of results to return
- `offset` (optional, default: 0): Pagination offset

Example Response:
```json
{
  "results": [
    {
      "id": 1,
      "brand_name": "Cheerios",
      "brand_owner": "General Mills",
      "calories": 100,
      "protein": 3,
      "fat": 2,
      "carbohydrates": 20,
      "serving_size": 28,
      "serving_size_unit": "g",
      "branded_food_category": "Breakfast Cereals"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

### Get Food Details

```
GET /api/foods/:id
```

Parameters:
- `id`: Food ID

Example Response:
```json
{
  "id": 1,
  "fdc_id": "1",
  "brand_owner": "General Mills",
  "brand_name": "Cheerios",
  "subbrand_name": "Original",
  "gtin_upc": "16000275652",
  "ingredients": "Whole Grain Oats, Corn Starch, Sugar, Salt, Tripotassium Phosphate, Vitamin E.",
  "serving_size": 28,
  "serving_size_unit": "g",
  "calories": 100,
  "protein": 3,
  "total_fat": 2,
  "carbohydrates": 20,
  "fiber": 3,
  "sugars": 1,
  "sodium": 140
}
```

### Get User's Favorites

```
GET /api/users/:id/favorites
```

Parameters:
- `id`: User ID

Example Response:
```json
[
  {
    "id": 1,
    "brand_name": "Cheerios",
    "brand_owner": "General Mills",
    "calories": 100,
    "protein": 3,
    "fat": 2,
    "carbohydrates": 20,
    "branded_food_category": "Breakfast Cereals",
    "favorite_id": 1,
    "created_at": "2023-06-01T12:00:00.000Z"
  }
]
```

### Add to Favorites

```
POST /api/users/:id/favorites
```

Parameters:
- `id`: User ID

Request Body:
```json
{
  "food_id": 1
}
```

Example Response:
```json
{
  "id": 1,
  "brand_name": "Cheerios",
  "brand_owner": "General Mills",
  "calories": 100,
  "protein": 3,
  "fat": 2,
  "carbohydrates": 20,
  "branded_food_category": "Breakfast Cereals",
  "favorite_id": 1,
  "created_at": "2023-06-01T12:00:00.000Z"
}
```

### Remove from Favorites

```
DELETE /api/users/:userId/favorites/:favoriteId
```

Parameters:
- `userId`: User ID
- `favoriteId`: Favorite ID

Response: 204 No Content

### Get Food Categories

```
GET /api/categories
```

Example Response:
```json
[
  "Breakfast Cereals",
  "Snack/Granola Bars",
  "Yogurt",
  "Bread & Bakery Products"
]
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common status codes:
- 400: Bad Request
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Development

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```