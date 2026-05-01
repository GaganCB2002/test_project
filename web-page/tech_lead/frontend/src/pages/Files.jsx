import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Search,
  Grid,
  List,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Download,
  Trash2,
  Eye,
  X,
  Clock,
  User,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  File,
} from 'lucide-react';
import { format } from 'date-fns';

// File type icons and colors
const fileTypeConfig = {
  PDF: { icon: FileText, color: 'text-red-500 bg-red-500/10' },
  DOCX: { icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
  XLSX: { icon: FileSpreadsheet, color: 'text-green-500 bg-green-500/10' },
  PNG: { icon: FileImage, color: 'text-purple-500 bg-purple-500/10' },
  ZIP: { icon: FileArchive, color: 'text-yellow-500 bg-yellow-500/10' },
};

const filterTabs = ['All', 'PDF', 'DOCX', 'XLSX', 'PNG', 'ZIP'];

// Mock files data
const mockFiles = [
  {
    _id: '1',
    name: 'Q1 2026 Financial Report.pdf',
    type: 'PDF',
    size: 2456789,
    uploadedBy: { name: 'Sarah Chen', avatar: 'SC' },
    uploadDate: '2026-04-15',
    version: '2.1',
    project: 'Finance',
  },
  {
    _id: '2',
    name: 'Technical Specification Document.docx',
    type: 'DOCX',
    size: 523456,
    uploadedBy: { name: 'Alex Kim', avatar: 'AK' },
    uploadDate: '2026-04-12',
    version: '1.5',
    project: 'E-Commerce Platform',
  },
  {
    _id: '3',
    name: 'Budget Analysis Spreadsheet.xlsx',
    type: 'XLSX',
    size: 892345,
    uploadedBy: { name: 'Mike Johnson', avatar: 'MJ' },
    uploadDate: '2026-04-10',
    version: '3.0',
    project: 'Finance',
  },
  {
    _id: '4',
    name: 'App Mockup Screenshots.png',
    type: 'PNG',
    size: 4567890,
    uploadedBy: { name: 'Emma Davis', avatar: 'ED' },
    uploadDate: '2026-04-08',
    version: '1.2',
    project: 'Mobile Banking App',
  },
  {
    _id: '5',
    name: 'Project Assets Archive.zip',
    type: 'ZIP',
    size: 15678901,
    uploadedBy: { name: 'James Wilson', avatar: 'JW' },
    uploadDate: '2026-04-05',
    version: '1.0',
    project: 'E-Commerce Platform',
  },
  {
    _id: '6',
    name: 'API Documentation v2.pdf',
    type: 'PDF',
    size: 1234567,
    uploadedBy: { name: 'Alex Kim', avatar: 'AK' },
    uploadDate: '2026-04-03',
    version: '2.0',
    project: 'API Gateway',
  },
  {
    _id: '7',
    name: 'User Research Findings.docx',
    type: 'DOCX',
    size: 789012,
    uploadedBy: { name: 'Sarah Chen', avatar: 'SC' },
    uploadDate: '2026-04-01',
    version: '1.0',
    project: 'Analytics Dashboard',
  },
  {
    _id: '8',
    name: 'Product Images Collection.png',
    type: 'PNG',
    size: 8901234,
    uploadedBy: { name: 'Emma Davis', avatar: 'ED' },
    uploadDate: '2026-03-28',
    version: '2.1',
    project: 'E-Commerce Platform',
  },
];

// Mock version history
const mockVersionHistory = (file) => [
  { version: file.version, date: file.uploadDate, author: file.uploadedBy.name, changes: 'Current version' },
  { version: (parseFloat(file.version) - 0.1).toFixed(1), date: '2026-04-10', author: file.uploadedBy.name, changes: 'Updated charts and formatting' },
  { version: (parseFloat(file.version) - 0.2).toFixed(1), date: '2026-03-25', author: file.uploadedBy.name, changes: 'Initial draft' },
];

// Format file size
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

function Files() {
  const [files, setFiles] = useState(mockFiles);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesFilter = activeFilter === 'All' || file.type === activeFilter;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate file upload
    simulateUpload();
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setShowUploadModal(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setShowPreviewModal(true);
  };

  const handleVersionHistory = (file) => {
    setSelectedFile(file);
    setShowVersionModal(true);
  };

  const handleDownload = (file) => {
    // Mock download
    console.log('Downloading:', file.name);
  };

  const handleDelete = (fileId) => {
    setFiles(files.filter((f) => f._id !== fileId));
  };

  const getFileIcon = (type) => {
    const config = fileTypeConfig[type] || fileTypeConfig.PDF;
    return config.icon;
  };

  const getFileColor = (type) => {
    const config = fileTypeConfig[type] || fileTypeConfig.PDF;
    return config.color;
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Files</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and share your documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary"
        >
          <Upload size={18} />
          Upload File
        </button>
      </motion.div>

      {/* Drag & Drop Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative mb-8 p-8 border-2 border-dashed rounded-2xl transition-all duration-300
          ${isDragging
            ? 'border-primary-500 bg-primary-500/10 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
            className="w-16 h-16 mb-4 rounded-full bg-primary-500/10 flex items-center justify-center"
          >
            <Upload className={`w-8 h-8 ${isDragging ? 'text-primary-500' : 'text-gray-400'}`} />
          </motion.div>
          <p className="text-gray-900 dark:text-white font-medium mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            or click to browse from your computer
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Browse Files
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
      >
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200
                ${activeFilter === tab
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Files Display */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              const colorClass = getFileColor(file.type);
              return (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-4 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* File Icon */}
                  <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
                    <FileIcon className="w-6 h-6" />
                  </div>

                  {/* File Info */}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate" title={file.name}>
                    {file.name}
                  </h3>

                  {/* Uploaded by */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-500">{file.uploadedBy.avatar}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{file.uploadedBy.name}</span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{format(new Date(file.uploadDate), 'MMM d, yyyy')}</span>
                  </div>

                  {/* Version Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 rounded-md text-xs font-medium">
                      v{file.version}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{file.project}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handlePreview(file)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleVersionHistory(file)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Version History"
                      >
                        <Clock className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              const colorClass = getFileColor(file.type);
              return (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="card p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300"
                >
                  {/* File Icon */}
                  <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <FileIcon className="w-6 h-6" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>{file.project}</span>
                      <span>{formatFileSize(file.size)}</span>
                      <span>{format(new Date(file.uploadDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  {/* Uploaded by */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-500">{file.uploadedBy.avatar}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{file.uploadedBy.name}</span>
                  </div>

                  {/* Version */}
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 rounded-md text-xs font-medium flex-shrink-0">
                    v{file.version}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handlePreview(file)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleVersionHistory(file)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Version History"
                    >
                      <Clock className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <File className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No files found</p>
          </div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload File</h2>
                <button
                  onClick={() => !uploading && setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploading ? (
                <div className="text-center py-8">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PDF, DOCX, XLSX, PNG, ZIP up to 50MB
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">File Preview</h2>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className={`w-16 h-16 rounded-xl ${getFileColor(selectedFile.type)} flex items-center justify-center`}>
                    {(() => {
                      const Icon = getFileIcon(selectedFile.type);
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedFile.project}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Size</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Version</p>
                    <p className="font-medium text-gray-900 dark:text-white">v{selectedFile.version}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedFile.type}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Upload Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedFile.uploadDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Uploaded By</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="font-medium text-primary-500">{selectedFile.uploadedBy.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFile.uploadedBy.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Author</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => handleDownload(selectedFile)}
                    className="btn-primary flex-1"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      handleVersionHistory(selectedFile);
                    }}
                    className="btn-secondary flex-1"
                  >
                    <Clock size={18} />
                    Version History
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version History Modal */}
      <AnimatePresence>
        {showVersionModal && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowVersionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Version History</h2>
                <button
                  onClick={() => setShowVersionModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="font-medium text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatFileSize(selectedFile.size)}</p>
              </div>

              <div className="space-y-3">
                {mockVersionHistory(selectedFile).map((version, index) => (
                  <motion.div
                    key={version.version}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 rounded-xl border transition-all
                      ${index === 0
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${index === 0 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                        Version {version.version}
                        {index === 0 && (
                          <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">Current</span>
                        )}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(version.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{version.changes}</p>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{version.author}</span>
                    </div>
                    {index !== 0 && (
                      <button className="mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium">
                        Download this version
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Files;