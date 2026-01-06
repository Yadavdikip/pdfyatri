
import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Crop, Download, Trash2, Edit3 } from 'lucide-react';
import '../Styles/PdfCrop.css';

const PdfCrop = ({ isDarkMode = false }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [croppedPdfUrl, setCroppedPdfUrl] = useState(null);
  const [cropParams, setCropParams] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [pageInfo, setPageInfo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
      setCroppedPdfUrl(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfUrl(URL.createObjectURL(file));
      setCroppedPdfUrl(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCropChange = (e) => {
    const { name, value } = e.target;
    setCropParams(prev => ({ ...prev, [name]: Number(value) }));
  };

  const cropPdf = async () => {
    if (!pdfFile) return;

    // Validate params
    if (cropParams.left < 0 || cropParams.left > 100 ||
        cropParams.right < 0 || cropParams.right > 100 ||
        cropParams.top < 0 || cropParams.top > 100 ||
        cropParams.bottom < 0 || cropParams.bottom > 100) {
      alert('Crop margins must be between 0% and 100%');
      return;
    }

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      let hasError = false;

      for (const page of pages) {
        const { width, height } = page.getSize();
        const leftPts = (cropParams.left / 100) * width;
        const rightPts = (cropParams.right / 100) * width;
        const topPts = (cropParams.top / 100) * height;
        const bottomPts = (cropParams.bottom / 100) * height;
        const cropWidth = width - leftPts - rightPts;
        const cropHeight = height - topPts - bottomPts;

        if (cropWidth <= 0 || cropHeight <= 0) {
          alert(`Invalid crop parameters: crop area too small for a page (width: ${Math.round(cropWidth)}pt, height: ${Math.round(cropHeight)}pt)`);
          hasError = true;
          break;
        }

        page.setCropBox(leftPts, bottomPts, cropWidth, cropHeight);
        page.setSize(cropWidth, cropHeight);
      }

      if (hasError) return;

      const croppedBytes = await pdfDoc.save();
      const croppedBlob = new Blob([croppedBytes], { type: 'application/pdf' });
      setCroppedPdfUrl(URL.createObjectURL(croppedBlob));
    } catch (error) {
      console.error(error);
      alert('Failed to crop PDF');
    }
  };

  const downloadPdf = () => {
    if (croppedPdfUrl) {
      const link = document.createElement('a');
      link.href = croppedPdfUrl;
      link.download = 'cropped-pdf.pdf';
      link.click();
    }
  };

  const resetFile = () => {
    setPdfFile(null);
    setPdfUrl(null);
    setCroppedPdfUrl(null);
    setPageInfo(null);
    setCropParams({ left: 0, right: 0, top: 0, bottom: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    let cancelled = false;
    const loadPageInfo = async () => {
      if (!pdfFile) {
        if (!cancelled) setPageInfo(null);
        return;
      }
      try {
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = pdfDoc.getPages();
        const [firstPage] = pages;
        const { width, height } = firstPage.getSize();
        if (!cancelled) {
          setPageInfo({
            width: Math.round(width),
            height: Math.round(height),
            pageCount: pages.length
          });
        }
      } catch (error) {
        console.error('Failed to load page info:', error);
        if (!cancelled) setPageInfo(null);
      }
    };
    loadPageInfo();
    return () => {
      cancelled = true;
    };
  }, [pdfFile]);

  return (
    <div className={`pdfcrop-editor-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {!pdfFile ? (
        <div className="upload-area" onDrop={handleDrop} onDragOver={handleDragOver}>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="file-input"
          />
          <div className="upload-content">
            <Edit3 size={48} />
            <p>Drag and drop your PDF file here or click to browse</p>
            <p className="upload-hint">Crop PDF pages easily</p>
          </div>
        </div>
      ) : (
        <div className="editor-container">
          <div className="toolbar">
            <div className="crop-controls">
              <label>Left (%): <input type="number" name="left" value={cropParams.left} onChange={handleCropChange} min="0" max="100" step="0.5" /></label>
              <label>Right (%): <input type="number" name="right" value={cropParams.right} onChange={handleCropChange} min="0" max="100" step="0.5" /></label>
              <label>Top (%): <input type="number" name="top" value={cropParams.top} onChange={handleCropChange} min="0" max="100" step="0.5" /></label>
              <label>Bottom (%): <input type="number" name="bottom" value={cropParams.bottom} onChange={handleCropChange} min="0" max="100" step="0.5" /></label>
              {pageInfo && (
                <p className="page-info">
                  Reference size: {pageInfo.width} × {pageInfo.height} pt ({pageInfo.pageCount} page{pageInfo.pageCount > 1 ? 's' : ''})
                </p>
              )}
              <button className="crop-btn" onClick={cropPdf}><Crop size={20} /> Crop PDF</button>
            </div>
            <div className="action-buttons">
              <button className="download-button" onClick={downloadPdf} disabled={!croppedPdfUrl}>
                <Download size={20} />
                <span>Download</span>
              </button>
              <button className="reset-button" onClick={resetFile}>
                <Trash2 size={20} />
                <span>Reset</span>
              </button>
            </div>
          </div>
          <div className="editor-main">
            <div className="pdf-preview">
              {croppedPdfUrl ? (
                <iframe src={croppedPdfUrl} className="pdf-viewer" title="Cropped PDF preview" />
              ) : (
                <iframe src={pdfUrl} className="pdf-viewer" title="PDF preview" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfCrop;
