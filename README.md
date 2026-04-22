# Multimodal RAG Chatbot 🤖📚🖼️

A multimodal Retrieval-Augmented Generation (RAG) chatbot that can understand and answer questions about **documents, images, and YouTube videos**, with optional **web search** and **UI generation** tools.

- **Check it out**: https://intel-x-amber.vercel.app/


---

## Overview 🧭

This project lets you:

- 📄 Upload PDFs and images.
- 📺 Ingest YouTube videos via their subtitles.
- 💬 Ask natural language questions about your content.
- 🔍 Retrieve and combine relevant text and image information via vector search.
- 🧰 Optionally call tools (web search, UI generator) when the model decides they are helpful.

The goal is to provide a lightweight but powerful demo of a multimodal RAG system built with modern tooling on both the frontend and backend.

---

## Features ✨

- **Document upload (PDFs & images)** 📎  
  - PDFs: text is extracted, chunked, embedded, and stored in Pinecone.  
  - Images: captioned using an OpenAI vision model; captions are embedded and stored for retrieval.

- **Multimodal RAG** 🧠  
  - Uses the same text embedding space for:  
    - Document text chunks  
    - Image captions  
  - Answers questions grounded in retrieved context (text + images).

- **YouTube ingestion** 🎬  
  - Accepts a YouTube URL.  
  - Fetches the transcript (if available), indexes it, and generates a concise summary.  
  - Lets you chat about the video as if it were a document.

- **Web search tool** 🌐  
  - Uses Tavily API to search the web and summarize results when local context is not enough.

- **UI generation tool** 🎨  
  - Given a textual spec, asks an LLM to generate a small React/TSX component.

- **Clean chat UI** 💬  
  - Document list with active selection.  
  - Chat history with user and bot messages.  
  - Light/dark theme toggle 🌞🌙.

---

## Tech Stack (Brief) 🛠️

- **Frontend** ⚛️  
  - Next.js (App Router)  
  - React + TypeScript  
  - Axios  
  - Deployed on Vercel  

- **Backend** 🐍  
  - FastAPI + Uvicorn  
  - OpenAI API (chat, vision, embeddings)  
  - Pinecone (vector database)  
  - PyPDF2, PyMuPDF (PDF handling)  
  - youtube-transcript-api (YouTube subtitles)  
  - Deployed on Render  

---

## Setup Instructions ⚙️

### 1. Prerequisites

- Python 3.11+ 🐍
- Node.js (LTS) + npm 🧩
- A Pinecone account and two indexes:
  - Text index (dimension **3072**)
  - Image index (dimension **3072**)
- API keys:
  - OpenAI
  - Tavily
  - Pinecone

---

### 2. Clone the Repository

```bash
git clone https://github.com/<your-username>/multimodal-rag.git
cd multimodal-rag
```

---

### 3. Backend Setup (FastAPI) 🧠

From the project root:

```bash
cd backend
python -m venv venv
# PowerShell
.\venv\Scripts\Activate.ps1
# or Command Prompt
venv\Scripts\activate.bat
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
OPENAI_API_KEY=your_openai_key
TAVILY_API_KEY=your_tavily_key

PINECONE_API_KEY=your_pinecone_key
PINECONE_TEXT_INDEX=your_text_index_name       # dimension 3072
PINECONE_IMAGE_INDEX=your_image_index_name     # dimension 3072

APP_ENV=development
```



Run the backend locally:

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

- API root: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

---

### 4. Frontend Setup (Next.js) 💻

In a new terminal window:

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
# For local development pointing to remote backend:
# NEXT_PUBLIC_API_URL=https://intelx-wxil.onrender.com
```

Start the development server:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`

You can now:

1. Open `http://localhost:3000`.
2. Upload a PDF or image.
3. Ask questions about your uploaded content.
4. Try YouTube ingestion and web search modes.

---

## Vercel Deployment 🚀

**✅ Frontend Deployed**: https://intel-x-amber.vercel.app/  
**✅ Backend Deployed**: https://intelx-wxil.onrender.com/ (Render)

This repository is configured for deployment from the project root.

### What Vercel runs

- **Install command**: installs frontend dependencies and backend Python packages.
- **Build command**: builds the Next.js frontend in `frontend/`.
- **Backend**: Python API deployed separately on Render at https://intelx-wxil.onrender.com

### Environment variables

Set the following in your Vercel Project Settings to connect to the Render backend:

```env
NEXT_PUBLIC_API_URL=https://intelx-wxil.onrender.com
OPENAI_API_KEY=your_key
TAVILY_API_KEY=your_key
PINECONE_API_KEY=your_key
PINECONE_TEXT_INDEX=your_index_name
PINECONE_IMAGE_INDEX=your_image_index_name
WEBSHARE_USERNAME=optional
WEBSHARE_PASSWORD=optional
```

These variables allow the frontend to authenticate with OpenAI, Tavily, Pinecone, and optional proxy services.

### Deploy steps

1. Push the repo to GitHub.
2. Import the repository into Vercel.
3. In Vercel Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_API_URL=https://intelx-wxil.onrender.com`
   - Any other required env vars from the list above.
4. Trigger a deploy or wait for automatic deployment on push.
5. Frontend will be live at `https://intel-x-amber.vercel.app/`

---

