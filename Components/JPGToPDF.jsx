import React, { useState } from 'react'

import { Download, Settings, Info, Image } from 'lucide-react'
import { useFileConversion } from '../src/hooks/useFileConversion'
import FileUpload from './FileUpload'
import '../Styles/JpgToPdf.css'


const JpgToPdf = () => {
  const [files, setFiles] = useState([])
  const [conversionSettings, setConversionSettings] = useState({
    imageQuality: 'high',
    pageSize: 'a4',
    orientation: 'portrait'
  })
  const [converted, setConverted] = useState(false)

  const { convert, isConverting } = useFileConversion()

  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles)
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    try {
      await convert(files, 'jpg-to-pdf', conversionSettings)
      setConverted(true)
    } catch (error) {
      console.error('Conversion failed:', error)
    }
  }

  const handleDownload = () => {
    // Simulate download - in a real app, this would download the actual PDF
    const blob = new Blob(['Converted PDF content'], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const acceptedFiles = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>JPG to PDF</h1>
        <p>Convert your images to PDF documents with customizable settings</p>
      </div>

      <div className="tool-container">
        <div className="upload-section">
          <FileUpload
            onFileUpload={handleFileUpload}
            acceptedFiles={acceptedFiles}
            multiple={true}
            maxFiles={20}
            maxSize={50000000} // 50MB
            uploadText="Drag & drop your image files here, or click to select"
            hintText="Convert multiple images to a single PDF"
            icon={Image}
          />
        </div>

        <div className="settings-section">
          <h3>
            <Settings size={20} />
            Conversion Settings
          </h3>
          <div className="settings-grid">
            <label className="setting-option">
              <span>Image Quality:</span>
              <select
                value={conversionSettings.imageQuality}
                onChange={(e) => setConversionSettings(prev => ({
                  ...prev,
                  imageQuality: e.target.value
                }))}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label className="setting-option">
              <span>Page Size:</span>
              <select
                value={conversionSettings.pageSize}
                onChange={(e) => setConversionSettings(prev => ({
                  ...prev,
                  pageSize: e.target.value
                }))}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </label>
            <label className="setting-option">
              <span>Orientation:</span>
              <select
                value={conversionSettings.orientation}
                onChange={(e) => setConversionSettings(prev => ({
                  ...prev,
                  orientation: e.target.value
                }))}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </label>
          </div>
        </div>

        <div className="action-section">
          <button
            onClick={handleConvert}
            disabled={isConverting || files.length === 0}
            className={`convert-btn ${isConverting ? 'converting' : ''}`}
          >
            {isConverting ? (
              <>
                <div className="spinner"></div>
                Converting...
              </>
            ) : (
              <>
                <Download size={20} />
                Convert to PDF
              </>
            )}
          </button>
          {converted && (
            <button
              onClick={handleDownload}
              className="download-btn"
            >
              <Download size={20} />
              Download PDF
            </button>
          )}
        </div>

        <div className="info-section">
          <div className="info-card">
            <Info size={20} />
            <div>
              <h4>How to use JPG to PDF Converter</h4>
              <ol>
                <li>Upload one or multiple image files</li>
                <li>Adjust conversion settings as needed</li>
                <li>Click "Convert to PDF" button</li>
                <li>Download your combined PDF file</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JpgToPdf;
