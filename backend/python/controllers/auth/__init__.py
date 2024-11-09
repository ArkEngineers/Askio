from flask import Blueprint,request,jsonify,url_for,redirect,make_response,render_template
from models import User
from constants.https_status_codes import *
from config import db,jwt
import validators
from flask_jwt_extended import create_access_token,jwt_required,set_access_cookies,create_refresh_token,set_refresh_cookies,get_jwt_identity,unset_jwt_cookies
from utils.ApiError import ApiError 
from utils.ApiResponse import ApiResponse 
from utils.RenderResponse import RenderResponse

auth=Blueprint("auth",__name__,url_prefix="/api/v1/auth")


@auth.route("/",methods=['GET'])
@jwt_required()
def all_user():
    users=User.query.all()
    json_user=list(map(lambda x:x.to_json(),users))
    return ApiResponse("Users Fetched!",HTTP_200_OK,json_user)

@auth.route("/register",methods=['POST'])
def register():
    data=request.get_json()
    first_name=data["firstName"]
    last_name=data["lastName"]
    email=data["email"]
    userName=data["userName"]
    password=data["password"]

    print(first_name,last_name,email,userName,password)
    if not first_name or not last_name or not email:
        return (ApiError("You must include first name , last name and email",HTTP_400_BAD_REQUEST))
    if not validators.email(email):
        return (ApiError("Email is invalid",HTTP_400_BAD_REQUEST))
        

    new_user=User(first_name=first_name,last_name=last_name,email=email,username=userName,password=password)
    try:
        db.session.add(new_user)
        db.session.commit()
        print("Registered")
        return ApiResponse("User created successfully",HTTP_200_OK,new_user.to_json()) 
    except Exception as e:
        print("error")
        db.session.rollback()
        return ApiError("User Registration Not Successfull",HTTP_400_BAD_REQUEST)

@auth.route("/update-user/<int:user_id>",methods=["PATCH"])
@jwt_required()
def update_user(user_id):
    user=User.query.get(user_id)
    
    if not user:
        return ApiError("User not found",HTTP_400_BAD_REQUEST)
    
    data=request.json
    user.first_name=data.get("firstName",user.first_name)
    user.last_name=data.get("lastName",user.last_name)

    db.session.commit()
    return ApiResponse("User updated!",HTTP_201_CREATED,user.to_json())

@auth.route("/delete-user/<int:user_id>",methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user=User.query.get(user_id)

    if not user:
        return ApiError("User not found",HTTP_400_BAD_REQUEST)
    db.session.delete(user)
    db.session.commit()

    return ApiResponse("User deleted!",HTTP_200_OK,user.to_json())

@auth.route("/login",methods=['POST'])
def login():
    data=request.get_json()
    username=data['userName']
    password=data['password']
    user=User.query.filter_by(username=username).first()

    if user and user.password!=password:
        try:
            return RenderResponse('error.html',HTTP_400_BAD_REQUEST,{"error_message":str(e),"error_code":"invalide user"})
        except:
             return ApiError('an error occured',HTTP_400_BAD_REQUEST) 
    #if not user:
     #   return ApiError("Invalid User",HTTP_400_BAD_REQUEST)
    
    access_token=create_access_token(identity=user.id)
    refresh_token=create_refresh_token(identity=user.id)

    resp =jsonify({
        'user':user.to_json()
    })
    set_access_cookies(resp,access_token)
    set_refresh_cookies(resp,refresh_token)
    
    return resp


@auth.route('/refresh', methods=['POST'])
@jwt_required()
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)

    resp = jsonify({'refresh': True})
    set_access_cookies(resp, access_token)
    return resp, 200


@auth.route('/logout', methods=['POST'])
def logout():
    resp=jsonify({
        'message':"Logout Successfully!!",
        'status':HTTP_200_OK
    })
    unset_jwt_cookies(resp)
    return resp