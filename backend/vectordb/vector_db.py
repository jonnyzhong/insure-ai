"""
vector_db.py
Domain: RAG Knowledge Base (Append/Upsert Mode)
"""
import logging
import os
import json
import hashlib
import chromadb
from typing import Any, Dict, List, Optional
from chromadb.config import Settings as ChromaSettings

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_faq_db")
JSON_PATH = os.path.join(BASE_DIR, "faq_data.json")
COLLECTION_NAME = "insurance_sg_faq"

logger = logging.getLogger(__name__)

_chroma_client: Optional[chromadb.Client] = None
_faq_collection: Optional[Any] = None

def get_chroma_client() -> chromadb.Client:
    global _chroma_client
    if _chroma_client is None:
        if not os.path.exists(CHROMA_PATH):
            os.makedirs(CHROMA_PATH)
        _chroma_client = chromadb.PersistentClient(
            path=CHROMA_PATH,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _chroma_client

def get_faq_collection() -> Any:
    global _faq_collection
    if _faq_collection is None:
        client = get_chroma_client()
        _faq_collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
    return _faq_collection

def load_faqs_from_json(filepath: str) -> List[Dict[str, str]]:
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found.")
        return []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error decoding JSON: {e}")
        return []

def generate_id(text: str) -> str:
    """Generates a stable ID based on the question text."""
    return hashlib.md5(text.encode()).hexdigest()

def upsert_faqs(json_file_path: str = JSON_PATH):
    """Loads FAQs and inserts them. If ID exists, it updates."""
    collection = get_faq_collection()

    print(f"Processing FAQs from {json_file_path} ...")
    faqs = load_faqs_from_json(json_file_path)

    if not faqs:
        return

    documents, metadatas, ids = [], [], []

    for faq in faqs:
        stable_id = generate_id(faq['question'])
        doc_text = f"Question: {faq['question']}\nAnswer: {faq['answer']}"
        documents.append(doc_text)
        metadatas.append(faq)
        ids.append(stable_id)

    batch_size = 100
    for i in range(0, len(documents), batch_size):
        collection.upsert(
            documents=documents[i : i + batch_size],
            metadatas=metadatas[i : i + batch_size],
            ids=ids[i : i + batch_size]
        )

    print(f"Processed {len(faqs)} items. Total Collection Size: {collection.count()}")

def query_faqs(query: str, n_results: int = 2) -> str:
    collection = get_faq_collection()
    results = collection.query(query_texts=[query], n_results=n_results)

    if not results['documents'] or not results['documents'][0]:
        return "No relevant FAQ found."

    return "\n\n".join(results['documents'][0])

# Auto-run upsert on import/run
if __name__ == "__main__":
    upsert_faqs()
    print("\nTest Query 'NCD':")
    print(query_faqs("What is NCD?"))
