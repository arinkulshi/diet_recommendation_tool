module.exports = {
    port: process.env.PORT || 3000,
    database: {
      path: process.env.DB_PATH || '/data/nutrition.db'
    }
  };