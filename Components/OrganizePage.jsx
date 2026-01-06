import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download, FileText, HardDrive, Cloud, ArrowRight, Settings, Grid, List, SortAsc, Filter } from 'lucide-react';
import '../Styles/OrganizePage.css';

const OrganizePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [organizeSettings, setOrganizeSettings] = useState({
    layout: 'grid',
    sortBy: 'name',
    filterType: 'all',
    groupBy: 'type'
  });

  // File upload function
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
        pages: Math.floor(Math.random() * 50) + 1,
        lastModified: new Date().toLocaleDateString()
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    maxSize: 52428800 // 50MB
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleGoogleDrive = () => {
    alert('Opening Google Drive...');
  };

  const handleDropbox = () => {
    alert('Opening Dropbox...');
  };

  const organizeFile = () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }
    
    console.log('Organizing file...', {
      fileName: selectedFile.name,
      settings: organizeSettings
    });
    
    alert(`Organizing ${selectedFile.name} with ${organizeSettings.layout} layout...`);
  };

  const downloadOrganized = () => {
    if (!selectedFile) return;
    alert('Downloading organized file...');
  };

  // Unique organize functions
  const organizeFunctions = [
    {
      id: 1,
      name: 'Smart Sort',
      description: 'Automatically categorize content',
      icon: <SortAsc size={20} />,
      color: '#8e44ad'
    },
    {
      id: 2,
      name: 'Content Filter',
      description: 'Filter specific content types',
      icon: <Filter size={20} />,
      color: '#e74c3c'
    },
    {
      id: 3,
      name: 'Layout Optimizer',
      description: 'Optimize page layout',
      icon: <Grid size={20} />,
      color: '#3498db'
    },
    {
      id: 4,
      name: 'Metadata Editor',
      description: 'Edit file metadata',
      icon: <Settings size={20} />,
      color: '#f39c12'
    }
  ];

  return (
    <div className="organize-page-container">
      {/* Main Heading */}
      <div className="organize-header">
        <h1>Organize Page</h1>
      </div>

      <div className="organize-content">
        {/* Top Section - File Selection */}
        <div className="file-selection-section">
          {/* Select File Dropbox */}
          <div {...getRootProps()} className="select-file-dropbox">
            <input {...getInputProps()} />
            <Upload size={32} className="upload-icon" />
            <p className="dropbox-text">
              {isDragActive ? "Drop file here..." : "Select File"}
            </p>
            <p className="dropbox-hint">PDF, DOC, Excel, Images supported</p>
          </div>

          {/* Cloud Buttons */}
          <div className="cloud-buttons">
            <button onClick={handleGoogleDrive} className="cloud-btn save-btn">
              <HardDrive size={20} />
              <span>Save</span>
            </button>
            <button onClick={handleDropbox} className="cloud-btn dropbox-btn">
              <Cloud size={20} />
              <span>DropBox</span>
            </button>
          </div>
        </div>

        <div className="main-content">
          {/* Left Side - Selected File Preview */}
          <div className="left-section">
            <div className="selected-file-section">
              <h3 className="section-heading">Selected File</h3>
              
              <div className="file-preview-container">
                {selectedFile ? (
                  <div className="file-preview">
                    <div className="file-header">
                      <FileText size={24} className="file-icon" />
                      <div className="file-info">
                        <h4 className="file-name">{selectedFile.name}</h4>
                        <div className="file-details">
                          <span className="file-type">{selectedFile.type}</span>
                          <span className="file-size">{selectedFile.size}</span>
                          <span className="file-pages">{selectedFile.pages} pages</span>
                        </div>
                      </div>
                      <button onClick={removeFile} className="remove-btn">
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="file-content-preview">
                      <div className="file-metadata">
                        <div className="metadata-item">
                          <span className="metadata-label">Type:</span>
                          <span className="metadata-value">{selectedFile.type}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Size:</span>
                          <span className="metadata-value">{selectedFile.size}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Pages:</span>
                          <span className="metadata-value">{selectedFile.pages}</span>
                        </div>
                        <div className="metadata-item">
                          <span className="metadata-label">Modified:</span>
                          <span className="metadata-value">{selectedFile.lastModified}</span>
                        </div>
                      </div>
                      
                      <div className="organization-preview">
                        <h5>Organization Preview</h5>
                        <div className="preview-grid">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="preview-item">
                              <div className="item-icon">
                                {index % 3 === 0 ? '📄' : index % 3 === 1 ? '📊' : '🖼️'}
                              </div>
                              <div className="item-label">Item {index + 1}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-file-selected">
                    <FileText size={48} className="no-file-icon" />
                    <p>No file selected</p>
                    <span>Select a file to organize</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Organize Functions & Actions */}
          <div className="right-section">
            {/* Unique Organize Functions */}
            <div className="organize-functions">
              <h3 className="functions-heading">Other function</h3>
              
              <div className="functions-grid">
                {organizeFunctions.map((func) => (
                  <div key={func.id} className="function-card">
                    <div 
                      className="function-icon"
                      style={{ backgroundColor: func.color }}
                    >
                      {func.icon}
                    </div>
                    <div className="function-info">
                      <h4 className="function-name">{func.name}</h4>
                      <p className="function-desc">{func.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Context Settings */}
            <div className="context-settings">
              <h4 className="context-heading">Context</h4>
              
              <div className="setting-options">
                <div className="setting-group">
                  <label>Layout:</label>
                  <div className="option-buttons">
                    <button
                      className={`option-btn ${organizeSettings.layout === 'grid' ? 'active' : ''}`}
                      onClick={() => setOrganizeSettings({...organizeSettings, layout: 'grid'})}
                    >
                      <Grid size={16} />
                      Grid
                    </button>
                    <button
                      className={`option-btn ${organizeSettings.layout === 'list' ? 'active' : ''}`}
                      onClick={() => setOrganizeSettings({...organizeSettings, layout: 'list'})}
                    >
                      <List size={16} />
                      List
                    </button>
                  </div>
                </div>
                
                <div className="setting-group">
                  <label>Sort By:</label>
                  <select 
                    value={organizeSettings.sortBy}
                    onChange={(e) => setOrganizeSettings({...organizeSettings, sortBy: e.target.value})}
                    className="setting-select"
                  >
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="size">Size</option>
                    <option value="type">Type</option>
                  </select>
                </div>
                
                <div className="setting-group">
                  <label>Group By:</label>
                  <select 
                    value={organizeSettings.groupBy}
                    onChange={(e) => setOrganizeSettings({...organizeSettings, groupBy: e.target.value})}
                    className="setting-select"
                  >
                    <option value="type">File Type</option>
                    <option value="date">Date</option>
                    <option value="size">Size</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={organizeFile}
                disabled={!selectedFile}
                className="organize-btn"
              >
                <span>Organize →</span>
              </button>

              <button 
                onClick={downloadOrganized}
                disabled={!selectedFile}
                className="download-organized-btn"
              >
                <Download size={20} />
                <span>Download Organize</span>
              </button>
            </div>

            {/* Organization Stats */}
            {selectedFile && (
              <div className="organization-stats">
                <h4>Organization Summary</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Items to Organize:</span>
                    <span className="stat-value">{selectedFile.pages}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Estimated Time:</span>
                    <span className="stat-value">{Math.ceil(selectedFile.pages / 10)}s</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Layout:</span>
                    <span className="stat-value capitalize">{organizeSettings.layout}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sorting:</span>
                    <span className="stat-value capitalize">{organizeSettings.sortBy}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizePage;