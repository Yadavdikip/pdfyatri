import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Github, Twitter, Mail } from 'lucide-react'
import '../Styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <Link to="/" className="footer-logo">
              <FileText className="logo-icon" />
              PDF YATRI
            </Link>
            <p className="footer-description">
              Your all-in-one solution for PDF conversion and manipulation. 
              Fast, secure, and completely free.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <Github size={20} />
              </a>
              <a href="#" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Tools</h4>
            <div className="footer-links">
              <Link to="/pdf-to-word">PDF to Word</Link>
              <Link to="/jpg-to-pdf">JPG to PDF</Link>
              <Link to="/merge-pdf">Merge PDF</Link>
              <Link to="/pdf-to-excel">PDF to Excel</Link>
              <Link to="/excel-to-pdf">Excel to PDF</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>More Tools</h4>
            <div className="footer-links">
              <Link to="/compress-pdf">Compress PDF</Link>
              <Link to="/split-pdf">Split PDF</Link>
              <Link to="/pdf-to-doc">PDF to DOC</Link>
              <Link to="/doc-to-pdf">DOC to PDF</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <div className="footer-links">
              <Link to="/contact-us">Contact Us</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <a href="#">Terms of Service</a>
              <a href="#">Help Center</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 PDF YATRI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer