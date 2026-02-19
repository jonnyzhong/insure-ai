"""
rag_tools.py
Domain: Tool Definition for RAG Search
"""
from langchain_core.tools import tool

# Import directly from your subfolder package
from vectordb.vector_db import query_faqs

@tool
def search_faq(query: str):
    """
    Searches the Knowledge Base for insurance definitions, Singapore terms, and general policies.
    Use this for questions like:
    - "What is NCD?"
    - "Explain PayNow or GIRO"
    - "What does comprehensive coverage mean?"
    - "Who is MAS?"

    DO NOT use this for personal user data (like "What is *my* policy number?").
    """
    return query_faqs(query)
