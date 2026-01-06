import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download, FileText } from 'lucide-react';
import '../Styles/PdfToWord.css';

const PdfToWord = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'docx',
    preserveLayout: true,
    includeImages: true
  });

  // PDF file upload function
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPdfFile({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        pages: Math.floor(Math.random() * 20) + 1 // Mock page count
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 52428800 // 50MB
  });

  const removePdf = () => {
    setPdfFile(null);
  };

  const convertToWord = () => {
    if (!pdfFile) {
      alert('Please select a PDF file first');
      return;
    }
    
    // PDF to Word conversion logic
    console.log('Converting PDF to Word...', {
      fileName: pdfFile.name,
      settings: conversionSettings
    });
    
    // Simulate conversion process
    setTimeout(() => {
      alert('PDF successfully converted to Word document!');
    }, 1500);
  };

  const downloadWordFile = () => {
    if (!pdfFile) return;
    alert('Downloading Word document...');
    // Actual download logic would go here
  };

  return (
    <div className="pdf-to-word-container">
      {/* Main Heading */}
      <div className="converter-header">
        <h1>PDF to Word Converter</h1>
      </div>

      <div className="converter-content">
        {/* Left Side - PDF Selection & Preview */}
        <div className="left-section">
          {/* PDF Dropbox */}
          <div {...getRootProps()} className="pdf-dropbox">
            <input {...getInputProps()} />
            <Upload size={40} className="upload-icon" />
            <p className="dropbox-text">
              {isDragActive ? "Drop PDF here..." : "Select PDF File"}
            </p>
            <p className="dropbox-hint">Drag & drop PDF file, or click to select</p>
          </div>

          {/* Selected PDF Section */}
          <div className="selected-pdf-section">
            <h3 className="section-heading">Selected PDF</h3>
            
            {/* A4 Style Container */}
            <div className="a4-preview-container">
              {pdfFile ? (
                <div className="pdf-preview">
                  <div className="pdf-header">
                    <FileText size={24} className="file-icon" />
                    <div className="file-details">
                      <h4 className="file-name">{pdfFile.name}</h4>
                      <div className="file-meta">
                        <span className="file-size">{pdfFile.size}</span>
                        <span className="file-pages">{pdfFile.pages} pages</span>
                      </div>
                    </div>
                    <button onClick={removePdf} className="remove-pdf-btn">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="pdf-preview-content">
                    <div className="preview-pages">
                      {/* Mock PDF pages preview */}
                      {Array.from({ length: Math.min(pdfFile.pages, 3) }).map((_, index) => (
                        <div key={index} className="mock-page">
                          <div className="page-header">
                            <span>Page {index + 1}</span>
                          </div>
                          <div className="page-content">
                            <p>PDF content preview...</p>
                            <div className="mock-text">
                              <div className="text-line"></div>
                              <div className="text-line short"></div>
                              <div className="text-line"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {pdfFile.pages > 3 && (
                        <div className="more-pages">
                          + {pdfFile.pages - 3} more pages
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-pdf-selected">
                  <FileText size={48} className="no-file-icon" />
                  <p>No PDF file selected</p>
                  <span>Select a PDF file to convert to Word</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Conversion Actions */}
        <div className="right-section">
          <div className="conversion-actions">
            {/* Convert to Word Button */}
            <button 
              onClick={convertToWord}
              disabled={!pdfFile}
              className="convert-to-word-btn"
            >
              Convert to Word
            </button>

            {/* Download Word Button */}
            <button 
              onClick={downloadWordFile}
              disabled={!pdfFile}
              className="download-word-btn"
            >
              <Download size={20} />
              Download Word File
            </button>
          </div>

          {/* Conversion Settings */}
          <div className="conversion-settings">
            <h4>Conversion Settings</h4>
            <div className="setting-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={conversionSettings.preserveLayout}
                  onChange={(e) => setConversionSettings({
                    ...conversionSettings, 
                    preserveLayout: e.target.checked
                  })}
                />
                Preserve Layout
              </label>
            </div>
            <div className="setting-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={conversionSettings.includeImages}
                  onChange={(e) => setConversionSettings({
                    ...conversionSettings, 
                    includeImages: e.target.checked
                  })}
                />
                Include Images
              </label>
            </div>
            <div className="setting-group">
              <label>Output Format:</label>
              <select 
                value={conversionSettings.format}
                onChange={(e) => setConversionSettings({
                  ...conversionSettings, 
                  format: e.target.value
                })}
                className="format-select"
              >
                <option value="docx">DOCX (Word Document)</option>
                <option value="doc">DOC (Word 97-2003)</option>
                <option value="rtf">RTF (Rich Text Format)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToWord;