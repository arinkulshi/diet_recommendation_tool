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

# Create docker-entrypoint.sh file
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Start container with the entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]