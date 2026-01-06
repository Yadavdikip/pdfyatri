import React, { useState, useRef } from 'react';
import '../Styles/PdfToDoc.css';

const PdfToDoc = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [convertedDoc, setConvertedDoc] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSettings, setConversionSettings] = useState({
    format: 'docx',
    preserveLayout: true,
    includeImages: true,
    quality: 'high'
  });
  const fileInputRef = useRef(null);

  const handlePdfSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedPdf({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        pages: Math.ceil(file.size / 50000) // Mock page count
      });
      setConvertedDoc(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleConvertToDoc = () => {
    if (selectedPdf) {
      setIsConverting(true);
      
      // Simulate conversion process
      setTimeout(() => {
        setConvertedDoc({
          name: selectedPdf.name.replace('.pdf', `.${conversionSettings.format}`),
          originalName: selectedPdf.name,
          format: conversionSettings.format,
          convertedAt: new Date().toLocaleString(),
          size: Math.round(selectedPdf.size * 0.8) // Mock smaller size
        });
        setIsConverting(false);
        alert(`PDF converted to ${conversionSettings.format.toUpperCase()} successfully!`);
      }, 2000);
    } else {
      alert('Please select a PDF file first');
    }
  };

  const handleDownload = () => {
    if (convertedDoc) {
      alert(`Downloading: ${convertedDoc.name}`);
      // Actual download logic would go here
    } else {
      alert('No converted document available for download');
    }
  };

  const handleDriveUpload = () => {
    if (convertedDoc) {
      alert(`Uploading to Google Drive: ${convertedDoc.name}`);
    } else {
      alert('No converted document available to upload');
    }
  };

  const handleDropboxUpload = () => {
    if (convertedDoc) {
      alert(`Uploading to Dropbox: ${convertedDoc.name}`);
    } else {
      alert('No converted document available to upload');
    }
  };

  const handleFormatChange = (format) => {
    setConversionSettings(prev => ({ ...prev, format }));
  };

  const handleSettingChange = (setting, value) => {
    setConversionSettings(prev => ({ ...prev, [setting]: value }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="pdf-to-doc-container">
   

      <div className="main-content">
        {/* Left Section - Upload and Settings */}
        <div className="left-section">
          {/* Upload Section */}
          <div className="upload-section">
            <div 
              className="dropbox"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropbox-content">
                <span className="dropbox-icon">📤</span>
                <p>Select PDF File</p>
                <p className="dropbox-hint">Click to upload or drag & drop</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePdfSelect}
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
              />
            </div>

            <div className="cloud-buttons">
              <button className="cloud-btn drive-btn">
                <span className="btn-icon">📁</span>
                From Drive
              </button>
              <button className="cloud-btn dropbox-btn">
                <span className="btn-icon">☁️</span>
                From Dropbox
              </button>
            </div>
          </div>

          {/* File Preview */}
          <div className="file-preview-section">
            <h3>PDF Preview</h3>
            <div className="preview-box">
              {selectedPdf ? (
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <h4>{selectedPdf.name}</h4>
                    <p><strong>Size:</strong> {formatFileSize(selectedPdf.size)}</p>
                    <p><strong>Pages:</strong> {selectedPdf.pages}</p>
                    <p><strong>Status:</strong> Ready for conversion</p>
                  </div>
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="placeholder-icon">📄</div>
                  <p>No PDF selected</p>
                  <p className="hint">Upload a PDF file to convert</p>
                </div>
              )}
            </div>
          </div>

          {/* Conversion Settings */}
          <div className="settings-section">
            <h3>Conversion Settings</h3>
            <div className="settings-grid">
              <div className="setting-group">
                <label>Output Format</label>
                <div className="format-buttons">
                  <button 
                    className={`format-btn ${conversionSettings.format === 'docx' ? 'active' : ''}`}
                    onClick={() => handleFormatChange('docx')}
                  >
                    DOCX
                  </button>
                  <button 
                    className={`format-btn ${conversionSettings.format === 'doc' ? 'active' : ''}`}
                    onClick={() => handleFormatChange('doc')}
                  >
                    DOC
                  </button>
                  <button 
                    className={`format-btn ${conversionSettings.format === 'rtf' ? 'active' : ''}`}
                    onClick={() => handleFormatChange('rtf')}
                  >
                    RTF
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <label>Conversion Quality</label>
                <select 
                  value={conversionSettings.quality}
                  onChange={(e) => handleSettingChange('quality', e.target.value)}
                >
                  <option value="high">High Quality</option>
                  <option value="medium">Medium Quality</option>
                  <option value="low">Fast Conversion</option>
                </select>
              </div>

              <div className="setting-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={conversionSettings.preserveLayout}
                    onChange={(e) => handleSettingChange('preserveLayout', e.target.checked)}
                  />
                  Preserve original layout
                </label>
              </div>

              <div className="setting-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={conversionSettings.includeImages}
                    onChange={(e) => handleSettingChange('includeImages', e.target.checked)}
                  />
                  Include images in conversion
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Conversion and Download */}
        <div className="right-section">
          {/* Conversion Status */}
          <div className="conversion-status">
            <h3>Conversion Status</h3>
            <div className="status-box">
              {isConverting ? (
                <div className="converting">
                  <div className="converting-icon">🔄</div>
                  <h4>Converting PDF...</h4>
                  <p>Please wait while we process your file</p>
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              ) : convertedDoc ? (
                <div className="converted">
                  <div className="success-icon">✅</div>
                  <h4>Conversion Complete!</h4>
                  <div className="conversion-details">
                    <p><strong>Original:</strong> {convertedDoc.originalName}</p>
                    <p><strong>Converted:</strong> {convertedDoc.name}</p>
                    <p><strong>Format:</strong> {convertedDoc.format.toUpperCase()}</p>
                    <p><strong>Time:</strong> {convertedDoc.convertedAt}</p>
                  </div>
                </div>
              ) : (
                <div className="ready">
                  <div className="ready-icon">📝</div>
                  <h4>Ready for Conversion</h4>
                  <p>Upload a PDF file and click convert</p>
                </div>
              )}
            </div>
          </div>

          {/* Convert Button */}
          <button 
            className="convert-btn"
            onClick={handleConvertToDoc}
            disabled={!selectedPdf || isConverting}
          >
            <span className="btn-icon">
              {isConverting ? '⏳' : '🔄'}
            </span>
            {isConverting ? 'Converting...' : `Convert to ${conversionSettings.format.toUpperCase()}`}
          </button>

          {/* Download Section */}
          <div className="download-section">
            <button 
              className="download-btn"
              onClick={handleDownload}
              disabled={!convertedDoc}
            >
              <span className="btn-icon">📥</span>
              Download Document
            </button>
          </div>

          {/* Cloud Save Options */}
          <div className="cloud-save-section">
            <h4>Save to Cloud</h4>
            <div className="cloud-save-buttons">
              <button 
                className="cloud-save-btn drive-save"
                onClick={handleDriveUpload}
                disabled={!convertedDoc}
              >
                <span className="btn-icon">📁</span>
                Save to Drive
              </button>
              <button 
                className="cloud-save-btn dropbox-save"
                onClick={handleDropboxUpload}
                disabled={!convertedDoc}
              >
                <span className="btn-icon">☁️</span>
                Save to Dropbox
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="features-box">
            <h4>✨ Conversion Features</h4>
            <ul>
              <li>✅ Preserve text formatting</li>
              <li>✅ Maintain page layout</li>
              <li>✅ Convert images and tables</li>
              <li>✅ Support for multiple formats</li>
              <li>✅ High accuracy OCR</li>
              <li>✅ Fast processing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="supported-formats">
        <h3>Supported Output Formats</h3>
        <div className="formats-grid">
          <div className="format-card">
            <div className="format-icon">📄</div>
            <h4>DOCX</h4>
            <p>Microsoft Word (Modern)</p>
            <span className="format-badge">Recommended</span>
          </div>
          <div className="format-card">
            <div className="format-icon">📄</div>
            <h4>DOC</h4>
            <p>Microsoft Word (Legacy)</p>
          </div>
          <div className="format-card">
            <div className="format-icon">📋</div>
            <h4>RTF</h4>
            <p>Rich Text Format</p>
          </div>
          <div className="format-card">
            <div className="format-icon">📝</div>
            <h4>TXT</h4>
            <p>Plain Text</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToDoc;