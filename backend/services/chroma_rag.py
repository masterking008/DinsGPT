# backend/services/chroma_rag.py

import os
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
from config import DATA_DIR

embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

def get_user_chroma(user_id):
    persist_dir = os.path.join(DATA_DIR, user_id, "db")
    os.makedirs(persist_dir, exist_ok=True)
    return Chroma(persist_directory=persist_dir, embedding_function=embedding)

def ingest_document(user_id, filename, content):
    user_folder = os.path.join(DATA_DIR, user_id, "uploads")
    os.makedirs(user_folder, exist_ok=True)

    path = os.path.join(user_folder, filename)
    with open(path, "wb") as f:
        f.write(content)

    if filename.endswith(".pdf"):
        loader = PyPDFLoader(path)
    else:
        loader = TextLoader(path)

    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    db = get_user_chroma(user_id)
    db.add_documents(chunks)
    return len(chunks)

def query_rag(user_id, query):
    db = get_user_chroma(user_id)
    results = db.similarity_search(query, k=4)
    
    if not results:
        return None
    
    context = "\n\n".join([doc.page_content for doc in results])
    
    if len(context.strip()) < 10:
        return None
    
    prompt = f"""You are an AI assistant that answers questions based ONLY on the provided document context. Do not use your general knowledge.

IMPORTANT RULES:
- Answer ONLY using information from the context below
- If the context doesn't contain the answer, say "I don't have information about that in the uploaded documents"
- Be specific and reference the document content
- Do not give generic responses

Document Context:
{context}

User Question: {query}

Answer based on the document context:"""

    from .ollama_client import generate_response
    return generate_response([{"role": "user", "content": prompt}])
