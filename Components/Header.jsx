import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Search, Globe, User, Menu, X,
  ChevronDown, Shield, FileCheck, Lock, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';
import { useLanguage } from '../src/context/LanguageContext';

import '../Styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { user, signout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

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
    // New tools
    { path: '/remove-page', name: 'Remove Page' },
    { path: '/organize-page', name: 'Organize Page' },
    { path: '/scan-to-pdf', name: 'Scan to PDF' },
    { path: '/pdf-to-ocr', name: 'PDF to OCR' },
    { path: '/html-to-pdf', name: 'HTML to PDF' },
    { path: '/pdf-to-powerpoint', name: 'PDF to PowerPoint' },
    { path: '/pdf-to-pdfa', name: 'PDF to PDF/A' },
    { path: '/add-page-number', name: 'Add Page Number' },
    { path: '/crop-pdf', name: 'Crop PDF' },
    { path: '/edit-pdf', name: 'Edit PDF' },
    { path: '/crop-image', name: 'Crop Image' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' }
  ];

  const privacyItems = [
  { icon: Shield, name: 'Privacy Policy', path: '/privacy-policy' }, // Updated path
  { icon: FileCheck, name: 'Terms of Service', path: '/terms' },
  { icon: Lock, name: 'Data Protection', path: '/data-protection' },
  { icon: Shield, name: 'Cookie Policy', path: '/cookies' },
  
];

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase())
      ).sort((a, b) => {
        const aIndex = a.name.toLowerCase().indexOf(query.toLowerCase());
        const bIndex = b.name.toLowerCase().indexOf(query.toLowerCase());
        return aIndex - bIndex;
      });
      setFilteredTools(filtered);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Optional: Handle form submission if needed, e.g., navigate to search results page
  };

  const handleToolSelect = (tool) => {
    navigate(tool.path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsLanguageOpen(false);
  };

  const handleSignout = () => {
    signout();
    setIsUserMenuOpen(false);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === language) || languages[0];
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <FileText className="logo-icon" />
          <span className="logo-text">PDF YATRI </span>
        </Link>

        {/* All Tools Dropdown */}
        <div
          className="nav-item dropdown"
          onMouseLeave={() => setIsToolsOpen(false)}
        >
          <button className="nav-link" onClick={() => setIsToolsOpen(!isToolsOpen)}>
            All Tools <ChevronDown size={10} />
          </button>
          {isToolsOpen && (
            <div className="dropdown-menu tools-dropdown">
              <div className="dropdown-header">
                <h3>All PDF Tools ({tools.length})</h3>
              </div>
              <div className="tools-grid">
                {tools.map((tool, index) => (
                  <Link
                    key={index}
                    to={tool.path}
                    className="tool-link"
                    onClick={() => setIsToolsOpen(false)}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="nav-item search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit">
              <Search size={18} />
            </button>
          </form>
          {showSearchResults && (
            <div className="search-results-dropdown">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => (
                  <button
                    key={index}
                    className="search-result-item"
                    onClick={() => handleToolSelect(tool)}
                  >
                    {tool.name}
                  </button>
                ))
              ) : (
                <div className="no-results">No tools found</div>
              )}
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div
          className="nav-item dropdown"
          onMouseEnter={() => setIsLanguageOpen(true)}
          onMouseLeave={() => setIsLanguageOpen(false)}
        >
          <button className="nav-link" onClick={() => setIsLanguageOpen(!isLanguageOpen)}>
            <Globe size={18} />
            {getCurrentLanguage().nativeName} <ChevronDown size={16} />
          </button>
          {isLanguageOpen && (
            <div 
              className="dropdown-menu language-dropdown"
              onMouseEnter={() => setIsLanguageOpen(true)}
              onMouseLeave={() => setIsLanguageOpen(false)}
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${language === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="language-name">{language.nativeName}</span>
                  <span className="language-english">({language.name})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu or Login */}
        {user ? (
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <button className="nav-link user-menu-btn">
              <User size={18} />
              {user.name}
              <ChevronDown size={16} />
            </button>
            {isUserMenuOpen && (
              <div 
                className="dropdown-menu user-dropdown"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-link">
                  <User size={16} />
                  Profile
                </Link>
                <Link to="/settings" className="dropdown-link">
                  <Settings size={16} />
                  Settings
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleSignout} className="dropdown-link signout-btn">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="nav-item">
            <Link to="/signin" className="login-btn">
              <User size={18} />
              Sign In
            </Link>
          </div>
        )}

        {/* Privacy Dropdown (Three Bars) */}
        <div 
          className="nav-item dropdown"
          onMouseEnter={() => setIsPrivacyOpen(true)}
          onMouseLeave={() => setIsPrivacyOpen(false)}
        >
          <button className="nav-link menu-btn">
            <Menu size={20} />
          </button>
          {isPrivacyOpen && (
            <div 
              className="dropdown-menu privacy-dropdown"
              onMouseEnter={() => setIsPrivacyOpen(true)}
              onMouseLeave={() => setIsPrivacyOpen(false)}
            >
              <div className="dropdown-header">
                <h3>Legal & Privacy</h3>
              </div>
              {privacyItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="privacy-link"
                  onClick={() => setIsPrivacyOpen(false)}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {/* Search in Mobile */}
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit mobile">
                Search
              </button>
            </form>
          </div>

          {/* Tools in Mobile */}
          <div className="mobile-section">
            <h3>All Tools ({tools.length})</h3>
            <div className="mobile-tools">
              {tools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.path}
                  className="mobile-tool-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language in Mobile */}
          <div className="mobile-section">
            <h3>Language</h3>
            <div className="mobile-languages">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`mobile-language-option ${language === language.code ? 'active' : ''}`}
                  onClick={() => {
                    handleLanguageChange(language.code);
                    setIsMenuOpen(false);
                  }}
                >
                  <span className="language-name">{language.nativeName}</span>
                  <span className="language-english">({language.name})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy in Mobile */}
          <div className="mobile-section">
            <h3>Legal & Privacy</h3>
            <div className="mobile-privacy">
              {privacyItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="mobile-privacy-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth in Mobile */}
          <div className="mobile-section">
            {user ? (
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">{user.name}</div>
                  <div className="mobile-user-email">{user.email}</div>
                </div>
                <button onClick={handleSignout} className="mobile-signout-btn">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/signin" className="mobile-login-btn">
                  <User size={18} />
                  Sign In
                </Link>
                <Link to="/signup" className="mobile-signup-btn">
                  Create Account
                </Link>
              </div>
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;