import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import '../Styles/RemovePage.css';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const RemovePdfPage = () => {
  const [fileItem, setFileItem] = useState(null);
  const [pagesInput, setPagesInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [resultBlob, setResultBlob] = useState(null);
  const [status, setStatus] = useState('');
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [pageThumbnails, setPageThumbnails] = useState([]);
  const fileInputRef = useRef(null);
  const dropboxRef = useRef(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFileItem({
      file: f,
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'selected'
    });
    setResultBlob(null);
    setStatus('');
    setPagesInput('');
    setSelectedPages(new Set());
    await generateThumbnails(f);
  }, []);

  const generateThumbnails = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const thumbnails = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        thumbnails.push({
          pageNum,
          dataUrl: canvas.toDataURL()
        });
      }

      setPageThumbnails(thumbnails);
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
  };

  const togglePageSelection = (pageNum) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageNum)) {
      newSelected.delete(pageNum);
    } else {
      newSelected.add(pageNum);
    }
    setSelectedPages(newSelected);
    // Update pagesInput to reflect selected pages
    setPagesInput(Array.from(newSelected).sort((a, b) => a - b).join(','));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 52428800,
  });

  const handleDriveClick = () => {
    alert('Google Drive integration would open here');
  };

  const handleDropboxClick = () => {
    dropboxRef.current?.click();
  };

  const parsePages = (input) => {
    if (!input) return [];
    const parts = input.split(',').map(p => p.trim()).filter(Boolean);
    const pages = new Set();
    for (const part of parts) {
      if (part.includes('-')) {
        const [startS, endS] = part.split('-').map(s => s.trim());
        const start = parseInt(startS, 10);
        const end = parseInt(endS, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) pages.add(i);
        }
      } else {
        const n = parseInt(part, 10);
        if (!isNaN(n)) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRemovePages = async () => {
    if (!fileItem) return alert('Please select a PDF file first.');
    const pagesToRemove = parsePages(pagesInput);
    if (pagesToRemove.length === 0) return alert('Enter pages to remove (e.g. 1,3-5).');

    // Validate page numbers
    const existingPdfBytes = await fileItem.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const totalPages = pdfDoc.getPageCount();
    const invalidPages = pagesToRemove.filter(page => page < 1 || page > totalPages);
    if (invalidPages.length > 0) {
      return alert(`Invalid page numbers: ${invalidPages.join(', ')}. Total pages: ${totalPages}`);
    }

    const pagesToKeep = Array.from({ length: totalPages }, (_, i) => i + 1).filter(page => !pagesToRemove.includes(page));
    if (pagesToKeep.length === 0) {
      return alert('Cannot remove all pages. At least one page must remain.');
    }

    setBusy(true);
    setStatus('Processing...');
    try {
      const newPdfDoc = await PDFDocument.create();
      for (const pageIndex of pagesToKeep) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex - 1]);
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultBlob(blob);
      setStatus(`Removed pages: ${pagesToRemove.join(', ')}`);
    } catch (err) {
      console.error('removePages error', err);
      setStatus('Failed to remove pages.');
      alert('Failed to remove pages.');
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return alert('No result available to download.');
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileItem ? `${fileItem.name.replace(/\.pdf$/i, '')}-removed.pdf` : 'result.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="remove-pages-container">

      <div className="main-content">
        {/* Left Side - PDF Selection and Preview */}
        <div className="left-section">
          {/* Select PDF Dropbox */}
          <div className="select-pdf-section">
            <div
              className="dropbox"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropbox-content">
                <span className="dropbox-icon">📄</span>
                <p>Select PDF</p>
                <p className="dropbox-hint">Click here or drag and drop PDF files</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => onDrop(e.target.files)}
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
              />
              <input
                type="file"
                ref={dropboxRef}
                onChange={(e) => onDrop(e.target.files)}
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
              />
            </div>

            {/* Drive and Dropbox Buttons */}
            <div className="cloud-buttons">
              <button className="cloud-btn drive-btn" onClick={handleDriveClick}>
                <span className="btn-icon">📁</span>
                Drive
              </button>
              <button className="cloud-btn dropbox-btn" onClick={handleDropboxClick}>
                <span className="btn-icon">☁️</span>
                DropBox
              </button>
            </div>
          </div>

          {/* Selected PDF Preview (A4 Size) */}
          <div className="selected-pdf-section">
            <h3>Selected PDF</h3>
            <div className="a4-preview">
              {fileItem ? (
                <div className="pdf-preview">
                  <div className="pdf-icon">
                    📄
                  </div>
                  <div className="pdf-info">
                    <h4>{fileItem.name}</h4>
                    <p>Size: {fileItem.size}</p>
                    <p className="pdf-status">
                      {resultBlob ? 'Pages Removed Successfully' : 'Ready for page removal'}
                    </p>
                    {status && (
                      <p className="status-message">{status}</p>
                    )}
                    {busy && (
                      <div className="processing-indicator">
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                        <p>Processing your PDF...</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="pdf-placeholder">📄</div>
                  <p>No PDF selected</p>
                  <p className="hint">A4 Size Preview Area</p>
                </div>
              )}
            </div>
          </div>

          {/* Page Thumbnails Section */}
          {pageThumbnails.length > 0 && (
            <div className="page-thumbnails-section">
              <h3>Click pages to select for removal</h3>
              <div className="thumbnails-grid">
                {pageThumbnails.map((thumb) => (
                  <div
                    key={thumb.pageNum}
                    className={`thumbnail-item ${selectedPages.has(thumb.pageNum) ? 'selected' : ''}`}
                    onClick={() => togglePageSelection(thumb.pageNum)}
                  >
                    <img src={thumb.dataUrl} alt={`Page ${thumb.pageNum}`} />
                    <div className="page-number">Page {thumb.pageNum}</div>
                    {selectedPages.has(thumb.pageNum) && (
                      <div className="selection-overlay">✖</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remove Pages Input Section */}
          <div className="remove-function-section">
            <h3>Remove Pages</h3>
            <div className="pages-input-section">
              <label>Pages to remove (e.g. 1,3-5):</label>
              <input
                type="text"
                className="pages-input"
                placeholder="1,3-5"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Function Buttons */}
        <div className="right-section">
          {/* Other Function Section */}
          <div className="other-function-section">
            <h3>other function</h3>
            <div className="function-buttons">
              <button className="func-btn quality-btn">
                <span className="btn-icon">⭐</span>
                Quality PDF
              </button>

              <button
                className="func-btn convert-btn"
                onClick={handleRemovePages}
                disabled={!fileItem || busy}
              >
                <span className="btn-icon">
                  {busy ? '🔄' : '✂️'}
                </span>
                {busy ? 'Removing...' : 'Remove Pages'}
              </button>

              <button
                className="func-btn download-btn"
                onClick={handleDownload}
                disabled={!resultBlob}
              >
                <span className="btn-icon">📥</span>
                Download PDF
              </button>
            </div>
          </div>

          {/* Download to Cloud Buttons */}
          <div className="download-cloud-buttons">
            <button
              className="cloud-download-btn drive-download"
              disabled={!resultBlob}
            >
              <span className="btn-icon">📁</span>
              Drive
            </button>
            <button
              className="cloud-download-btn dropbox-download"
              disabled={!resultBlob}
            >
              <span className="btn-icon">☁️</span>
              DropBox
            </button>
          </div>
        </div>
      </div>

      {/* Hints Section */}
      <div className="hints-section">
        <h3>Hints:</h3>
        <ul>
          <li>Select a PDF by clicking the dropbox or using cloud services (Drive/DropBox)</li>
          <li>Click on page thumbnails to select/deselect pages for removal</li>
          <li>Alternatively, enter pages to remove in the input field (e.g. 1,3-5 for pages 1,3,4,5)</li>
          <li>Click "Remove Pages" to process the PDF and remove specified pages</li>
          <li>Download the modified PDF or save directly to cloud services</li>
          <li>Use quality button to adjust PDF quality settings</li>
        </ul>
      </div>
    </div>
  );
};

export default RemovePdfPage;
