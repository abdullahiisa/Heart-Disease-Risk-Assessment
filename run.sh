#!/bin/bash

echo "======================================"
echo " Heart Disease Risk Assessment System "
echo "======================================"

# -------- Backend Setup --------
echo ""
echo "[1/2] Starting Django Backend..."

cd heart_disease_backend || { echo "Backend directory not found"; exit 1; }

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Start Django server
echo "Starting Django server..."
python manage.py runserver 127.0.0.1:8000 &

# -------- Frontend Setup --------
echo ""
echo "[2/2] Starting React Frontend..."

cd ../heart-disease-frontend || { echo "Frontend directory not found"; exit 1; }

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start frontend
echo "Starting React development server..."
npm run dev

