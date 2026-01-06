import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  controls: {
    margin: '10px 0',
    display: 'flex',
    gap: '10px',
  },
  viewer: {
    border: '1px solid #ccc',
    margin: '20px 0',
  },
  page: {
    width: '100%',
    height: 'auto',
  },
  summary: {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
  },
  ad: {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#ffeb3b',
    textAlign: 'center',
  },
};

export default function ThreeDARPDF() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1.1);
  const [rotate, setRotate] = useState(0);
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState("");
  const [password, setPassword] = useState("");
  const [premium, setPremium] = useState(false);

  /* 🧠 AI-LIKE SUMMARY (NO API) */
  const generateSummary = async () => {
    const text =
      "This PDF contains multiple pages with structured content. " +
      "Main topics are highlighted and summarized automatically.";
    setSummary(text);
  };

  /* 🔐 PASSWORD LOCK */
  const lockPDF = async () => {
    const pdf = await PDFDocument.load(await file.arrayBuffer());
    pdf.encrypt({ userPassword: password });
    const bytes = await pdf.save();
    download(bytes, "locked.pdf");
  };

  const download = (bytes, name) => {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  };

  /* ☁️ LOCAL STORAGE (FAKE CLOUD) */
  useEffect(() => {
    if (file) localStorage.setItem("pdf", file.name);
  }, [file]);

  return (
    <div style={styles.app}>
      <h2>📘 Advanced PDF Tool</h2>

      {/* MONETIZATION */}
      <button onClick={() => setPremium(!premium)}>
        {premium ? "⭐ Premium User" : "Upgrade to Premium ₹199"}
      </button>

      {!premium && <div style={styles.ad}>📢 AD BANNER</div>}

      {/* UPLOAD */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {file && (
        <>
          {/* CONTROLS */}
          <div style={styles.controls}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))}>⬅</button>
            <button onClick={() => setPage(p => Math.min(p + 1, pages))}>➡</button>
            <button onClick={() => setZoom(z => z + 0.1)}>➕</button>
            <button onClick={() => setZoom(z => Math.max(1, z - 0.1))}>➖</button>
            <button onClick={() => setRotate(r => r + 90)}>🔄</button>
          </div>

          {/* SEARCH */}
          <input
            placeholder="Search text..."
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 3D PDF VIEW */}
          <motion.div
            whileHover={{ rotateY: 10, rotateX: -5 }}
            style={styles.viewer}
          >
            <Document
              file={file}
              onLoadSuccess={({ numPages }) => setPages(numPages)}
            >
              <Page
                pageNumber={page}
                scale={zoom}
                rotate={rotate}
                customTextRenderer={({ str }) =>
                  search && str.includes(search)
                    ? `🔍${str}`
                    : str
                }
              />
            </Document>
          </motion.div>

          {/* 📖 BOOK FLIP */}
          <h3>📖 Book Mode</h3>
          <HTMLFlipBook width={350} height={500}>
            {Array.from(new Array(pages), (_, i) => (
              <div key={i} style={styles.page}>
                <Document file={file}>
                  <Page pageNumber={i + 1} />
                </Document>
              </div>
            ))}
          </HTMLFlipBook>

          {/* 🧠 AI SUMMARY */}
          {premium && (
            <>
              <button onClick={generateSummary}>🧠 Generate Summary</button>
              <div style={styles.summary}>{summary}</div>
            </>
          )}

          {/* 🔐 LOCK PDF */}
          {premium && (
            <>
              <input
                placeholder="Set PDF Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={lockPDF}>🔐 Lock PDF</button>
            </>
          )}
        </>
      )}
    </div>
  );
}