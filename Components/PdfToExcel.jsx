import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download } from 'lucide-react';
import '../Styles/PdfToExcel.css';

const     PdfToExcel = () => {
  const [fileItem, setFileItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFileItem({
      file: f,
      id: Math.random().toString(36).slice(2, 9),
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    });
    setConvertedBlob(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 52428800,
  });

  const removeFile = () => {
    setFileItem(null);
    setConvertedBlob(null);
  };

  // Mock conversion: create a simple CSV text and return as blob (user can replace with real conversion)
  const convertPdfToExcel = async () => {
    if (!fileItem) return alert('Please upload a PDF first.');
    setBusy(true);
    try {
      // Placeholder: replace with real PDF->Excel conversion logic/server call
      const csvLines = [
        'Sheet1',
        `Converted from PDF: ${fileItem.name}`,
        'Column1,Column2,Column3',
        'ValueA,ValueB,ValueC',
      ];
      const csvContent = csvLines.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      setConvertedBlob(blob);
      alert('Conversion complete (mock). Click Download to save the file.');
    } catch (err) {
      console.error(err);
      alert('Conversion failed.');
    } finally {
      setBusy(false);
    }
  };

  const downloadExcel = () => {
    if (!convertedBlob) return alert('No converted file available.');
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    // use .xlsx extension for user convenience though content is CSV (replace with real .xlsx when available)
    const outName = fileItem ? `converted-${fileItem.name.replace(/\.pdf$/i, '')}.xlsx` : 'converted.xlsx';
    a.href = url;
    a.download = outName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="merge-pdf-container">
      <div className="merge-header"><h1>PDF to Excel</h1></div>
      <div className="merge-content">
        <div className="left-section">
          <div {...getRootProps()} className="select-pdf-dropbox">
            <input {...getInputProps()} />
            <Upload size={32} className="upload-icon" />
            <p className="dropbox-text">{isDragActive ? 'Drop PDF here...' : 'Select PDF'}</p>
            <p className="dropbox-hint">Drag & drop a PDF here, or click to select file</p>
          </div>

          <div className="selected-pdf-section">
            <h3 className="section-heading">Selected PDF</h3>
            <div className="a4-pdf-container">
              {fileItem ? (
                <div className="pdf-file-item">
                  <div className="file-info">
                    <span className="file-name">{fileItem.name}</span>
                    <span className="file-size">{fileItem.size}</span>
                  </div>
                  <div className="file-actions">
                    <button onClick={removeFile} className="remove-btn"><X size={16} /></button>
                  </div>
                </div>
              ) : (
                <div className="no-files"><p>No PDF file selected</p></div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="action-buttons">
            <button onClick={convertPdfToExcel} disabled={!fileItem || busy} className="merge-pdf-btn">
              {busy ? 'Converting...' : 'Convert to Excel'}
            </button>
            <button onClick={downloadExcel} disabled={!convertedBlob} className="download-merged-btn">
              <Download size={20} /> Download Excel
            </button>
          </div>
          <div style={{ marginTop: 12 }}>
            <p><strong>Note:</strong> This is a mock conversion. Replace convertPdfToExcel with real conversion/server call.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToExcel;