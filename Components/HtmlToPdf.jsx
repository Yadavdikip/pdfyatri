import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download } from 'lucide-react';
import '../Styles/HtmlToPdf.css';

function HtmlToPdf() {
  const [fileItem, setFileItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [status, setStatus] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFileItem({
      file: f,
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    });
    setPdfBlob(null);
    setStatus('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/html': ['.html'], 'text/plain': ['.txt'] },
    multiple: false,
    maxSize: 52428800,
  });

  const removeFile = () => {
    setFileItem(null);
    setPdfBlob(null);
    setStatus('');
  };

  const convertHtmlToPdf = async () => {
    if (!fileItem) return alert('Please upload an HTML file first.');
    setBusy(true);
    setStatus('Converting to PDF...');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const htmlContent = reader.result;
        // Mock PDF creation: replace with actual PDF generation logic
        const pdfContent = `PDF generated from: ${fileItem.name}\n\n${htmlContent}`;
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        setPdfBlob(blob);
        setStatus('Conversion complete. Click Download to save the PDF.');
      };
      reader.onerror = () => {
        setBusy(false);
        alert('Failed to read file.');
      };
      reader.readAsText(fileItem.file);
    } catch (err) {
      console.error(err);
      setStatus('Conversion failed.');
      alert('Conversion failed.');
    } finally {
      setBusy(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) return alert('No PDF available to download.');
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileItem ? `${fileItem.name.replace(/\.(html|txt)$/i, '')}.pdf` : 'converted.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-html-container">
      <div className="upload-header"><h1>Upload HTML to PDF</h1></div>

      <div className="upload-content">
        <div className="left-section">
          <div {...getRootProps()} className="select-html-dropbox">
            <input {...getInputProps()} />
            <Upload size={32} className="upload-icon" />
            <p className="dropbox-text">{isDragActive ? 'Drop HTML here...' : 'Select HTML or TXT'}</p>
            <p className="dropbox-hint">Drag & drop an HTML file here, or click to select file</p>
          </div>

          <div className="selected-file-section">
            <h3 className="section-heading">Selected File</h3>
            <div className="file-info">
              {fileItem ? (
                <div className="file-item">
                  <span className="file-name">{fileItem.name}</span>
                  <span className="file-size">{fileItem.size}</span>
                  <button onClick={removeFile} className="remove-btn"><X size={16} /></button>
                </div>
              ) : (
                <div className="no-files"><p>No file selected</p></div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="action-buttons">
            <button onClick={convertHtmlToPdf} disabled={!fileItem || busy} className="convert-btn">
              {busy ? 'Converting...' : 'Convert to PDF'}
            </button>
            <button onClick={downloadPdf} disabled={!pdfBlob} className="download-btn">
              <Download size={20} /> Download PDF
            </button>
          </div>

          {status && <div className="status-message">{status}</div>}
        </div>
      </div>
    </div>
  );
}

export default HtmlToPdf;