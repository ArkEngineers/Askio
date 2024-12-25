from flask import Blueprint,request
from config import mongodb_client
import requests
import tempfile
from sentence_transformers import SentenceTransformer
from pymongo.operations import SearchIndexModel
from constants.https_status_codes import *
from utils.ApiResponse import ApiResponse
from utils.ApiError import ApiError
from gpt4all import GPT4All
import os
import PyPDF2

RAG=Blueprint("RAG",__name__,url_prefix="/api/v1/RAG")

MODEL_PATH="path"
os.makedirs(MODEL_PATH, exist_ok=True)
model = SentenceTransformer('mixedbread-ai/mxbai-embed-large-v1')
model.save(MODEL_PATH,safe_serialization=False)
model = SentenceTransformer(MODEL_PATH)
collection = mongodb_client["ASKIO"]["MongoDB_Knowledge_Base"]


# DB_NAME = "mongodb_rag_lab"
# COLLECTION_NAME = data["collection_name"]

@RAG.route("/parse_pdf_url", methods=['POST'])
def parse_pdf_url():
    try:
        # Get the PDF URL from the request payload
        data = request.json
        pdf_url = data.get("pdf_url")
        if not pdf_url:
            return ApiError("PDF URL is required.", HTTP_400_BAD_REQUEST)
        
        # Download the PDF file from the provided URL
        response = requests.get(pdf_url)
        if response.status_code != 200:
            return ApiError("Failed to fetch the PDF file.", HTTP_400_BAD_REQUEST)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
            temp_pdf.write(response.content)
            temp_pdf_path = temp_pdf.name

        # Read and extract text from the PDF
        text = extract_text_from_pdf(temp_pdf_path)
        os.remove(temp_pdf_path)

        if not text:
            return ApiError("No text could be extracted from the PDF.", HTTP_400_BAD_REQUEST)
        
        # Generate embeddings
        embedding = get_embedding(text)
        collection.insert_one({"pdf_url": pdf_url, "text": text, "embeddings": embedding})

        search_index(collection)

        return ApiResponse("PDF processed successfully.", HTTP_200_OK, {"text_preview": text[:500]})
    
    except Exception as e:
        return ApiError(f"An error occurred: {str(e)}", HTTP_500_INTERNAL_SERVER_ERROR)

def extract_text_from_pdf(file_path):
    """Extracts text from a PDF file."""
    text = ""
    try:
        with open(file_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text


def search_index(collection):
    # Create your index model, then create the search index
    search_index_model = SearchIndexModel(
    definition = {
        "fields": [
            {
                "type": "vector",
                "numDimensions": 384, #1024
                "path": "embeddings",
                "similarity": "cosine"
            }
        ]
    },
    name = "vector_index",
    type = "vectorSearch" 
    )
    collection.create_search_index(model=search_index_model)

def get_embedding(text):
    return model.encode(text).tolist()

def get_query_results(query):
   query_embedding = get_embedding(query)
   pipeline = [
      {
            "$vectorSearch": {
               "index": "vector_index",
               "queryVector": query_embedding,
               "path": "embedding",
               "exact": True,
               "limit": 5,
            }
      }, {
            "$project": {
               "_id": 0,
               "summary": 1,
               "listing_url": 1,
               "score": {
                  "$meta": "vectorSearchScore"
               }
            }
      }
   ]
   results = collection.aggregate(pipeline)
   array_of_results = []
   for doc in results:
      array_of_results.append(doc)
   return array_of_results

# local_llm_path = "path\orca-mini-3b.gguf"
local_llm_path="./orca-mini-3b-gguf2-q4_0.gguf"
local_llm = GPT4All(local_llm_path)


@RAG.route("/ask_question", methods=['POST'])
def ask_question():
    data = request.json
    question = data.get("question", "")
    if not question:
        return ApiError("Question not provided", HTTP_400_BAD_REQUEST)

    documents = get_query_results(question)
    if not documents:
        return ApiError("No relevant documents found", HTTP_404_NOT_FOUND)

    text_documents = "\n".join(
        f"Summary: {doc.get('summary', '')}, Link: {doc.get('listing_url', '')}"
        for doc in documents
    )

    prompt = f"""Use the following pieces of context to answer the question:
    {text_documents}
    Question: {question}
    """
    response = local_llm.generate(prompt)
    return ApiResponse("Answer Generated", HTTP_200_OK, response.strip())
