import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import {
  FileText, Image, Merge, Download, FileDown, SplitSquareHorizontal,
  Trash2, LayoutGrid, Scan, FileSearch, Code, Presentation,
  FileCheck, Hash, Crop, Edit3, RotateCcw, Mic
} from 'lucide-react'
import '../../Styles/Home.css'


const Home = () => {
  const tools = [
    {
      path: '/pdf-to-word',
      name: 'PDF to Word',
      description: 'Convert PDF documents to editable Word files',
      icon: FileText,
      color: '#3B82F6'
    },
    {
      path: '/jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert images to PDF documents',
      icon: Image,
      color: '#10B981'
    },
    {
      path: '/merge-pdf',
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one',
      icon: Merge,
      color: '#8B5CF6'
    },
    {
      path: '/pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Extract tables from PDF to Excel spreadsheets',
      icon: FileText,
      color: '#059669'
    },
    {
      path: '/excel-to-pdf',
      name: 'Excel to PDF',
      description: 'Convert Excel files to PDF format',
      icon: Download,
      color: '#DC2626'
    },
    {
      path: '/compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce PDF file size without quality loss',
      icon: FileDown,
      color: '#F59E0B'
    },
    {
      path: '/split-pdf',
      name: 'Split PDF',
      description: 'Split PDF documents into multiple files',
      icon: SplitSquareHorizontal,
      color: '#EF4444'
    },
    {
      path: '/pdf-to-doc',
      name: 'PDF to DOC',
      description: 'Convert PDF to DOC format',
      icon: FileText,
      color: '#6366F1'
    },
    {
      path: '/doc-to-pdf',
      name: 'DOC to PDF',
      description: 'Convert Word documents to PDF',
      icon: Download,
      color: '#EC4899'
    },
    // New tools
    {
      path: '/pdf-remove-page',
      name: 'Remove Page',
      description: 'Remove specific pages from PDF documents',
      icon: Trash2,
      color: '#DC2626'
    },
    {
      path: '/organize-page',
      name: 'Organize Page',
      description: 'Rearrange and reorder PDF pages',
      icon: LayoutGrid,
      color: '#7C3AED'
    },
    {
      path: '/scan-to-pdf',
      name: 'Scan to PDF',
      description: 'Convert scanned documents to PDF',
      icon: Scan,
      color: '#059669'
    },
    {
      path: '/pdf-to-ocr',
      name: 'PDF to OCR',
      description: 'Convert scanned PDFs to searchable text',
      icon: FileSearch,
      color: '#f6f7faff'
    },
    {
      path: '/html-to-pdf',
      name: 'HTML to PDF',
      description: 'Convert HTML files to PDF documents',
      icon: Code,
      color: '#EA580C'
    },
    {
      path: '/pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      description: 'Convert PDF to editable presentations',
      icon: Presentation,
      color: '#C026D3'
    },
    {
      path: '/pdf-to-pdfa',
      name: 'PDF to PDF/A',
      description: 'Convert to archival PDF format',
      icon: FileCheck,
      color: '#0891B2'
    },
    {
      path: '/add-page-number',
      name: 'Add Page Number',
      description: 'Add page numbers to PDF documents',
      icon: Hash,
      color: '#475569'
    },
    {
      path: '/crop-pdf',
      name: 'Crop PDF',
      description: 'Trim and crop PDF pages',
      icon: Crop,
      color: '#65A30D'
    },
    {
      path: '/edit-pdf',
      name: 'Edit PDF',
      description: 'Basic PDF editing tools',
      icon: Edit3,
      color: '#9333EA'
    },
    {
      path: '/crop-image',
      name: 'Crop Image',
      description: 'Crop and resize images',
      icon: Image,
      color: '#E11D48'
    },
    {
      path: '/rotate-pdf',
      name: 'Rotate PDF',
      description: 'Rotate PDF pages clockwise or counterclockwise',
      icon: RotateCcw,
      color: '#FBBF24'
    },
    {
      path: '/ai-voice-editer',
      name: 'AI Voice Editor',
      description: 'Edit and enhance audio files with AI tools',
      icon: Mic,
      color: '#4F46E5'
    },
    {
      path: '/repair-pdf',
      name: 'Repair Pdf',
      description: 'Repair Pdf files',
      icon: RotateCcw,
      color: '#EF4444'
    },
    {
      path: '/three-d-ar-pdf',
      name: '3D Model Converter',
      description: 'Convert and optimize 3D model files',
      icon: FileText,
      color: '#14B8A6'
    }
  ]

  return (
    <div className="home">
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            All Your <span className="gradient-text">PDF Tools</span> in One Place
          </h1>
          <p className="hero-description">
            Convert, merge, compress, and manipulate PDF files with our powerful online tools. 
            Fast, secure, and completely free to use.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/pdf-to-word" className="btn btn-secondary">
              Try PDF to Word
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <div className="container">
          <h2 className="section-title">All PDF Tools</h2>
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <Link key={index} to={tool.path} className="tool-card">
                <div 
                  className="tool-icon" 
                  style={{ backgroundColor: `${tool.color}20`, color: tool.color }}
                >
                  <tool.icon size={32} />
                </div>
                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-description">{tool.description}</p>
                <span className="tool-cta">Use Tool →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
