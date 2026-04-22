import os
from typing import Any

from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def _safe_index(index_name: str | None) -> Any | None:
	if not index_name:
		return None

	try:
		return pc.Index(index_name)
	except Exception:
		return None


text_index = _safe_index(os.getenv("PINECONE_TEXT_INDEX"))
image_index = _safe_index(os.getenv("PINECONE_IMAGE_INDEX"))
