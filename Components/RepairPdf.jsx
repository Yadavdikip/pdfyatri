import React, { useState, useRef } from 'react';
import { useFileConversion } from '../src/hooks/useFileConversion';
import '../Styles/RepairPdf.css';

const RepairPdf = () => {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [repairedPdf, setRepairedPdf] = useState(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const dropboxRef = useRef(null);
  const { convert, isConverting } = useFileConversion();

  const handlePdfSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedPdf({
        name: file.name,
        size: file.size,
        file: file,
        status: 'selected'
      });
      setRepairedPdf(null);
      setError(null);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleDriveClick = () => {
    alert('Google Drive integration would open here');
  };

  const handleDropboxClick = () => {
    dropboxRef.current?.click();
  };

  const handleRepairPdf = async () => {
    if (selectedPdf) {
      setIsRepairing(true);
      setError(null);
      try {
        await convert(selectedPdf.file, 'repair-pdf');
        setRepairedPdf({
          ...selectedPdf,
          status: 'repaired',
          repairedAt: new Date().toLocaleString()
        });
      } catch (err) {
        setError(err.message);
        alert(`Repair failed: ${err.message}`);
      } finally {
        setIsRepairing(false);
      }
    } else {
      alert('Please select a PDF file first');
    }
  };

  const handleDownload = () => {
    // The download is handled by the useFileConversion hook via file-saver
    if (!repairedPdf) {
      alert('No repaired PDF available for download');
    }
  };

  const handleSaveToDrive = () => {
    if (repairedPdf) {
      alert('Repaired PDF saved to Google Drive successfully!');
    } else {
      alert('No repaired PDF available to save');
    }
  };

  const handleSaveToDropbox = () => {
    if (repairedPdf) {
      alert('Repaired PDF saved to Dropbox successfully!');
    } else {
      alert('No repaired PDF available to save');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = () => {
    if (!selectedPdf) return '#6c757d';
    if (repairedPdf) return '#28a745';
    if (isRepairing) return '#ffc107';
    return '#17a2b8';
  };

  const getStatusText = () => {
    if (!selectedPdf) return 'No PDF selected';
    if (repairedPdf) return 'PDF Repaired Successfully';
    if (isRepairing) return 'Repairing PDF...';
    return 'Ready for Repair';
  };

  return (
    <div className="repair-pdf-container">
  
    

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
                onChange={handlePdfSelect}
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
              />
              <input
                type="file"
                ref={dropboxRef}
                onChange={handlePdfSelect}
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
                <span className="btn-icon">⏹️</span>
                Stopbox
              </button>
            </div>
          </div>

          {/* Selected PDF Preview (A4 Size) */}
          <div className="selected-pdf-section">
            <h3>Selected PDF</h3>
            <div className="a4-preview">
              {selectedPdf ? (
                <div className="pdf-preview">
                  <div className="pdf-icon">
                    {repairedPdf ? '✅' : isRepairing ? '🔄' : '📄'}
                  </div>
                  <div className="pdf-info">
                    <h4>{selectedPdf.name}</h4>
                    <p>Size: {formatFileSize(selectedPdf.size)}</p>
                    <div className="status-indicator" style={{ color: getStatusColor() }}>
                      {getStatusText()}
                    </div>
                    {repairedPdf && (
                      <p className="repair-time">
                        Repaired at: {repairedPdf.repairedAt}
                      </p>
                    )}
                    {isRepairing && (
                      <div className="repair-progress">
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
        </div>

        {/* Right Side - Function Buttons */}
        <div className="right-section">
          {/* Repair PDF Section */}
          <div className="repair-section">
            <h3>Repair PDF</h3>
            <button 
              className="func-btn repair-btn"
              onClick={handleRepairPdf}
              disabled={!selectedPdf || isRepairing}
            >
              <span className="btn-icon">
                {isRepairing ? '🔄' : '🔧'}
              </span>
              {isRepairing ? 'Repairing...' : 'Convert Repair PDF'}
            </button>
          </div>

          {/* Download Section */}
          <div className="download-section">
            <button 
              className="func-btn download-repair-btn"
              onClick={handleDownload}
              disabled={!repairedPdf}
            >
              <span className="btn-icon">📥</span>
              Download Repair
            </button>
          </div>

          {/* Cloud Save Buttons */}
          <div className="cloud-save-section">
            <h3>Save to Cloud</h3>
            <div className="cloud-save-buttons">
              <button 
                className="cloud-save-btn drive-save"
                onClick={handleSaveToDrive}
                disabled={!repairedPdf}
              >
                <span className="btn-icon">📁</span>
                Drive
              </button>
              <button 
                className="cloud-save-btn dropbox-save"
                onClick={handleSaveToDropbox}
                disabled={!repairedPdf}
              >
                <span className="btn-icon">⏹️</span>
                Your Dropbox
              </button>
            </div>
          </div>

          {/* Repair Info */}
          <div className="repair-info">
            <h4>What gets repaired:</h4>
            <ul>
              <li>✅ Corrupted PDF structure</li>
              <li>✅ Broken fonts and encoding</li>
              <li>✅ Damaged page elements</li>
              <li>✅ Missing metadata</li>
              <li>✅ Compression issues</li>
              <li>✅ Cross-reference tables</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hints Section */}
      <div className="hints-section">
        <h3>Hints:</h3>
        <ul>
          <li>Select a damaged or corrupted PDF file by clicking the dropbox or using cloud services</li>
          <li>Use "Convert Repair PDF" to fix common PDF issues and errors</li>
          <li>The repair process may take a few moments depending on file size</li>
          <li>Download the repaired PDF or save directly to cloud services</li>
          <li>Supported repairs: corrupted structure, broken fonts, damaged elements, metadata issues</li>
          <li>If repair fails, try with a different PDF file or check file permissions</li>
        </ul>
      </div>
    </div>
  );
};

export default RepairPdf;