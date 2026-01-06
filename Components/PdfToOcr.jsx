import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Download, X } from 'lucide-react'
import '../Styles/PdfToOcr.css'
import { useFileConversion } from '../src/hooks/useFileConversion'

const languages = [
    'English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese', 'Arabic'
]

const    PdfToOcr = () => {
    const [fileItem, setFileItem] = useState(null)
    const [language, setLanguage] = useState('English')
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
        maxSize: 50 * 1024 * 1024
    })

    const removeFile = () => setFileItem(null)

    const handleConvert = async () => {
        if (!fileItem) return alert('Please select a PDF first')
        try {
            await convert(fileItem.file, 'ocr', { language })
        } catch (err) {
            console.error(err)
            alert('OCR conversion failed')
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
        <div className="ocr-tool-page">
            <div className="ocr-header">
                <h1>PDF to OCR</h1>
                <p>Convert scanned PDFs into searchable text</p>
            </div>
            <div className="ocr-content">
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
                    <div className="language-section">
                        <label>Document Language</label>
                        <select
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="language-select"
                        >
                            {languages.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                    <div className="action-buttons">
                        <button className="btn btn-primary" onClick={handleConvert} disabled={!fileItem || isConverting}>
                            {isConverting ? 'Processing OCR...' : 'Convert (OCR)'}
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

export default   PdfToOcr
