from flask import Blueprint,request,jsonify,url_for,redirect,make_response,render_template
from models import User
from constants.https_status_codes import *
from config import db,jwt
import validators
from flask_jwt_extended import create_access_token,jwt_required,set_access_cookies,create_refresh_token,set_refresh_cookies,get_jwt_identity,unset_jwt_cookies
from utils.ApiError import ApiError 
from utils.ApiResponse import ApiResponse 
from utils.RenderResponse import RenderResponse

convert=Blueprint("convert",__name__,url_prefix="/api/v1/convert")


@convert.route("/",methods=['GET'])
@jwt_required()
def all_user():
    users=User.query.all()
    json_user=list(map(lambda x:x.to_json(),users))
    return ApiResponse("Users Fetched!",HTTP_200_OK,json_user)
