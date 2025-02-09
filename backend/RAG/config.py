from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import os

# Load environment variables
load_dotenv(dotenv_path=".env")

# Flask setup
server = Flask(__name__)
CORS(server, supports_credentials=True)

# Fetch MongoDB URI
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not set. Check your .env file.")

# Debug MongoDB URI
print("MONGODB_URI:", MONGODB_URI)

# Initialize MongoDB client
mongodb_client = MongoClient(MONGODB_URI)
