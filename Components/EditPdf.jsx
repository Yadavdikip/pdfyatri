import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Download, Trash2, RotateCw, Edit3, Type } from 'lucide-react';
import FileUpload from './FileUpload';
import '../Styles/EditPdf.css';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const EditPdf = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState('text'); // text, watermark, rotate
  const [textContent, setTextContent] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPdfUrl(url);
      loadPdfDocument(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfFile]);

  useEffect(() => {
    if (pdfFile && currentPage <= numPages) {
      renderPage(currentPage);
    }
  }, [currentPage]);

  const loadPdfDocument = async (url) => {
    try {
      const pdfDoc = await pdfjsLib.getDocument(url).promise;
      setNumPages(pdfDoc.numPages);
      if (currentPage > pdfDoc.numPages) {
        setCurrentPage(pdfDoc.numPages);
      }
      renderPage(currentPage);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const renderPage = async (pageNum) => {
    if (!canvasRef.current || !pdfUrl) return;

    try {
      const pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };



  const handleCanvasClick = (e) => {
    if (editMode === 'text') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setTextPosition({ x, y });
    }
  };

  const addText = async () => {
    if (!pdfFile || !textContent) return;

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.getPage(currentPage - 1);
      const { width, height } = page.getSize();

      page.drawText(textContent, {
        x: ((textPosition.x / 1.5) / canvasRef.current.width) * width,
        y: height - (((textPosition.y / 1.5) / canvasRef.current.height) * height),
        size: 12,
        font: font,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      setPdfFile(modifiedPdfBlob);
      // Re-render will be handled by useEffect
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

  const addWatermark = async () => {
    if (!pdfFile || !textContent) return;

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        page.drawText(textContent, {
          x: width / 2 - 100,
          y: height / 2,
          size: 24,
          opacity: 0.3,
          rotate: Math.PI / 4, // 45 degrees
          font: font,
        });
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      setPdfFile(modifiedPdfBlob);
      // Re-render will be handled by useEffect
    } catch (error) {
      console.error('Error adding watermark:', error);
    }
  };

  const rotatePage = async () => {
    if (!pdfFile) return;

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const page = pdfDoc.getPage(currentPage - 1);

      page.setRotation(rotation);

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      setPdfFile(modifiedPdfBlob);
      // Re-render will be handled by useEffect
    } catch (error) {
      console.error('Error rotating page:', error);
    }
  };

  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'edited-pdf.pdf';
      link.click();
    }
  };

  const resetFile = () => {
    setPdfFile(null);
    setPdfUrl(null);
    setNumPages(0);
    setCurrentPage(1);
    setTextContent('');
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (files) => {
    if (Array.isArray(files) && files.length > 0) {
      setPdfFile(files[0]);
    } else if (files) {
      setPdfFile(files);
    }
  };

  return (
    <div className="file-upload-container">
      {!pdfFile ? (
        <FileUpload
          onFileUpload={handleFileSelect}
          acceptedFiles={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          maxFiles={1}
          maxSize={50000000} // 50MB
          uploadText="Drag & drop your PDF file here, or click to select"
          hintText="Upload a PDF to start editing"
          icon={Edit3}
        />
      ) : (
        <div className="editor-container">
          <div className="toolbar">
            <button 
              className={`tool-button ${editMode === 'text' ? 'active' : ''}`}
              onClick={() => setEditMode('text')}
            >
              <Type size={20} />
              <span>Add Text</span>
            </button>
            <button 
              className={`tool-button ${editMode === 'watermark' ? 'active' : ''}`}
              onClick={() => setEditMode('watermark')}
            >
              <Edit3 size={20} />
              <span>Watermark</span>
            </button>
            <button 
              className={`tool-button ${editMode === 'rotate' ? 'active' : ''}`}
              onClick={() => setEditMode('rotate')}
            >
              <RotateCw size={20} />
              <span>Rotate</span>
            </button>
          </div>

          <div className="editor-main">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="pdf-canvas"
            />

            <div className="editor-controls">
              {editMode === 'text' && (
                <div className="control-group">
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter text to add"
                  />
                  <button onClick={addText}>Add Text</button>
                </div>
              )}

              {editMode === 'watermark' && (
                <div className="control-group">
                  <input
                    type="text"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter watermark text"
                  />
                  <button onClick={addWatermark}>Add Watermark</button>
                </div>
              )}

              {editMode === 'rotate' && (
                <div className="control-group">
                  <select
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                  >
                    <option value="0">0°</option>
                    <option value="90">90°</option>
                    <option value="180">180°</option>
                    <option value="270">270°</option>
                  </select>
                  <button onClick={rotatePage}>Rotate Page</button>
                </div>
              )}
            </div>
          </div>

          <div className="page-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            <span>Page {currentPage} of {numPages}</span>
            <button
              disabled={currentPage === numPages}
              onClick={() => setCurrentPage(prev => Math.min(numPages, prev + 1))}
            >
              Next
            </button>
          </div>

          <div className="action-buttons">
            <button className="download-button" onClick={downloadPdf}>
              <Download size={20} />
              <span>Download</span>
            </button>
            <button className="reset-button" onClick={resetFile}>
              <Trash2 size={20} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPdf;
