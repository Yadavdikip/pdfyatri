import React, { useRef } from 'react';
import { useDragAndDrop } from '../src/hooks/useDragAndDrop';

const FileUpload = ({
  onFileUpload,
  acceptedFiles,
  multiple = false,
  maxFiles = 1,
  maxSize = 10000000, // 10MB default
  uploadText = "Drag & drop files here, or click to select",
  hintText = "",
  icon: Icon
}) => {
  const fileInputRef = useRef(null);
  const { isDragOver, handleDragOver, handleDragLeave, handleDrop: hookHandleDrop } = useDragAndDrop();

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      // Check file type
      const isAccepted = Object.keys(acceptedFiles).some(type =>
        file.type === type || acceptedFiles[type].some(ext => file.name.toLowerCase().endsWith(ext))
      );
      // Check file size
      const isValidSize = file.size <= maxSize;
      return isAccepted && isValidSize;
    });

    if (validFiles.length > maxFiles) {
      validFiles.splice(maxFiles);
    }

    onFileUpload(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleDragLeave();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    handleFileSelect(files);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`file-upload ${isDragOver ? 'dragging' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={Object.values(acceptedFiles).flat().join(',')}
        multiple={multiple}
        style={{ display: 'none' }}
      />
      <div className="upload-content">
        {Icon && <Icon size={48} className="upload-icon" />}
        <p className="upload-text">{uploadText}</p>
        {hintText && <p className="hint-text">{hintText}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
