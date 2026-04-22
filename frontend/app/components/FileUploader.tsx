import axios from "axios";
import { useState, useRef } from "react";
import DocumentInspector from "./DocumentInspector";
import { API_BASE_URL } from "../lib/api";

type FileUploaderProps = {
  onUploaded?: (docId: string, fileName: string) => void;
  existingNames?: string[];
  activeDocName?: string | null;
};

type LocalDoc = {
  name: string;
  file: File;
  url: string;
};

export default function FileUploader({
  onUploaded,
  existingNames,
  activeDocName,
}: FileUploaderProps) {
  const [selectedDoc, setSelectedDoc] = useState<LocalDoc | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [localDocs, setLocalDocs] = useState<LocalDoc[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeLocalDoc = activeDocName
    ? localDocs.find(d => d.name === activeDocName) ?? null
    : null;
  const previewDoc = activeLocalDoc ?? selectedDoc;

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (existingNames && existingNames.includes(file.name)) {
      alert("This document has already been uploaded.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    const res = await axios.post(`${API_BASE_URL}/upload`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = res.data as { doc_id?: string; file_name?: string };
    if (data.doc_id && onUploaded) {
      onUploaded(data.doc_id, data.file_name ?? file.name);
    }
    alert("File uploaded and ingested.");

    const url = URL.createObjectURL(file);
    const doc = { name: file.name, file, url };
    setLocalDocs(prev => [...prev, doc]);
    setSelectedDoc(doc);
    setShowPreview(false);
  };

  const openNewUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div className="uploader">
      <div className="uploader-row">
        <label className="uploader-label">
          <span className="uploader-title">Upload to IntelX</span>
          <span className="uploader-help">PDFs and images up to a few MB.</span>
          <input
            ref={inputRef}
            type="file"
            onChange={upload}
            className="uploader-input"
          />
        </label>
        {selectedDoc && (
          <>
            <button type="button" className="uploader-secondary" onClick={openNewUpload}>
              Add another file
            </button>
            <button
              type="button"
              className="uploader-secondary"
              onClick={() => setShowPreview(p => !p)}
            >
              {showPreview ? "Hide preview" : "Preview file"}
            </button>
          </>
        )}
      </div>

      {selectedDoc && showPreview && previewDoc && (!activeDocName || activeLocalDoc) && (
        <div className="uploader-preview">
          <DocumentInspector file={previewDoc.file} previewUrl={previewDoc.url} />
        </div>
      )}
    </div>
  );
}