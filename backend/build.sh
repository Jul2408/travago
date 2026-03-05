#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

echo "--- DEPLOY DEBUG ---"
echo "Current directory: $(pwd)"
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is EMPTY. Using local sqlite."
else
  echo "DATABASE_URL is DETECTED."
fi
echo "--- END DEBUG ---"

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
