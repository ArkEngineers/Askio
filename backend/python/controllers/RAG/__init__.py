from flask import Blueprint,request,jsonify,url_for,redirect,make_response,render_template
from models import User
from constants.https_status_codes import *
from config import db,jwt,mongodb_client
import validators
from flask_jwt_extended import create_access_token,jwt_required,set_access_cookies,create_refresh_token,set_refresh_cookies,get_jwt_identity,unset_jwt_cookies
from utils.ApiError import ApiError 
from utils.ApiResponse import ApiResponse 
from utils.RenderResponse import RenderResponse
import os
import pandas as pd
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import Dict, List
from sentence_transformers import SentenceTransformer
from tqdm import tqdm
import pandas as pd
from datasets import load_dataset
from flask import request
from fireworks.client import Fireworks
from langchain.document_loaders import PyPDFLoader

RAG=Blueprint("RAG",__name__,url_prefix="/api/v1/RAG")


@RAG.route("/",methods=['POST'])
def rag_index():
    data = request.get_json()
    collection_name = data["collection_name"]
    link=data["url"]
    print(mongodb_client)

    separators = ["\n\n", "\n", " ", "", "#", "##", "###"]
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        model_name="gpt-4", separators=separators, chunk_size=200, chunk_overlap=30
    )
    
    # Load and process the PDF
    pdf_loader = PyPDFLoader(link)
    pages = pdf_loader.load_and_split()
    
    # Convert PDF pages to the required format
    split_docs = []
    for page in pages:
        # Create a document structure with a unique identifier
        doc = {
            "body": page.page_content,
            "metadata": page.metadata,
            "source_id": f"{data.get('source_name', 'default')}_{page.metadata.get('page', 0)}"  # Create a unique identifier
        }
        chunks = get_chunks(doc, "body", text_splitter)
        split_docs.extend(chunks)

    # Generate embeddings
    embedding_model = SentenceTransformer("thenlper/gte-small")
    embedded_docs = []
    for doc in tqdm(split_docs):
        doc["embedding"] = get_embedding(doc["body"], embedding_model)
        embedded_docs.append(doc)

    # Store in MongoDB
    DB_NAME = "mongodb_rag_lab"
    COLLECTION_NAME = collection_name
    collection = mongodb_client[DB_NAME][COLLECTION_NAME]

    # Create or update vector search index
    try:
        # Define vector search index model using collection name as index name
        vector_search_model = {
            "name": collection_name,  # Using collection_name as index name
            "type": "vectorSearch",
            "definition": {
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding",
                        "numDimensions": 384,  # Dimension of gte-small embeddings
                        "similarity": "cosine"
                    }
                ]
            }
        }
        
        # Create or update the search index
        collection.create_search_index(vector_search_model)
    except Exception as e:
        print(f"Error creating vector search index: {str(e)}")

    # Insert documents one by one, handling duplicates
    successful_inserts = 0
    duplicates = 0
    
    try:
        for doc in embedded_docs:
            try:
                # Try to insert the document, if source_id already exists, update it
                result = collection.update_one(
                    {"source_id": doc["source_id"]},
                    {"$set": doc},
                    upsert=True
                )
                if result.upserted_id:
                    successful_inserts += 1
                else:
                    duplicates += 1
            except Exception as e:
                print(f"Error processing document: {str(e)}")
                continue
                
        return ApiResponse(
            f"Data ingestion completed. Added {successful_inserts} new documents, updated {duplicates} existing documents",
            HTTP_201_CREATED
        )
    
    except Exception as e:
        return ApiResponse(f"Error during data ingestion: {str(e)}", HTTP_500_INTERNAL_SERVER_ERROR)


def vector_search(user_query: str, collection_name) -> List[Dict]:
    """
    Retrieve relevant documents for a user query using vector search.

    Args:
    user_query (str): The user's query string.
    collection_name (str): Name of the collection (also used as index name)

    Returns:
    list: A list of matching documents.
    """
    embedding_model = SentenceTransformer("thenlper/gte-small")
    query_embedding = get_embedding(user_query, embedding_model)

    pipeline = [
        {
            "$vectorSearch": {
                "index": collection_name,  # Using collection_name as index name
                "queryVector": query_embedding,
                "path": "embedding",
                "numCandidates": 150,
                "limit": 5
            }
        },
        {
            "$project": {
                "_id": 0,
                "body": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]

    DB_NAME = "mongodb_rag_lab"
    COLLECTION_NAME = collection_name
    collection = mongodb_client[DB_NAME][COLLECTION_NAME]
    results = collection.aggregate(pipeline)
    return list(results)

def get_chunks(doc: Dict, text_field: str,text_splitter) -> List[Dict]:  
    text = doc[text_field]
    chunks = text_splitter.split_text(text)
    chunked_data = []
    for chunk in chunks:
        temp = doc.copy()
        temp[text_field]=chunk
        chunked_data.append(temp)

    return chunked_data



def get_embedding(text: str,embedding_model) -> List[float]:
    embedding = embedding_model.encode(text)
    return embedding.tolist()
def vector_search(user_query: str,collection_name) -> List[Dict]:
    
    """
    Retrieve relevant documents for a user query using vector search.

    Args:
    user_query (str): The user's query string.

    Returns:
    list: A list of matching documents.
    """
    embedding_model = SentenceTransformer("thenlper/gte-small")

    # Generate embedding for the `user_query` using the `get_embedding` function defined in Step 5
    query_embedding = get_embedding(user_query,embedding_model)



    # Define an aggregation pipeline consisting of a $vectorSearch stage, followed by a $project stage
    # Set the number of candidates to 150 and only return the top 5 documents from the vector search
    # In the $project stage, exclude the `_id` field and include only the `body` field and `vectorSearchScore`
    # NOTE: Use variables defined previously for the `index`, `queryVector` and `path` fields in the $vectorSearch stage
    pipeline = [
    {
        "$vectorSearch": {
            "index": collection_name,
            "queryVector": query_embedding,
            "path": "embedding",
            "numCandidates": 150,
            "limit": 5
        }
    },
    {
        "$project": {
            "_id": 0,
            "body": 1,
            "score": {"$meta": "vectorSearchScore"}
        }
    }
]

    # Execute the aggregation `pipeline` and store the results in `results`
    DB_NAME = "mongodb_rag_lab"
    COLLECTION_NAME = collection_name
    collection = mongodb_client[DB_NAME][COLLECTION_NAME]
    results = collection.aggregate(pipeline)
    return list(results)
def create_prompt(user_query: str,collection_name) -> str:
    """
    Create a chat prompt that includes the user query and retrieved context.

    Args:
        user_query (str): The user's query string.

    Returns:
        str: The chat prompt string.
    """
    # Retrieve the most relevant documents for the `user_query` using the `vector_search` function defined in Step 8
    context = vector_search(user_query,collection_name)


    # Join the retrieved documents into a single string, where each document is separated by two new lines ("\n\n")
    context = "\n\n".join([doc.get('body') for doc in context])
    # Prompt consisting of the question and relevant context to answer it
    prompt = f"Answer the question based only on the following context. If the context is empty, say I DON'T KNOW\n\nContext:\n{context}\n\nQuestion:{user_query}"
    return prompt
@RAG.route("/query",methods=['POST'])
def rag_query():
    data=request.get_json()
    query=data["query"]
    collection_name=data["collection_name"]
    
    fw_client = Fireworks()
    model = "accounts/fireworks/models/llama-v3-8b-instruct"
    prompt = create_prompt(query,collection_name)



    # Use the `prompt` created above to populate the `content` field in the chat message
    response = fw_client.chat.completions.create(
    model=model,
    messages=[{"role": "user", "content": prompt}]
)
    # Print the final answer
    return ApiResponse("Response",HTTP_200_OK ,response.choices[0].message.content)



# model = {
#     "name": ATLAS_VECTOR_SEARCH_INDEX_NAME,
#     "type": "vectorSearch",
#     "definition": {
#         "fields": [
#             {
#                 "type": "vector",
#                 "path": "embedding",
#                 "numDimensions": 384,
#                 "similarity": "cosine",
#             }
#         ]
#     },
# }
# collection.create_search_index(model=model)

# # Step 8: Perform semantic search on your data

# def vector_search(user_query: str) -> List[Dict]:  
#     query_embedding = get_embedding(user_query)
#     pipeline = [
#     {
#         "$vectorSearch": {
#             "index": ATLAS_VECTOR_SEARCH_INDEX_NAME,
#             "queryVector": query_embedding,
#             "path": "embedding",
#             "numCandidates": 150,
#             "limit": 5
#         }
#     },
#     {
#         "$project": {
#             "_id": 0,
#             "body": 1,
#             "score": {"$meta": "vectorSearchScore"}
#         }
#     }
# ]
#     results = collection.aggregate(pipeline)
#     return list(results)

# """### Run vector search queries

# """

# vector_search("What is MongoDB Atlas Search?")

# vector_search("What are triggers in MongoDB Atlas?")



# # Modify the vector search index `model` (from Step 7) to include the `metadata.contentType` field as a `filter` field
# model = {
#     "name": ATLAS_VECTOR_SEARCH_INDEX_NAME,
#     "type": "vectorSearch",
#     "definition": {
#         "fields": [
#             {
#                 "type": "vector",
#                 "path": "embedding",
#                 "numDimensions": 384,
#                 "similarity": "cosine"
#             },
#             {"type": "filter", "path": "metadata.contentType"}
#         ]
#     }
# }

# # Update vector search index
# collection.update_search_index(
#     name=ATLAS_VECTOR_SEARCH_INDEX_NAME, definition=model["definition"]
# )

# # Embed the user query
# query_embedding = get_embedding("What is MongoDB Atlas Search?")


# # Modify the $vectorSearch stage of the aggregation pipeline defined previously to include a filter for documents where the `metadata.contentType` field has the value "Video"
# pipeline = [
#     {
#         "$vectorSearch": {
#             "index": ATLAS_VECTOR_SEARCH_INDEX_NAME,
#             "path": "embedding",
#             "queryVector": query_embedding,
#             "numCandidates": 150,
#             "limit": 5,
#             "filter": {"metadata.contentType": "Video"}
#         }
#     },
#     {
#         "$project":{
#             "_id": 0,
#             "body": 1,
#             "score": {"$meta": "vectorSearchScore"}
#         }
#     }
# ]

# # Execute the aggregation pipeline and view the results
# results = collection.aggregate(pipeline)
# list(results)

# """### Filter on documents which have been updated on or after `2024-05-19` and where the content type is `Tutorial`"""

# # Modify the vector search index `model` (from Step 7) to include the `metadata.contentType` and `updated` fields as `filter` fields
# model = {
#     "name": ATLAS_VECTOR_SEARCH_INDEX_NAME,
#     "type": "vectorSearch",
#     "definition": {
#         "fields": [
#             {
#                 "type": "vector",
#                 "path": "embedding",
#                 "numDimensions": 384,
#                 "similarity": "cosine"
#             },
#             {"type": "filter", "path": "metadata.contentType"},
#             {"type": "filter", "path": "updated"}
#         ]
#     }
# }

# # Update vector search index
# collection.update_search_index(
#     name=ATLAS_VECTOR_SEARCH_INDEX_NAME, definition=model["definition"]
# )

# # Embed the user query
# query_embedding = get_embedding("What is MongoDB Atlas Search?")

# # Modify the $vectorSearch stage of the aggregation pipeline defined previously to include a filter for documents where
# # the `metadata.contentType` field has the value "Tutorial"
# # AND
# # the `updated` field is greater than or equal to "2024-05-19"
# pipeline = [
#     {
#         "$vectorSearch": {
#             "index": ATLAS_VECTOR_SEARCH_INDEX_NAME,
#             "path": "embedding",
#             "queryVector": query_embedding,
#             "numCandidates": 150,
#             "limit": 5,
#             "filter": {
#                 "$and": [
#                     {"metadata.contentType": "Tutorial"},
#                     {"updated": {"$gte": "2024-05-19"}}
#                 ]
#             }
#         }
#     },
#     {
#         "$project": {
#             "_id": 0,
#             "body": 1,
#             "updated": 1,
#             "score": {"$meta": "vectorSearchScore"}
#         }
#     }
# ]

# # Execute the aggregation pipeline and view the results
# results = collection.aggregate(pipeline)
# list(results)

# """# Step 9: Build the RAG application

# ### Instantiate a chat model
# """

# from fireworks.client import Fireworks

# # Initializing the Fireworks AI client and the model string
# fw_client = Fireworks()
# model = "accounts/fireworks/models/llama-v3-8b-instruct"

# """### Define a function to create the chat prompt"""

# def create_prompt(user_query: str) -> str:
#     context = vector_search(user_query)


#     context = "\n\n".join([doc.get('body') for doc in context])
#     prompt = f"Answer the question based only on the following context. If the context is empty, say I DON'T KNOW\n\nContext:\n{context}\n\nQuestion:{user_query}"
#     return prompt

# # Define a function to answer user queries


# # Define a fnction to answer user queries using Fireworks' Chat Completion API
# def generate_answer(user_query: str) -> None:
#     # Use the `create_prompt` function above to create a chat prompt
#     prompt = create_prompt(user_query)
#     # Use the `prompt` created above to populate the `content` field in the chat message
#     response = fw_client.chat.completions.create(
#     model=model,
#     messages=[{"role": "user", "content": prompt}]
# )
#     # Print the final answer
#     print(response.choices[0].message.content)
# generate_answer("What is MongoDB Atlas Search?")

# generate_answer("What did I just ask you?")


# from sentence_transformers import CrossEncoder

# rerank_model = CrossEncoder("mixedbread-ai/mxbai-rerank-xsmall-v1")

# # Add a re-ranking step to the following function
# def create_prompt(user_query: str) -> str:
    
#     context = vector_search(user_query)
#     documents = [d.get("body") for d in context]
#     reranked_documents = rerank_model.rank(
#     user_query, documents, return_documents=True, top_k=5
# )
#     context = "\n\n".join([d.get("text", "") for d in reranked_documents])
#     prompt = f"Answer the question based only on the following context. If the context is empty, say I DON'T KNOW\n\nContext:\n{context}\n\nQuestion:{user_query}"
#     return prompt

# # Note the impact of re-ranking on the generated answer
# generate_answer("What are triggers in MongoDB Atlas?")



# # Define a function to answer user queries in streaming mode using Fireworks' Chat Completion API
# def generate_answer(user_query: str) -> None:
   
#     # Use the `create_prompt` function defined in Step 9 to create a chat prompt
#     prompt = create_prompt(user_query)


#     # Use the `prompt` created above to populate the `content` field in the chat message
#     # Set the `stream` parameter to True
#     response = fw_client.chat.completions.create(
#     model=model,
#     messages=[{"role": "user", "content": prompt}],
#     stream=True
# )

#     # Iterate through the `response` generator and print the results as they are generated
#     for chunk in response:
#       if chunk.choices[0].delta.content:
#         print(chunk.choices[0].delta.content, end="")

# generate_answer("What is MongoDB Atlas Search?")

# """# Step 10: Add memory to the RAG application

# """

# from datetime import datetime

# history_collection = mongodb_client[DB_NAME]["chat_history"]
# # Create an index on the key `session_id` for the `history_collection` collection
# history_collection.create_index("session_id")

# def store_chat_message(session_id: str, role: str, content: str) -> None:

#     message = {
#         "session_id": session_id,
#         "role": role,
#         "content": content,
#         "timestamp": datetime.now(),
#     }
#     history_collection.insert_one(message)



# def retrieve_session_history(session_id: str) -> List:
#     cursor =  history_collection.find({"session_id": session_id}).sort("timestamp", 1)
#     if cursor:
        
#         messages = [{"role": msg["role"], "content": msg["content"]} for msg in cursor]
#     else:
#         messages = []

#     return messages



# def generate_answer(session_id: str, user_query: str) -> None:
  
#     # Initialize list of messages to pass to the chat completion model
#     messages = []

#     # Retrieve documents relevant to the user query and convert them to a single string
#     context = vector_search(user_query)
#     context = "\n\n".join([d.get("body", "") for d in context])
#     # Create a system prompt containing the retrieved context
#     system_message = {
#         "role": "system",
#         "content": f"Answer the question based only on the following context. If the context is empty, say I DON'T KNOW\n\nContext:\n{context}",
#     }
#     # Append the system prompt to the `messages` list
#     messages.append(system_message)

#     # Use the `retrieve_session_history` function to retrieve message history from MongoDB for the session ID `session_id`
#     # And add all messages in the message history to the `messages` list
#     message_history = retrieve_session_history(session_id)


#     messages.extend(message_history)

#     # Format the user message in the format {"role": <role_value>, "content": <content_value>}
#     # The role value for user messages must be "user"
#     # And append the user message to the `messages` list
#     user_message = {"role": "user", "content": user_query}


#     messages.append(user_message)

#     # Call the chat completions API
#     response = fw_client.chat.completions.create(model=model, messages=messages)

#     answer = response.choices[0].message.content


#     store_chat_message(session_id, "user", user_query)
#     store_chat_message(session_id, "assistant", answer)

#     print(answer)

# generate_answer(
#     session_id="1",
#     user_query="What is mongo db?",
# )

# generate_answer(
#     session_id="1",
#     user_query="What is the answer of last quiz question",
# )