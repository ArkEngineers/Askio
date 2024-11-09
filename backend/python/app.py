from config import server,db
from flask import redirect
from constants.https_status_codes import *
from utils.ApiResponse import ApiResponse
from controllers.auth import auth
from controllers.convert import convert

server.register_blueprint(auth)
server.register_blueprint(convert)

@server.route("/",methods=['GET'])
def server_index():
    return ApiResponse("Working Server",HTTP_200_OK)

if __name__== '__main__':
    with server.app_context():
        db.create_all()
    server.run(debug=True)