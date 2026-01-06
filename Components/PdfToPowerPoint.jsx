import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, X } from 'lucide-react'
import '../Styles/PdfToPowerPoint.css';
import { useFileConversion } from '../src/hooks/useFileConversion'

const    PdfToPowerPoint = () => {
  const [fileItem, setFileItem] = useState(null)
  const { convert, isConverting } = useFileConversion()

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return
    const f = acceptedFiles[0]
    setFileItem({ file: f, name: f.name, size: (f.size / 1024 / 1024).toFixed(2) + ' MB' })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 200 * 1024 * 1024
  })

  const removeFile = () => setFileItem(null)

  const handleConvert = async () => {
    if (!fileItem) return alert('Please select a PDF first')
    try {
      await convert(fileItem.file, 'pdf-to-powerpoint')
    } catch (err) {
      console.error(err)
      alert('Conversion failed')
    }
  }

  const downloadOriginal = () => {
    if (!fileItem) return
    const url = URL.createObjectURL(fileItem.file)
    const a = document.createElement('a')
    a.href = url
    a.download = fileItem.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="ppt-tool-page">
     

      <div className="ppt-content">
        <div className="left">
          <div {...getRootProps()} className={`select-pdf-dropbox ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <Upload size={48} className="upload-icon" />
            <p className="dropbox-text">{isDragActive ? 'Drop PDF here...' : 'Select PDF'}</p>
            <p className="dropbox-hint">Drag & drop a PDF here, or click to select file</p>
          </div>

          <div className="selected-file">
            {fileItem ? (
              <div className="file-header">
                <FileText size={48} className="file-icon" />
                <div>
                  <div className="file-name">{fileItem.name}</div>
                  <div className="file-size">{fileItem.size}</div>
                </div>
                <button className="remove-file" onClick={removeFile}><X size={16} /></button>
              </div>
            ) : (
              <div className="no-file">No PDF selected</div>
            )}
          </div>
        </div>

        <div className="right">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleConvert} disabled={!fileItem || isConverting}>
              {isConverting ? 'Converting...' : 'Convert to PPTX'}
            </button>
            <button className="btn btn-secondary" onClick={downloadOriginal} disabled={!fileItem}>
              <Download size={16} /> Download Original
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfToPowerPoint