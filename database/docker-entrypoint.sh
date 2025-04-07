#!/bin/bash
set -e

echo "Starting database initialization..."

# Initialize the database structure
python /app/init_db.py

# Check if the database is already initialized
if [ ! -f /data/.initialized ]; then
  echo "Looking for CSV files..."
  
  # Search for CSV files in various locations within the mounted project
  CSV_LOCATIONS=(
    "/project/*.csv"
    "/project/database/*.csv"
    "/project/data/*.csv"
    "/app/*.csv"
  )
  
  # Find any CSV file with 'branded' in the name
  for LOCATION in "${CSV_LOCATIONS[@]}"; do
    echo "Searching in $LOCATION"
    for CSV_FILE in $LOCATION; do
      if [ -f "$CSV_FILE" ]; then
        if [[ "$CSV_FILE" == *"branded"* ]]; then
          echo "Found branded CSV file: $CSV_FILE"
          # Copy to app directory for processing
          cp "$CSV_FILE" /app/
          # Use the first matching file
          FOUND_CSV=true
          break
        fi
      fi
    done
    
    # If we found a branded CSV file, stop looking
    if [ "$FOUND_CSV" = true ]; then
      break
    fi
  done
  
  # List any CSV files found in the app directory
  echo "CSV files copied to /app directory:"
  ls -la /app/*.csv 2>/dev/null || echo "No CSV files found in /app"
  
  echo "Initializing database with data..."
  
  # Run sample data script
  python /app/sample_data.py
  
  # Mark database as initialized if sample_data.py succeeded
  if [ $? -eq 0 ]; then
    touch /data/.initialized
    echo "Database initialization completed successfully!"
  else
    echo "Database initialization failed!"
    exit 1
  fi
else
  echo "Database already initialized, skipping data import."
fi

# Execute the command passed to the container
echo "Database is ready!"
exec "$@"