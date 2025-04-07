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

# Railway doesn't allow VOLUME keyword in Dockerfiles
# The volume will be managed by the docker-compose configuration

# Start a shell that keeps the container running
CMD ["tail", "-f", "/dev/null"]