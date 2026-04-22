"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ChatBox from "./components/ChatBox";
import FileUploader from "./components/FileUploader";
import { API_BASE_URL } from "./lib/api";

type DocMeta = {
  id: string;
  name: string;
};

export default function Home() {
  const [docId, setDocId] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const filteredDocs = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDocumentChange = (id: string, name: string) => {
    setDocId(id);
    setDocName(name);
    setDocs(prev => {
      if (prev.some(d => d.id === id)) return prev;
      return [...prev, { id, name }];
    });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleDeleteDocument = async (id: string) => {
    const target = docs.find(d => d.id === id);
    if (!target) return;
    if (typeof window !== "undefined") {
      const ok = window.confirm(`Delete "${target.name}" from your documents?`);
      if (!ok) return;
    }

    try {
      await axios.post(`${API_BASE_URL}/delete_document`, { doc_id: id });
    } catch {
    }

    setDocs(prev => prev.filter(d => d.id !== id));
    setDocId(prev => (prev === id ? null : prev));
    setDocName(prev => (prev === target.name ? null : prev));
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <main className="app-root">
      <div className="chat-shell">
        <header className="chat-header">
          <div>
            <h1 className="chat-title">IntelX</h1>
            <p className="chat-subtitle">A bright multimodal workspace for files, search, and video.</p>
          </div>
          <div className="chat-theme-toggle">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
            >
              <span suppressHydrationWarning>
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </span>
            </button>
          </div>
        </header>
        <section className="hero-banner">
          <div className="hero-copy">
            <p className="hero-kicker">Unified knowledge workspace</p>
            <h2 className="hero-title">Ask IntelX across documents, images, the web, and YouTube.</h2>
            <p className="hero-summary">
              Clean retrieval, richer previews, and a refreshed interface built around green,
              orange, and white.
            </p>
            <div className="hero-pills" aria-label="Core capabilities">
              <span className="hero-pill">Document RAG</span>
              <span className="hero-pill">Image uploads</span>
              <span className="hero-pill">Web search</span>
              <span className="hero-pill">YouTube indexing</span>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-label">Indexed docs</span>
              <strong className="hero-stat-value">{docs.length}</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Active source</span>
              <strong className="hero-stat-value">{docName ?? "None selected"}</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-label">Visual system</span>
              <strong className="hero-stat-value">Green / Orange / White</strong>
            </div>
          </div>
        </section>
        <section className="chat-content">
          <div className="doc-pane">
            <div className="doc-history">
            <div className="doc-history-header-row">
              <div className="doc-history-title">
                <span className="doc-panel-icon">📄</span>
                <span>Workspace library</span>
                <span className="doc-count-pill">{docs.length}</span>
              </div>
            </div>

            <div className="doc-panel-controls">
              <input
                className="doc-search-input"
                placeholder="Search the library..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <FileUploader
                onUploaded={handleDocumentChange}
                existingNames={docs.map(d => d.name)}
                activeDocName={docName}
              />
            </div>

            {docs.length > 0 && (
              <div className="doc-list-grid">
                {filteredDocs.map(d => (
                  <div
                    key={d.id}
                    className={
                      "doc-row" + (d.id === docId ? " doc-row-active" : "")
                    }
                  >
                    <button
                      type="button"
                      className="doc-row-main"
                      onClick={() => {
                        setDocId(d.id);
                        setDocName(d.name);
                      }}
                    >
                      <span className="doc-row-main-left">
                        <span
                          className={
                            "doc-radio" + (d.id === docId ? " doc-radio-active" : "")
                          }
                        />
                        <span className="doc-file-icon">📄</span>
                        <span className="doc-name">{d.name}</span>
                      </span>
                      {d.id === docId && <span className="doc-inuse-badge">In use</span>}
                    </button>
                    <button
                      type="button"
                      className="doc-row-delete"
                      onClick={() => handleDeleteDocument(d.id)}
                      aria-label="Delete document"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="doc-row-delete-icon"
                      >
                        <path
                          d="M8 4.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5V6h3v2H5V6h3V4.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M7 8h10l-.7 9.2A2 2 0 0 1 14.32 19H9.68A2 2 0 0 1 7.7 17.2L7 8Z"
                          fill="currentColor"
                        />
                        <rect x="10" y="10" width="1.6" height="6" rx="0.8" fill="#fef2f2" />
                        <rect x="12.4" y="10" width="1.6" height="6" rx="0.8" fill="#fef2f2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>

          <div className="chat-pane">
            <ChatBox
              docId={docId}
              docName={docName}
              onDocumentChange={handleDocumentChange}
              existingNames={docs.map(d => d.name)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
