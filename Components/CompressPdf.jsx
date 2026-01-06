import React, { useState, useEffect } from 'react'
import { Download, Settings, Info, FileText } from 'lucide-react'
import { useFileConversion } from '../src/hooks/useFileConversion'
import FileUpload from './FileUpload'
import * as pdfjsLib from 'pdfjs-dist'
import { saveAs } from 'file-saver'
import '../Styles/CompressPdf.css'

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdfjs-dist/${pdfjsLib.version}/pdf.worker.min.js`

const CompressPdf = () => {
  const [files, setFiles] = useState([])
  const [pdfDocument, setPdfDocument] = useState(null)
  const [compressedPdf, setCompressedPdf] = useState(null)
  const [compressionSettings, setCompressionSettings] = useState({
    targetSize: '',
    unit: 'MB'
  })

  const { convert, isConverting } = useFileConversion()

  const handleFileUpload = async (uploadedFiles) => {
    setFiles(uploadedFiles)
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0]
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      setPdfDocument(pdf)
    } else {
      setPdfDocument(null)
    }
  }

  const handleConvert = async () => {
    if (files.length === 0) return

    try {
      const result = await convert(files, 'compress-pdf', compressionSettings)
      if (result.success) {
        // Simulate creating a compressed PDF blob
        const compressedBlob = new Blob([files[0]], { type: 'application/pdf' })
        setCompressedPdf(compressedBlob)
      }
    } catch (error) {
      console.error('Compression failed:', error)
    }
  }

  const handleDownload = () => {
    if (files.length > 0) {
      saveAs(files[0], files[0].name)
    }
  }

  const handleDownloadCompressed = () => {
    if (compressedPdf) {
      const fileName = files[0].name.replace(/\.pdf$/i, '-compressed.pdf')
      saveAs(compressedPdf, fileName)
    }
  }

  const acceptedFiles = {
    'application/pdf': ['.pdf']
  }

  const PdfViewer = ({ pdfDocument }) => {
    const [pages, setPages] = useState([])

    useEffect(() => {
      const renderPages = async () => {
        const pagePromises = []
        for (let i = 1; i <= pdfDocument.numPages; i++) {
          pagePromises.push(pdfDocument.getPage(i))
        }
        const pdfPages = await Promise.all(pagePromises)

        const renderedPages = await Promise.all(
          pdfPages.map(async (page) => {
            const viewport = page.getViewport({ scale: 1 })
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')

            // A4 size at 72 DPI: 595x842 pixels
            const a4Width = 595
            const a4Height = 842
            const scale = a4Width / viewport.width
            const scaledViewport = page.getViewport({ scale })

            canvas.height = scaledViewport.height
            canvas.width = scaledViewport.width

            const renderContext = {
              canvasContext: context,
              viewport: scaledViewport
            }

            await page.render(renderContext).promise
            return canvas.toDataURL()
          })
        )
        setPages(renderedPages)
      }

      if (pdfDocument) {
        renderPages()
      }
    }, [pdfDocument])

    return (
      <div className="pdf-viewer">
        {pages.map((pageDataUrl, index) => (
          <img key={index} src={pageDataUrl} alt={`Page ${index + 1}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="tool-page">
      <div className="tool-header">
        <h1>Compress PDF</h1>
        <p>Reduce PDF file size while maintaining quality</p>
      </div>

      <div className="tool-container">
        <div className="right-section">
          <div className="upload-section">
            <FileUpload
              onFileUpload={handleFileUpload}
              acceptedFiles={acceptedFiles}
              multiple={false}
              maxFiles={1}
              maxSize={100000000} // 100MB
              uploadText="Drag & drop your PDF file here, or click to select"
              hintText="Compress a single PDF file"
              icon={FileText}
            />
          </div>

          <div className="preview-section">
            {pdfDocument ? (
              <>
                <div className="selected-pdf-info">
                  <p><strong>Selected PDF:</strong> {files[0]?.name}</p>
                </div>
                <PdfViewer pdfDocument={pdfDocument} />
              </>
            ) : (
              <div className="no-preview">
                <FileText size={48} />
                <p>Upload a PDF to preview</p>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>
              <Settings size={20} />
              Compression Settings
            </h3>
            <div className="settings-grid">
              <label className="setting-option">
                <span>Target Size:</span>
                <input
                  type="number"
                  value={compressionSettings.targetSize}
                  onChange={(e) => setCompressionSettings(prev => ({
                    ...prev,
                    targetSize: e.target.value
                  }))}
                  placeholder="Enter size"
                  min="0"
                />
                <select
                  value={compressionSettings.unit}
                  onChange={(e) => setCompressionSettings(prev => ({
                    ...prev,
                    unit: e.target.value
                  }))}
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
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
                  Compressing...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Compress PDF
                </>
              )}
            </button>
            {compressedPdf && (
              <button onClick={handleDownloadCompressed} className="download-btn">
                <Download size={20} />
                Download Compressed PDF
              </button>
            )}
          </div>

          <div className="info-section">
            <div className="info-card">
              <Info size={20} />
              <div>
                <h4>How to use PDF Compressor</h4>
                <ol>
                  <li>Upload your PDF file</li>
                  <li>Set target file size in KB or MB</li>
                  <li>Click "Compress PDF" button</li>
                  <li>Download your compressed PDF file</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompressPdf
