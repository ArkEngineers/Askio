from config import server
from constants.https_status_codes import *
from utils.ApiResponse import ApiResponse
# from controllers.auth import auth
from controllers.RAG import RAG
# server.register_blueprint(auth)
server.register_blueprint(RAG)

@server.route("/",methods=['GET'])
def server_index():
    return ApiResponse("Working Server",HTTP_200_OK)

if __name__== '__main__':
    # with server.app_context():
    #     db.create_all()
    server.run(debug=True)