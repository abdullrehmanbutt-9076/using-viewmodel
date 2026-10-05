import React, { useState } from 'react';
import { KOTLIN_PROJECT_FILES, KotlinFile } from '../kotlinSourceCode';
import { generateAndroidStudioProjectZip, downloadBlob } from './ProjectExporter';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Folder,
  ChevronRight,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Screen', 'ViewModel', 'Repository', 'Navigation', 'Model', 'Data', 'Config'];

  const filteredFiles = KOTLIN_PROJECT_FILES.filter((file) => {
    const matchesCategory = activeCategory === 'All' || file.category === activeCategory;
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloading(true);
      const zipBlob = await generateAndroidStudioProjectZip();
      downloadBlob(zipBlob, 'AndroidCourseApp-MVVM-Compose.zip');
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-900 text-slate-100">
      {/* Left Sidebar: File Tree & Filter */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 bg-slate-950/60">
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kotlin files..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex gap-1 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white font-medium'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            com.example.myapp/ ({filteredFiles.length} files)
          </div>

          {filteredFiles.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                selectedFile.path === file.path
                  ? 'bg-purple-600/20 text-purple-300 font-medium border border-purple-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${
                  file.category === 'ViewModel' ? 'text-blue-400' :
                  file.category === 'Screen' ? 'text-purple-400' :
                  file.category === 'Repository' ? 'text-emerald-400' :
                  file.category === 'Navigation' ? 'text-amber-400' : 'text-slate-400'
                }`} />
                <span className="truncate font-mono">{file.name}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 font-sans">
                {file.category}
              </span>
            </button>
          ))}
        </div>

        {/* Download Android Studio Zip Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={downloading}
            className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Packing Project...' : 'Download Android Studio (.zip)'}</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center mt-1.5">
            Includes Gradle scripts, Manifest, and all 15+ Kotlin files
          </p>
        </div>
      </div>

      {/* Right Pane: Code Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        {/* Code Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-purple-300">
              {selectedFile.path}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              — {selectedFile.description}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
              title="Copy Kotlin Code"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Body with Line Numbers */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200 selection:bg-purple-600 selection:text-white">
          <pre className="table w-full">
            {selectedFile.content.split('\n').map((line, index) => (
              <div key={index} className="table-row hover:bg-slate-800/40">
                <span className="table-cell select-none pr-4 text-right text-slate-600 w-10">
                  {index + 1}
                </span>
                <span className="table-cell whitespace-pre">{line}</span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};
