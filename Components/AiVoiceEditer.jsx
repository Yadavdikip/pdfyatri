import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Mic, MicOff, Download, Trash2, Edit3 } from 'lucide-react';
import FileUpload from './FileUpload';
import '../Styles/AiVoiceEditer.css';

const    AIVoiceEditer = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const finalTranscript = event.results[event.results.length - 1][0].transcript;
        setTranscript(finalTranscript);
        processVoiceCommand(finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Add command to history
    setCommandHistory(prev => [...prev, { command: lowerCommand, timestamp: new Date() }]);

    // Add the processed command to the list
    setCommands(prev => [...prev, { type: 'command', text: lowerCommand }]);
  };



  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'voice-edited-pdf.pdf';
      link.click();
    }
  };

  const resetFile = () => {
    setPdfFile(null);
    setPdfUrl(null);
    setCommands([]);
    setCommandHistory([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (file) => {
    setPdfFile(file);
    setPdfUrl(URL.createObjectURL(file));
    setCommands([]);
    setCommandHistory([]);
  };

  return (
    <div className="voice-editor-container">
      {!pdfFile ? (
        <FileUpload
          onFileUpload={handleFileSelect}
          acceptedFiles={{ 'application/pdf': ['.pdf'] }}
          multiple={false}
          maxFiles={1}
          maxSize={50000000} // 50MB
          uploadText="Drag & drop your PDF file here, or click to select"
          hintText="Support voice commands for editing"
          icon={Edit3}
        />
      ) : (
        <div className="editor-container">
          <div className="toolbar">
            <button 
              className={`voice-button ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
            >
              {isListening ? <Mic size={20} /> : <MicOff size={20} />}
              <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
            </button>

            <div className="action-buttons">
              <button className="download-button" onClick={downloadPdf}>
                <Download size={20} />
                <span>Download</span>
              </button>
              <button className="reset-button" onClick={resetFile}>
                <Trash2 size={20} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="editor-main">
            <div className="pdf-preview">
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  className="pdf-viewer"
                  title="PDF preview"
                />
              )}
            </div>

            <div className="command-panel">
              <div className="voice-status">
                {isListening && (
                  <div className="listening-indicator">
                    <div className="pulse"></div>
                    <span>Listening...</span>
                  </div>
                )}
                {transcript && (
                  <div className="transcript">
                    <p>{transcript}</p>
                  </div>
                )}
              </div>

              <div className="command-list">
                <h3>Command History</h3>
                <div className="command-items">
                  {commands.map((cmd, index) => (
                    <div 
                      key={index} 
                      className={`command-item ${cmd.type}`}
                    >
                      {cmd.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="command-help">
                <h4>Available Voice Commands:</h4>
                <ul>
                  <li>"Add text [your text]" - Add text to current page</li>
                  <li>"Add watermark [text]" - Add watermark to all pages</li>
                  <li>"Save document" - Download the PDF</li>
                  <li>"Reset" - Clear current file</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVoiceEditer;
