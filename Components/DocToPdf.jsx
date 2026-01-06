import React, { useState, useRef } from 'react';
import { useFileConversion } from '../src/hooks/useFileConversion';
import '../Styles/DocToPdf.css';

const DocToPdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedPdf, setConvertedPdf] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { convert, isConverting: hookConverting } = useFileConversion({
    acceptedFileTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'application/rtf'],
    maxFiles: 1
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/rtf'
      ];
      
      if (allowedTypes.includes(file.type) || file.name.match(/\.(doc|docx|xls|xlsx|txt|rtf)$/i)) {
        setSelectedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        });
        setConvertedPdf(null);
      } else {
        alert('Please select a valid document file (DOC, DOCX, XLS, XLSX, TXT, RTF)');
      }
    }
  };

  const handleConvertToPdf = async () => {
    if (selectedFile) {
      setIsConverting(true);
      setError(null);
      try {
        await convert(selectedFile, 'doc-to-pdf');
        setConvertedPdf({
          name: selectedFile.name.replace(/\.[^/.]+$/, "") + '.pdf',
          originalName: selectedFile.name,
          convertedAt: new Date().toLocaleString()
        });
        alert('Document converted to PDF successfully!');
      } catch (err) {
        setError(err.message);
        alert(`Conversion failed: ${err.message}`);
      } finally {
        setIsConverting(false);
      }
    } else {
      alert('Please select a document file first');
    }
  };

  const handleDownload = () => {
    if (convertedPdf) {
      alert(`Downloading: ${convertedPdf.name}`);
      // Actual download logic would go here
    } else {
      alert('No converted PDF available for download');
    }
  };

  const handleDriveUpload = () => {
    if (convertedPdf) {
      alert(`Uploading to Google Drive: ${convertedPdf.name}`);
    } else {
      alert('No converted PDF available to upload');
    }
  };

  const handleDropboxUpload = () => {
    if (convertedPdf) {
      alert(`Uploading to Dropbox: ${convertedPdf.name}`);
    } else {
      alert('No converted PDF available to upload');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    if (fileName.match(/\.docx?$/i)) return '📄';
    if (fileName.match(/\.xlsx?$/i)) return '📊';
    if (fileName.match(/\.txt$/i)) return '📝';
    if (fileName.match(/\.rtf$/i)) return '📋';
    return '📄';
  };

  return (
    <div className="doc-to-pdf-container">
     
      <div className="main-content">
        <div className="left-section">
          <div className="upload-section">
            <div 
              className="dropbox"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropbox-content">
                <span className="dropbox-icon">📄</span>
                <p>Select Document File</p>
                <p className="dropbox-hint">DOC, DOCX, XLS, XLSX, TXT, RTF</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".doc,.docx,.xls,.xlsx,.txt,.rtf"
                style={{ display: 'none' }}
              />
            </div>

            <div className="cloud-buttons">
              <button className="cloud-btn drive-btn">
                <span className="btn-icon">📁</span>
                Google Drive
              </button>
              <button className="cloud-btn dropbox-btn">
                <span className="btn-icon">☁️</span>
                Dropbox
              </button>
            </div>
          </div>

          <div className="file-preview-section">
            <h3>Selected Document</h3>
            <div className="preview-box">
              {selectedFile ? (
                <div className="file-info">
                  <div className="file-icon">{getFileIcon(selectedFile.name)}</div>
                  <div className="file-details">
                    <h4>{selectedFile.name}</h4>
                    <p>Size: {formatFileSize(selectedFile.size)}</p>
                    <p>Type: {selectedFile.type || 'Document'}</p>
                    <div className={`status ${convertedPdf ? 'converted' : 'ready'}`}>
                      {convertedPdf ? '✅ Converted to PDF' : '📝 Ready for conversion'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="placeholder-icon">📄</div>
                  <p>No document selected</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="conversion-section">
            <button 
              className="convert-btn"
              onClick={handleConvertToPdf}
              disabled={!selectedFile || isConverting}
            >
              <span className="btn-icon">
                {isConverting ? '⏳' : '🔄'}
              </span>
              {isConverting ? 'Converting...' : 'Convert to PDF'}
            </button>
          </div>

          <div className="download-section">
            <button 
              className="download-btn"
              onClick={handleDownload}
              disabled={!convertedPdf}
            >
              <span className="btn-icon">📥</span>
              Download PDF
            </button>
          </div>

          <div className="cloud-upload-section">
            <div className="cloud-buttons-upload">
              <button 
                className="cloud-upload-btn drive-upload"
                onClick={handleDriveUpload}
                disabled={!convertedPdf}
              >
                <span className="btn-icon">📁</span>
                Save to Drive
              </button>
              <button 
                className="cloud-upload-btn dropbox-upload"
                onClick={handleDropboxUpload}
                disabled={!convertedPdf}
              >
                <span className="btn-icon">☁️</span>
                Save to Dropbox
              </button>
            </div>
          </div>

          {convertedPdf && (
            <div className="conversion-info">
              <h4>Conversion Details:</h4>
              <p><strong>Original:</strong> {convertedPdf.originalName}</p>
              <p><strong>Converted:</strong> {convertedPdf.name}</p>
              <p><strong>Time:</strong> {convertedPdf.convertedAt}</p>
            </div>
          )}
        </div>
      </div>

      <div className="supported-formats">
        <h3>Supported Formats:</h3>
        <div className="format-list">
          <div className="format-item">📄 DOC</div>
          <div className="format-item">📄 DOCX</div>
          <div className="format-item">📊 XLS</div>
          <div className="format-item">📊 XLSX</div>
          <div className="format-item">📝 TXT</div>
          <div className="format-item">📋 RTF</div>
        </div>
      </div>
    </div>
  );
};

export default DocToPdf;