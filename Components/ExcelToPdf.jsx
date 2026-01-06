import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download } from 'lucide-react';
import '../Styles/ExcelToPdf.css';

const ExcelToPdf = () => {
  const [fileItem, setFileItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFileItem({
      file: f,
      id: Math.random().toString(36).slice(2, 9),
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    });
    setPdfBlob(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: false,
    maxSize: 52428800,
  });

  const removeFile = () => {
    setFileItem(null);
    setPdfBlob(null);
  };

  // Mock conversion: read CSV text if available, otherwise create placeholder content.
  const convertExcelToPdf = async () => {
    if (!fileItem) return alert('Please upload an Excel/CSV file first.');
    setBusy(true);
    try {
      const file = fileItem.file;
      const reader = new FileReader();

      const createPdfBlobFromText = (textContent) => {
        // Simple placeholder PDF-like blob containing text. Replace with real conversion server or library.
        const pdfText = [
          '%PDF-1.4',
          '%âãÏÓ',
          '1 0 obj<<>>endobj',
          'trailer<<>>',
          '%%EOF',
          `Converted from: ${file.name}`,
          '',
          textContent,
        ].join('\n\n');
        return new Blob([pdfText], { type: 'application/pdf' });
      };

      if (file.type === 'text/csv') {
        reader.onload = () => {
          const text = reader.result || '';
          const blob = createPdfBlobFromText(text);
          setPdfBlob(blob);
          alert('Conversion complete (mock). Click Download to save the PDF.');
          setBusy(false);
        };
        reader.onerror = () => {
          setBusy(false);
          alert('Failed to read file.');
        };
        reader.readAsText(file);
      } else {
        // For .xls/.xlsx just create placeholder summary (no real parsing here)
        reader.onload = () => {
          const placeholder = `This PDF was generated from ${file.name} (mock).\nFile size: ${fileItem.size}`;
          const blob = createPdfBlobFromText(placeholder);
          setPdfBlob(blob);
          alert('Conversion complete (mock). Click Download to save the PDF.');
          setBusy(false);
        };
        reader.onerror = () => {
          setBusy(false);
          alert('Failed to read file.');
        };
        // read as ArrayBuffer for binary Excel files (we don't parse it here)
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      console.error(err);
      setBusy(false);
      alert('Conversion failed.');
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return alert('No PDF available to download.');
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileItem ? `${fileItem.name.replace(/\.(xlsx|xls|csv)$/i, '')}.pdf` : 'converted.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="merge-pdf-container">
      <div className="merge-header"><h1>Excel to PDF</h1></div>
      <div className="merge-content">
        <div className="left-section">
          <div {...getRootProps()} className="select-pdf-dropbox">
            <input {...getInputProps()} />
            <Upload size={32} className="upload-icon" />
            <p className="dropbox-text">{isDragActive ? 'Drop Excel/CSV here...' : 'Select Excel or CSV'}</p>
            <p className="dropbox-hint">Drag & drop a file here, or click to select file</p>
          </div>

          <div className="selected-pdf-section">
            <h3 className="section-heading">Selected File</h3>
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
                <div className="no-files"><p>No file selected</p></div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="action-buttons">
            <button onClick={convertExcelToPdf} disabled={!fileItem || busy} className="merge-pdf-btn">
              {busy ? 'Converting...' : 'Convert to PDF'}
            </button>
            <button onClick={downloadPdf} disabled={!pdfBlob} className="download-merged-btn">
              <Download size={20} /> Download PDF
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <p><strong>Note:</strong> This is a mock client-side conversion. Replace convertExcelToPdf with a real conversion service or library (server-side conversion recommended) for production.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelToPdf;