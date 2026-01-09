import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Home from './Pages/Home.jsx'
import JPGToPDF from "../Components/JPGToPDF.jsx"
import AddPageNumber from '../Components/AddPageNumber..jsx'
import AiVoiceEditer from '../Components/AiVoiceEditer.jsx'
import CompressPdf from '../Components/CompressPdf.jsx'
import ContactUs from './Pages/ContactUs.jsx'
import DocToPdf from '../Components/DocToPdf.jsx'
import EditPdf from '../Components/EditPdf.jsx'
import ExcelToPdf from '../Components/ExcelToPdf.jsx'
import HtmlToPdf from '../Components/HtmlToPdf.jsx'
import ImageCrop from '../Components/ImageCrop.jsx'
import MergePdf from '../Components/MergePdf.jsx'
import OrganizePage from '../Components/OrganizePage.jsx'
import PdfCrop from '../Components/PdfCrop.jsx'
import PdfToDoc from '../Components/PdfToDoc.jsx'
import PdfToExcel from '../Components/PdfToExcel.jsx'
import PdfToOcr from '../Components/PdfToOcr.jsx'
import PdfToPowerPoint from '../Components/PdfToPowerPoint.jsx'
import PdfToWord from '../Components/PdfToWord.jsx'
import PdfToPdfa from '../Components/PdfToPdfa.jsx'
import RemovePage from '../Components/RemovePage.jsx'
import RepairPdf from '../Components/RepairPdf.jsx'
import RotatePdf from '../Components/RotatePdf.jsx'
//import ScanToPdf from '../Components/ScanToPdf.jsx'
import Signin from './Pages/Signin.jsx'
import Signup from './Pages/Signup.jsx'
import SplitPdf from '../Components/SplitPdf.jsx'
import ThreeDARPDF from '../Components/ThreeDARPDF.jsx'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
            <Route path="/add-page-number" element={<AddPageNumber />} />
            <Route path="/ai-voice-editer" element={<AiVoiceEditer />} />
            <Route path="/compress-pdf" element={<CompressPdf />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/doc-to-pdf" element={<DocToPdf />} />
            <Route path="/edit-pdf" element={<EditPdf />} />
            <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
            <Route path="/html-to-pdf" element={<HtmlToPdf />} />
            <Route path="/image-crop" element={<ImageCrop />} />
            <Route path="/crop-image" element={<ImageCrop />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/organize-page" element={<OrganizePage />} />
            <Route path="/pdf-crop" element={<PdfCrop />} />
            <Route path="/crop-pdf" element={<PdfCrop />} />
            <Route path="/pdf-to-doc" element={<PdfToDoc />} />
            <Route path="/pdf-to-excel" element={<PdfToExcel />} />
            <Route path="/pdf-to-ocr" element={<PdfToOcr />} />
            <Route path="/pdf-to-powerpoint" element={<PdfToPowerPoint />} />
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/pdf-to-pdfa" element={<PdfToPdfa />} />
            <Route path="/pdf-remove-page" element={<RemovePage />} />
            <Route path="/repair-pdf" element={<RepairPdf />} />
            <Route path="/rotate-pdf" element={<RotatePdf />} />
            {/*<Route path="/scan-to-pdf" element={<ScanToPdf />} />*/}
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/split-pdf" element={<SplitPdf />} />
            <Route path="/three-d-ar-pdf" element={<ThreeDARPDF />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App
