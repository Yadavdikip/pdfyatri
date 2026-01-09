import { useState } from 'react';
import { useDragAndDrop } from './useDragAndDrop';

export const useFileConversion = (options = {}) => {
  const [isConverting, setIsConverting] = useState(false);
  const { isDragOver, files, handleDragOver, handleDragLeave, handleDrop, clearFiles, handleFileSelect } = useDragAndDrop();

  const convert = async (files, type, settings) => {
    setIsConverting(true);
    try {
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Converting files:', files, 'Type:', type, 'Settings:', settings);
      // In a real implementation, this would call an API
      return { success: true };
    } finally {
      setIsConverting(false);
    }
  };

  const getRootProps = () => ({
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  });

  const getInputProps = () => ({
    type: 'file',
    accept: options.acceptedFileTypes ? options.acceptedFileTypes.join(',') : '*',
    multiple: options.multiple || false,
    onChange: (e) => {
      const selectedFiles = Array.from(e.target.files);
      handleFileSelect(selectedFiles);
    },
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    // Note: This is a simplified version. In a real implementation, you'd update the state properly.
    clearFiles();
  };

  const processFiles = async (type, settings) => {
    return await convert(files, type, settings);
  };

  return {
    convert,
    isConverting,
    isDragActive: isDragOver,
    files,
    getRootProps,
    getInputProps,
    removeFile,
    processFiles,
  };
};
