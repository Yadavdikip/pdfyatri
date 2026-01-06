import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import '../Styles/MergePdf.css';

const    MergePdf = () => {
	const [pdfFiles, setPdfFiles] = useState([]);
	const [sortOrder, setSortOrder] = useState('a-to-z');

	const onDrop = (acceptedFiles) => {
		const newPdfFiles = acceptedFiles.map((file) => ({
			file,
			id: Math.random().toString(36).slice(2, 9),
			name: file.name,
			size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
		}));
		setPdfFiles((prev) => [...prev, ...newPdfFiles]);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'application/pdf': ['.pdf'] },
		multiple: true,
		maxSize: 52428800,
	});

	const removePdf = (id) => setPdfFiles((prev) => prev.filter((p) => p.id !== id));

	const moveFileUp = (index) => {
		if (index === 0) return;
		const arr = [...pdfFiles];
		[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
		setPdfFiles(arr);
	};

	const moveFileDown = (index) => {
		if (index === pdfFiles.length - 1) return;
		const arr = [...pdfFiles];
		[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
		setPdfFiles(arr);
	};

	const sortFiles = () => {
		const arr = [...pdfFiles];
		if (sortOrder === 'a-to-z') {
			arr.sort((a, b) => a.name.localeCompare(b.name));
			setSortOrder('z-to-a');
		} else {
			arr.sort((a, b) => b.name.localeCompare(a.name));
			setSortOrder('a-to-z');
		}
		setPdfFiles(arr);
	};

	const mergePdfs = () => {
		if (pdfFiles.length < 2) return alert('Please select at least 2 PDF files to merge');
		alert(`Merging ${pdfFiles.length} PDF files...`);
	};

	const downloadMergedPdf = () => {
		if (pdfFiles.length === 0) return;
		alert('Downloading merged PDF...');
	};

	return (
		<div className="merge-pdf-container">
		
			<div className="merge-content">
				<div className="left-section">
					<div {...getRootProps()} className="select-pdf-dropbox">
						<input {...getInputProps()} />
						<Upload size={32} className="upload-icon" />
						<p className="dropbox-text">{isDragActive ? 'Drop PDF files here...' : 'Select PDF'}</p>
						<p className="dropbox-hint">Drag & drop files here, or click to select files</p>
					</div>
					<div className="selected-pdf-section">
						<h3 className="section-heading">Selected PDF</h3>
						<div className="a4-pdf-container">
							{pdfFiles.length > 0 ? (
								<div className="pdf-files-list">
									{pdfFiles.map((pdf, i) => (
										<div key={pdf.id} className="pdf-file-item">
											<div className="file-info">
												<span className="file-name">{pdf.name}</span>
												<span className="file-size">{pdf.size}</span>
											</div>
											<div className="file-actions">
												<button onClick={() => moveFileUp(i)} disabled={i === 0} className="move-btn"><ChevronUp size={16} /></button>
												<button onClick={() => moveFileDown(i)} disabled={i === pdfFiles.length - 1} className="move-btn"><ChevronDown size={16} /></button>
												<button onClick={() => removePdf(pdf.id)} className="remove-btn"><X size={16} /></button>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="no-files"><p>No PDF files selected</p></div>
							)}
						</div>
					</div>
				</div>
				<div className="right-section">
					<div className="cloud-options">
						<div className="plus-icon-container"><Plus size={24} className="plus-icon" /></div>
						<div className="cloud-buttons">
							<button className="cloud-btn">Google Drive</button>
							<button className="cloud-btn">Dropbox</button>
							<button className="cloud-btn">Google File</button>
						</div>
					</div>
					<div className="sort-section">
						<div className="sort-circle">
							<button onClick={sortFiles} className="sort-btn" title={sortOrder === 'a-to-z' ? 'A to Z' : 'Z to A'}>
								<ChevronUp size={20} className="up-arrow" />
								<ChevronDown size={20} className="down-arrow" />
							</button>
						</div>
						<span className="sort-text">{sortOrder === 'a-to-z' ? 'A to Z' : 'Z to A'}</span>
					</div>
					<div className="action-buttons">
						<button onClick={mergePdfs} disabled={pdfFiles.length < 2} className="merge-pdf-btn">Merge PDF</button>
						<button onClick={downloadMergedPdf} disabled={pdfFiles.length === 0} className="download-merged-btn"><Download size={20} />Download Merged PDF</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MergePdf;
