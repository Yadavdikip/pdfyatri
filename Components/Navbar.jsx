import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText } from 'lucide-react'
import '../Styles/Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const tools = [
    { path: '/pdf-to-word', name: 'PDF to Word' },
    { path: '/jpg-to-pdf', name: 'JPG to PDF' },
    { path: '/merge-pdf', name: 'Merge PDF' },
    { path: '/pdf-to-excel', name: 'PDF to Excel' },
    { path: '/excel-to-pdf', name: 'Excel to PDF' },
    { path: '/compress-pdf', name: 'Compress PDF' },
    { path: '/split-pdf', name: 'Split PDF' },
    { path: '/pdf-to-doc', name: 'PDF to DOC' },
    { path: '/doc-to-pdf', name: 'DOC to PDF' },
    { path: '/add-page-number', name: 'Add Page Number' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FileText className="logo-icon" />
          PDF Tools Pro
        </Link>
        
        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          <div className="dropdown">
            <button className="dropdown-btn">
              Tools <span>▼</span>
            </button>
            <div className="dropdown-content">
              {tools.map(tool => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`dropdown-link ${
                    location.pathname === tool.path ? 'active' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}

export default Navbar