from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import os

external_scripts=[
    {'src': 'https://cdn.tailwindcss.com'}
]
server=Flask(__name__)
CORS(server,supports_credentials=True)


server.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///conversiondb.db"
server.config['SECRET_KEY']="SUPER_SECRET_KEY"
server.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
server.config["JWT_COOKIE_SECURE"] = False
server.config["JWT_SECRET_KEY"] = "super-secret"
server.config['JWT_COOKIE_CSRF_PROTECT']=False
server.config['JWT_ACCESS_COOKIE_PATH'] = '/'
server.config['JWT_TOKEN_LOCATION'] = ["headers", "cookies", "json", "query_string"]


db=SQLAlchemy(server)
jwt=JWTManager(server)