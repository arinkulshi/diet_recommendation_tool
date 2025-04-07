FROM python:3.9-slim

# Install necessary packages
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Set up working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy database initialization scripts
COPY init_db.py .
COPY sample_data.py .
COPY branded_food.csv .

# Create volume mount point for the database
VOLUME /data

# Instead of running the initialization script at build time,
# we'll let docker-compose handle it at container startup
# This allows the database to be initialized only once
# and persist across container restarts

# Start a shell that keeps the container running
CMD ["tail", "-f", "/dev/null"]