import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download } from 'lucide-react';
import '../Styles/ImageCrop.css';

const ImageCrop = () => {
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  const [fileItem, setFileItem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [selRect, setSelRect] = useState(null); // {x,y,w,h}
  const [quality, setQuality] = useState(0.92);

  useEffect(() => {
    // draw image to canvas when imageSrc changes
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // ensure mousemove/up are captured even when cursor leaves the canvas
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => handleMouseMove(e);
    const onUp = () => handleMouseUp();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    setFileItem({
      file: f,
      id: Math.random().toString(36).slice(2, 9),
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
    });
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(f);
    setCroppedDataUrl(null);
    setSelRect(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxSize: 52428800,
  });

  const removeFile = () => {
    setFileItem(null);
    setImageSrc(null);
    setCroppedDataUrl(null);
    setSelRect(null);
  };

  const clientPosToImagePos = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.round((clientX - rect.left) * scaleX);
    const y = Math.round((clientY - rect.top) * scaleY);
    return { x, y };
  };

  const handleMouseDown = (e) => {
    if (!imageSrc) return;
    const pos = clientPosToImagePos(e.clientX, e.clientY);
    setStartPos(pos);
    setIsDragging(true);
    setSelRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !startPos) return;
    const pos = clientPosToImagePos(e.clientX, e.clientY);
    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);
    const w = Math.abs(pos.x - startPos.x);
    const h = Math.abs(pos.y - startPos.y);
    setSelRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPos(null);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!selRect || !canvas) return alert('Please select an area to crop');
    const ctx = canvas.getContext('2d');
    const temp = document.createElement('canvas');
    temp.width = selRect.w;
    temp.height = selRect.h;
    const tctx = temp.getContext('2d');
    tctx.drawImage(canvas, selRect.x, selRect.y, selRect.w, selRect.h, 0, 0, selRect.w, selRect.h);
    const dataUrl = temp.toDataURL('image/png');
    setCroppedDataUrl(dataUrl);
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const a = document.createElement('a');
    if (croppedDataUrl) {
      a.href = croppedDataUrl;
      a.download = 'cropped.png';
    } else {
      a.href = imageSrc;
      a.download = 'original.png';
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="image-cropper-container">
      <div className="crop-header"><h1>Image Crop</h1></div>
      <div className="crop-content">
        <div className="left-section">
          <div {...getRootProps()} className="select-image-dropbox">
            <input {...getInputProps()} />
            <Upload size={32} className="upload-icon" />
            <p className="dropbox-text">{isDragActive ? 'Drop image here...' : 'Select Image'}</p>
            <p className="dropbox-hint">Drag & drop an image here, or click to select file</p>
          </div>

          <div className="selected-image-section">
            <h3 className="section-heading">Selected Image</h3>
            <div className="a4-image-container">
              {fileItem ? (
                <div className="image-file-item">
                  <div className="file-info">
                    <span className="file-name">{fileItem.name}</span>
                    <span className="file-size">{fileItem.size}</span>
                  </div>
                  <div className="file-actions">
                    <button onClick={removeFile} className="remove-btn"><X size={16} /></button>
                  </div>
                </div>
              ) : (
                <div className="no-files"><p>No image file selected</p></div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="crop-area" style={{ display: 'flex', gap: 16 }}>
            <div style={{ position: 'relative', border: '1px solid #ddd' }}>
              <canvas
                ref={canvasRef}
                style={{ maxWidth: 720, maxHeight: 540, display: imageSrc ? 'block' : 'none', cursor: 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              {!imageSrc && (
                <div style={{ width: 360, height: 270, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ color: '#666' }}>No image selected</div>
                </div>
              )}
              {/* selection overlay (drawn via CSS using absolute div) */}
              {selRect && canvasRef.current && (() => {
                const canvas = canvasRef.current;
                const left = (selRect.x / canvas.width) * 100;
                const top = (selRect.y / canvas.height) * 100;
                const right = ((selRect.x + selRect.w) / canvas.width) * 100;
                const bottom = ((selRect.y + selRect.h) / canvas.height) * 100;
                const width = (selRect.w / canvas.width) * 100;
                const height = (selRect.h / canvas.height) * 100;
                return (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.45)',
                        clipPath: `polygon(0% 0%, 100% 0%, 100% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, 100% ${bottom}%, 100% 100%, 0% 100%, 0% ${bottom}%, ${left}% ${bottom}%, ${left}% ${top}%, 0% ${top}%)`,
                        pointerEvents: 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                        border: '2px dashed rgba(255,255,255,0.9)',
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    />
                  </>
                );
              })()}
            </div>

            <div style={{ minWidth: 260 }}>
              <div className="upload-controls" style={{ marginBottom: 16 }}>
                <div className="quality-box" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
                  <label>Quality (for JPEG only): </label>
                  <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
                </div>
              </div>

              <h4>Preview</h4>
              {croppedDataUrl ? (
                <div>
                  <img src={croppedDataUrl} alt="cropped" style={{ maxWidth: '100%' }} />
                </div>
              ) : (
                <div style={{ color: '#666' }}>No cropped image yet. Select area on the image and click Crop.</div>
              )}

              <div style={{ marginTop: 16 }}>
                <button className="btn" onClick={handleCrop} disabled={!selRect || busy}>Crop</button>
                <button className="btn" onClick={() => { setImageSrc(null); setCroppedDataUrl(null); setSelRect(null); }} style={{ marginLeft: 8 }}>Clear</button>
              </div>

              {imageSrc && (
                <div style={{ marginTop: 16 }}>
                  <button className="btn" onClick={handleDownload}><Download size={20} /> Download</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCrop;
