import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import '../Styles/ScanToPdf.css';

const ScanToPdf = () => {
  const [scannedImages, setScannedImages] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const newImages = imageFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      setScannedImages(prev => [...prev, ...newImages]);
      setPdfGenerated(false);
    }
  };

  const handleScanClick = () => {
    setIsScanning(true);
    // Simulate scanning process by generating a real image using Canvas
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 800;

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some mock scanned content
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scanned Page', canvas.width / 2, canvas.height / 2 - 50);
      ctx.font = '16px Arial';
      ctx.fillText(`Page ${scannedImages.length + 1}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText('This is a simulated scanned document.', canvas.width / 2, canvas.height / 2 + 30);
      ctx.fillText('Generated for PDF testing.', canvas.width / 2, canvas.height / 2 + 60);

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

      const mockScannedImage = {
        id: Date.now(),
        name: `scan_${scannedImages.length + 1}.jpg`,
        url: dataUrl,
        type: 'image/jpeg'
      };
      setScannedImages(prev => [...prev, mockScannedImage]);
      setIsScanning(false);
      setPdfGenerated(false);
    }, 2000);
  };

  const handleGeneratePdf = async () => {
    if (scannedImages.length === 0) {
      alert('Please scan or upload some images first');
      return;
    }

    try {
      const pdfDoc = await PDFDocument.create();

      for (const image of scannedImages) {
        const response = await fetch(image.url);
        const imageBytes = await response.arrayBuffer();

        let pdfImage;
        if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (image.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // For other formats, try to embed as PNG
          pdfImage = await pdfDoc.embedPng(imageBytes);
        }

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        // Calculate dimensions to fit the image on the page while maintaining aspect ratio
        const imageAspectRatio = pdfImage.width / pdfImage.height;
        const pageAspectRatio = width / height;

        let drawWidth, drawHeight, x, y;

        if (imageAspectRatio > pageAspectRatio) {
          // Image is wider than page
          drawWidth = width;
          drawHeight = width / imageAspectRatio;
          x = 0;
          y = (height - drawHeight) / 2;
        } else {
          // Image is taller than page
          drawHeight = height;
          drawWidth = height * imageAspectRatio;
          x = (width - drawWidth) / 2;
          y = 0;
        }

        page.drawImage(pdfImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfBlob(blob);
      setPdfGenerated(true);
      alert('PDF generated successfully with ' + scannedImages.length + ' pages!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleDownloadPdf = () => {
    if (pdfGenerated && pdfBlob) {
      saveAs(pdfBlob, 'scanned_document.pdf');
    }
  };

  const handleRemoveImage = (id) => {
    setScannedImages(prev => prev.filter(img => img.id !== id));
    setPdfGenerated(false);
  };

  const handleReorder = (fromIndex, toIndex) => {
    const updatedImages = [...scannedImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setScannedImages(updatedImages);
    setPdfGenerated(false);
  };

  return (
    <div className="scan-to-pdf-container">
     

      <div className="main-content">
        {/* Left Section - Scanning Controls */}
        <div className="left-section">
          <div className="scan-controls">
            <div className="scan-option">
              <div 
                className="scan-box"
                onClick={handleScanClick}
                disabled={isScanning}
              >
                <div className="scan-icon">
                  {isScanning ? '📷' : '🖨️'}
                </div>
                <h3>{isScanning ? 'Scanning...' : 'Scan Document'}</h3>
                <p>Use your scanner or camera</p>
                {isScanning && (
                  <div className="scanning-animation">
                    <div className="scan-line"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-option">
              <div 
                className="upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon">📁</div>
                <h3>Upload Images</h3>
                <p>JPG, PNG, WebP</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="quick-actions">
              <button className="action-btn camera-btn">
                <span className="btn-icon">📷</span>
                Use Camera
              </button>
              <button className="action-btn multi-btn">
                <span className="btn-icon">🔄</span>
                Multi-Page
              </button>
            </div>
          </div>

          {/* Scan Settings */}
          <div className="scan-settings">
            <h3>Scan Settings</h3>
            <div className="settings-grid">
              <div className="setting">
                <label>Quality</label>
                <select defaultValue="high">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="setting">
                <label>Color Mode</label>
                <select defaultValue="color">
                  <option value="color">Color</option>
                  <option value="grayscale">Grayscale</option>
                  <option value="bw">Black & White</option>
                </select>
              </div>
              <div className="setting">
                <label>Page Size</label>
                <select defaultValue="a4">
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div className="setting">
                <label>Resolution</label>
                <select defaultValue="300">
                  <option value="150">150 DPI</option>
                  <option value="300">300 DPI</option>
                  <option value="600">600 DPI</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Preview and Actions */}
        <div className="right-section">
          {/* Scanned Pages Preview */}
          <div className="preview-section">
            <h3>Scanned Pages ({scannedImages.length})</h3>
            <div className="pages-preview">
              {scannedImages.length > 0 ? (
                <div className="pages-grid">
                  {scannedImages.map((image, index) => (
                    <div key={image.id} className="page-item">
                      <div className="page-number">{index + 1}</div>
                      <img src={image.url} alt={`Page ${index + 1}`} />
                      <div className="page-actions">
                        <button 
                          className="page-btn remove-btn"
                          onClick={() => handleRemoveImage(image.id)}
                        >
                          🗑️
                        </button>
                        {index > 0 && (
                          <button 
                            className="page-btn up-btn"
                            onClick={() => handleReorder(index, index - 1)}
                          >
                            ⬆️
                          </button>
                        )}
                        {index < scannedImages.length - 1 && (
                          <button 
                            className="page-btn down-btn"
                            onClick={() => handleReorder(index, index + 1)}
                          >
                            ⬇️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="empty-icon">📄</div>
                  <p>No scanned pages yet</p>
                  <p className="hint">Scan or upload images to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* PDF Actions */}
          <div className="pdf-actions">
            <button 
              className="generate-btn"
              onClick={handleGeneratePdf}
              disabled={scannedImages.length === 0}
            >
              <span className="btn-icon">⚡</span>
              Generate PDF
            </button>

            <button 
              className="download-btn"
              onClick={handleDownloadPdf}
              disabled={!pdfGenerated}
            >
              <span className="btn-icon">📥</span>
              Download PDF
            </button>

            <div className="cloud-buttons">
              <button 
                className="cloud-btn drive-btn"
                disabled={!pdfGenerated}
              >
                <span className="btn-icon">📁</span>
                Save to Drive
              </button>
              <button 
                className="cloud-btn dropbox-btn"
                disabled={!pdfGenerated}
              >
                <span className="btn-icon">☁️</span>
                Save to Dropbox
              </button>
            </div>
          </div>

          {/* PDF Info */}
          {pdfGenerated && (
            <div className="pdf-info">
              <h4>✅ PDF Ready!</h4>
              <div className="pdf-details">
                <p><strong>Pages:</strong> {scannedImages.length}</p>
                <p><strong>Size:</strong> A4 Portrait</p>
                <p><strong>Quality:</strong> High (300 DPI)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h3>Why Use Scan to PDF?</h3>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h4>High Quality</h4>
            <p>Professional 300 DPI scans</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h4>Fast Processing</h4>
            <p>Quick PDF generation</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <h4>Multi-Page</h4>
            <p>Combine multiple scans</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <h4>Secure</h4>
            <p>Your documents stay private</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanToPdf;