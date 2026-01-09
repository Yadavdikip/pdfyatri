import { useState } from 'react';

export const useDragAndDrop = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (e.preventDefault) e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const handleFileSelect = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  return {
    isDragOver,
    files,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFiles,
    handleFileSelect,
  };
};
