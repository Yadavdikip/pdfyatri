import React, { useState } from 'react';
import { useFileConversion } from '../src/hooks/useFileConversion';
import { Upload, Settings, Loader } from 'lucide-react';
import '../Styles/AddPageNumber.css';

const AddPageNumber = () => {
  const [pageSettings, setPageSettings] = useState({
    position: 'bottom-center',
    startNumber: 1,
    format: 'Page {n}',
    includeTotal: false,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { getRootProps, getInputProps, isDragActive, files, removeFile, processFiles } = useFileConversion({
    acceptedFileTypes: ['.pdf'],
    maxFiles: 1,
    maxSize: 10000000 // 10MB
  });

  const handlePageSettingsChange = (setting, value) => {
    setPageSettings(prev => ({
      ...prev,
      [setting]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const handleAddPageNumbers = async () => {
    try {
      if (files.length === 0) {
        setError('Please select a PDF file first');
        return;
      }
      setError(null);
      setIsProcessing(true);
      await processFiles(files[0], 'add-page-number', pageSettings);
    } catch (error) {
      console.error('Error adding page numbers:', error);
      setError('Failed to add page numbers. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-center', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];

  return (
    <div className="upload-container">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <Upload size={50} />
        <p>Drag & drop your PDF file here, or click to select</p>
        <p className="file-info">Maximum file size: 10MB</p>
      </div>

      {files.length > 0 && (
        <div className="settings-container">
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name}</span>
                <button onClick={() => removeFile(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="settings-section">
            <h3>
              <Settings size={20} className="icon" />
              Page Number Settings
            </h3>
            
            <div className="page-settings">
              <div className="setting-group">
                <label>Position:</label>
                <select 
                  value={pageSettings.position}
                  onChange={(e) => handlePageSettingsChange('position', e.target.value)}
                >
                  {positions.map(pos => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="setting-group">
                <label>Start Number:</label>
                <input 
                  type="number" 
                  min="1"
                  value={pageSettings.startNumber}
                  onChange={(e) => handlePageSettingsChange('startNumber', e.target.value)}
                />
              </div>

              <div className="setting-group">
                <label>Font Size (pt):</label>
                <input 
                  type="number" 
                  min="8"
                  max="72"
                  value={pageSettings.fontSize}
                  onChange={(e) => handlePageSettingsChange('fontSize', e.target.value)}
                />
              </div>

              <div className="setting-group">
                <label>Format:</label>
                <input 
                  type="text"
                  value={pageSettings.format}
                  placeholder="Page {n}"
                  onChange={(e) => handlePageSettingsChange('format', e.target.value)}
                />
                <small>Use {'{n}'} for page number, {'{t}'} for total pages</small>
              </div>

              <div className="setting-group margins">
                <label>Margins (pt):</label>
                <div className="margin-inputs">
                  <input 
                    type="number" 
                    min="0"
                    value={pageSettings.marginTop}
                    onChange={(e) => handlePageSettingsChange('marginTop', e.target.value)}
                    placeholder="Top"
                  />
                  <input 
                    type="number" 
                    min="0"
                    value={pageSettings.marginBottom}
                    onChange={(e) => handlePageSettingsChange('marginBottom', e.target.value)}
                    placeholder="Bottom"
                  />
                </div>
              </div>

              <div className="setting-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox"
                    checked={pageSettings.includeTotal}
                    onChange={(e) => handlePageSettingsChange('includeTotal', e.target.checked)}
                  />
                  Show total pages (e.g., "Page 1 of 10")
                </label>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button 
            onClick={handleAddPageNumbers} 
            className={`convert-btn ${isProcessing ? 'processing' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader className="spinner" size={20} />
                Processing...
              </>
            ) : (
              'Add Page Numbers'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddPageNumber;