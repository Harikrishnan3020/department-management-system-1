import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileBadge, Upload, Edit3, Image as ImageIcon, CheckCircle, PlusCircle, Trash2, Link as LinkIcon, Download, Sparkles, Eye, FileUp, ExternalLink, X } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { AppContext } from '../context/AppContext';

const gradients = [
    'from-violet-600 via-purple-600 to-indigo-700',
    'from-emerald-600 via-teal-600 to-cyan-700',
    'from-amber-500 via-orange-600 to-red-600',
    'from-blue-600 via-indigo-600 to-violet-700',
    'from-rose-600 via-pink-600 to-fuchsia-700',
    'from-sky-500 via-blue-600 to-indigo-600',
];
const accents = ['purple', 'emerald', 'amber', 'blue', 'rose', 'sky'];

const Magazine = () => {
    const { currentUser, magazine, setMagazine } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [templateFile, setTemplateFile] = useState(null);
    const [templateLink, setTemplateLink] = useState('');
    const [uploadMode, setUploadMode] = useState('link'); // 'link' or 'file'

    // View / Edit state
    const [viewingArticle, setViewingArticle] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [isExtractingText, setIsExtractingText] = useState(false);

    const handleCoverChange = async (e) => {
        const f = e.target.files[0];
        if (f) {
            setCoverFile(f);

            // Set preview
            const reader = new FileReader();
            reader.onload = (ev) => setCoverPreview(ev.target.result);
            reader.readAsDataURL(f);

            // Auto-extract text using Tesseract.js
            setIsExtractingText(true);
            try {
                const result = await Tesseract.recognize(f, 'eng', {
                    logger: m => console.log(m)
                });

                if (result.data.text && result.data.text.trim().length > 0) {
                    setDescription(result.data.text.trim());
                }
            } catch (err) {
                console.error("OCR Error:", err);
            } finally {
                setIsExtractingText(false);
            }
        }
    };

    const handleTemplateFileChange = (e) => {
        const f = e.target.files[0];
        if (f) setTemplateFile(f);
    };

    const resetForm = () => {
        setTitle('');
        setSubtitle('');
        setDescription('');
        setCoverFile(null);
        setCoverPreview(null);
        setTemplateFile(null);
        setTemplateLink('');
        setShowForm(false);
    };

    const handlePublish = (e) => {
        e.preventDefault();
        if (!title || !description) return;

        const idx = Math.floor(Math.random() * gradients.length);

        const newEntry = {
            id: Date.now(),
            title,
            subtitle: subtitle || 'Department Magazine',
            content: description,
            image: coverPreview || null,
            templateLink: templateLink || null,
            templateFileName: templateFile ? templateFile.name : null,
            gradient: gradients[idx],
            accent: accents[idx],
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            author: currentUser.name,
        };

        setMagazine(prev => [newEntry, ...prev]);
        resetForm();
    };

    const handleEditSave = (id) => {
        setMagazine(prev => prev.map(m => m.id === id ? { ...m, content: editContent, title: editTitle } : m));
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this article permanently?')) {
            setMagazine(prev => prev.filter(m => m.id !== id));
            if (viewingArticle?.id === id) setViewingArticle(null);
        }
    };

    const downloadArticle = (article) => {
        const content = `${article.title}\n${article.subtitle || ''}\n\nDate: ${article.date}\nAuthor: ${article.author}\n\n${article.content}\n\n${article.templateLink ? `Template: ${article.templateLink}` : ''}${article.templateFileName ? `\nAttached Template: ${article.templateFileName}` : ''}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Magazine_${article.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const AccentBadge = ({ color, children }) => {
        const colors = {
            purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
            amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
            blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
            rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
            sky: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.purple}`}>{children}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3 text-glow">
                        <FileBadge className="text-luxury-gold" size={32} />
                        <span>Department Magazine</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Create, publish & manage department articles and event highlights</p>
                </div>
                {isAuthorized && (
                    <button onClick={() => setShowForm(!showForm)} className="px-5 py-3 bg-gradient-to-r from-luxury-gold to-yellow-600 rounded-xl text-slate-900 font-bold hover:shadow-glow-gold flex items-center space-x-2 transition-shadow">
                        {showForm ? <X size={18} /> : <PlusCircle size={18} />}
                        <span>{showForm ? 'Close' : 'New Article'}</span>
                    </button>
                )}
            </div>

            {/* --- Create Article Form --- */}
            <AnimatePresence>
                {showForm && isAuthorized && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <form onSubmit={handlePublish} className="glass-card p-8 rounded-[2rem] border border-glass-border shadow-glass-card max-w-3xl mx-auto space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                <Sparkles className="text-luxury-gold" size={22} />
                                <span>Create New Article</span>
                            </h2>

                            {/* Title */}
                            <div>
                                <label className="text-slate-400 text-sm font-bold block mb-2">Article Title *</label>
                                <input type="text" required placeholder="e.g. Annual Day Celebrations 2026" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-xl text-white font-semibold focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/30 outline-none transition-all" />
                            </div>

                            {/* Subtitle */}
                            <div>
                                <label className="text-slate-400 text-sm font-bold block mb-2">Subtitle (Optional)</label>
                                <input type="text" placeholder="e.g. A Grand Evening of Talent & Culture" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-xl text-white focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/30 outline-none transition-all" />
                            </div>

                            {/* Cover Photo */}
                            <div>
                                <label className="text-slate-400 text-sm font-bold block mb-2">
                                    <ImageIcon size={14} className="inline mr-1" /> Cover Photo
                                </label>
                                <input type="file" accept="image/*" onChange={handleCoverChange} className="w-full bg-slate-800/80 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-luxury-gold/20 file:text-luxury-gold hover:file:bg-luxury-gold/30 rounded-xl transition-all" />
                                {coverPreview && (
                                    <div className="mt-3 relative bg-slate-900 rounded-xl border border-white/10 flex justify-center items-center overflow-hidden">
                                        <div className="absolute inset-0 bg-cover bg-center blur-xl opacity-30" style={{ backgroundImage: `url(${coverPreview})` }}></div>
                                        <img src={coverPreview} alt="Cover Preview" className="relative z-10 w-full max-h-64 object-contain" />
                                        <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }} className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-lg hover:bg-black/80 z-20"><X size={14} /></button>
                                    </div>
                                )}
                            </div>

                            {/* Article Content */}
                            <div className="relative">
                                <label className="text-slate-400 text-sm font-bold block mb-2 flex justify-between items-center">
                                    <span>Article Content *</span>
                                    {isExtractingText && <span className="text-xs text-electric-blue animate-pulse">Extracting text from image...</span>}
                                </label>
                                <textarea required rows={6} placeholder="Write the full article content here — describe the event, achievements, key highlights..." value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800/80 border border-white/10 p-3 rounded-xl text-white leading-relaxed focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/30 outline-none transition-all" />
                            </div>

                            {/* Template Section */}
                            <div className="border border-white/10 rounded-2xl p-5 bg-slate-800/30">
                                <label className="text-slate-300 text-sm font-bold block mb-3 flex items-center space-x-2">
                                    <FileUp size={16} className="text-electric-blue" />
                                    <span>Attach Template (Optional)</span>
                                </label>
                                {/* Toggle */}
                                <div className="flex space-x-2 mb-4">
                                    <button type="button" onClick={() => setUploadMode('link')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${uploadMode === 'link' ? 'bg-electric-blue text-slate-900' : 'bg-slate-800 text-slate-400 border border-white/10 hover:bg-white/5'}`}>
                                        <LinkIcon size={12} className="inline mr-1" /> Paste Link
                                    </button>
                                    <button type="button" onClick={() => setUploadMode('file')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${uploadMode === 'file' ? 'bg-electric-blue text-slate-900' : 'bg-slate-800 text-slate-400 border border-white/10 hover:bg-white/5'}`}>
                                        <Upload size={12} className="inline mr-1" /> Upload File
                                    </button>
                                </div>

                                {uploadMode === 'link' ? (
                                    <div>
                                        <input type="url" placeholder="https://canva.com/design/... or Google Docs/Drive link" value={templateLink} onChange={e => setTemplateLink(e.target.value)} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-white placeholder-slate-500 focus:border-electric-blue/50 focus:ring-1 focus:ring-electric-blue/30 outline-none transition-all" />
                                        <p className="text-[10px] text-slate-500 mt-2">Supports Canva, Google Docs, Drive, Figma, or any public URL</p>
                                    </div>
                                ) : (
                                    <div>
                                        <input type="file" accept=".pdf,.docx,.pptx,.psd,.ai,.fig,.png,.jpg" onChange={handleTemplateFileChange} className="w-full bg-slate-900 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30 rounded-xl" />
                                        {templateFile && (
                                            <div className="mt-2 flex items-center space-x-2 bg-electric-blue/10 border border-electric-blue/20 px-3 py-2 rounded-lg">
                                                <FileUp size={14} className="text-electric-blue" />
                                                <span className="text-xs text-electric-blue font-bold truncate">{templateFile.name}</span>
                                                <button type="button" onClick={() => setTemplateFile(null)} className="ml-auto text-slate-400 hover:text-white"><X size={12} /></button>
                                            </div>
                                        )}
                                        <p className="text-[10px] text-slate-500 mt-2">Accepts PDF, DOCX, PPTX, PSD, AI, Figma, PNG, JPG</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={resetForm} className="px-5 py-2.5 border border-white/20 rounded-xl text-slate-300 font-bold hover:bg-white/5 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-luxury-gold to-yellow-500 rounded-xl font-black text-slate-900 hover:shadow-glow-gold transition-shadow flex items-center space-x-2">
                                    <Sparkles size={16} /><span>Publish Article</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Article Detail Modal --- */}
            <AnimatePresence>
                {viewingArticle && (
                    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setViewingArticle(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-slate-900 border border-white/10 rounded-[2rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                            {/* Cover */}
                            <div className={`relative h-64 bg-gradient-to-br ${viewingArticle.gradient} rounded-t-[2rem] flex items-end p-8 overflow-hidden`}>
                                {viewingArticle.image && (
                                    <>
                                        <div className="absolute inset-0 bg-cover bg-center blur-xl opacity-40" style={{ backgroundImage: `url(${viewingArticle.image})` }}></div>
                                        <img src={viewingArticle.image} alt="" className="absolute inset-0 w-full h-full object-contain z-0" />
                                    </>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                                <button onClick={() => setViewingArticle(null)} className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-lg hover:bg-black/60 z-20"><X size={18} /></button>
                                <div className="relative z-10">
                                    <AccentBadge color={viewingArticle.accent}>{viewingArticle.date}</AccentBadge>
                                    <h2 className="text-3xl font-black text-white mt-3 leading-tight">{viewingArticle.title}</h2>
                                    {viewingArticle.subtitle && <p className="text-white/70 font-medium mt-1">{viewingArticle.subtitle}</p>}
                                </div>
                            </div>
                            {/* Body */}
                            <div className="p-8">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">By {viewingArticle.author}</p>
                                <div className="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap text-base">{viewingArticle.content}</div>

                                {/* Template attachments */}
                                {(viewingArticle.templateLink || viewingArticle.templateFileName) && (
                                    <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-white/10 space-y-2">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attached Template</p>
                                        {viewingArticle.templateLink && (
                                            <a href={viewingArticle.templateLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-electric-blue font-bold text-sm hover:text-white transition-colors">
                                                <ExternalLink size={14} /><span className="underline truncate">{viewingArticle.templateLink}</span>
                                            </a>
                                        )}
                                        {viewingArticle.templateFileName && (
                                            <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                                                <FileUp size={14} /><span>{viewingArticle.templateFileName}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-8 flex space-x-3 border-t border-white/10 pt-6">
                                    <button onClick={() => downloadArticle(viewingArticle)} className="px-4 py-2 bg-luxury-gold/20 text-luxury-gold rounded-xl font-bold text-sm border border-luxury-gold/30 flex items-center space-x-2 hover:bg-luxury-gold/30 transition-colors">
                                        <Download size={16} /><span>Download</span>
                                    </button>
                                    <button onClick={() => setViewingArticle(null)} className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/10 transition-colors">Close</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- Magazine Grid --- */}
            {magazine.length === 0 ? (
                <div className="text-center py-16 glass-card rounded-[2rem] border border-dashed border-white/20">
                    <FileBadge size={48} className="mx-auto text-slate-600 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No Articles Yet</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto">
                        {isAuthorized
                            ? 'Click "New Article" to create your first department magazine article with cover photos, content, and template attachments.'
                            : 'No articles have been published yet. Check back later!'}
                    </p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {magazine.map((article) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card overflow-hidden group cursor-pointer flex flex-col"
                        >
                            {/* Cover */}
                            <div className={`relative h-48 bg-gradient-to-br ${article.gradient || gradients[0]} overflow-hidden`} onClick={() => setViewingArticle(article)}>
                                {article.image && (
                                    <>
                                        <div className="absolute inset-0 bg-cover bg-center blur-md opacity-40" style={{ backgroundImage: `url(${article.image})` }}></div>
                                        <img src={article.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0 opacity-60" />
                                    </>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <AccentBadge color={article.accent || 'purple'}>Published</AccentBadge>
                                    <h3 className="text-lg font-black text-white mt-2 leading-tight line-clamp-2">{article.title}</h3>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">{article.date} · {article.author}</p>

                                {editingId === article.id ? (
                                    <div className="space-y-2 flex-1">
                                        <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-slate-800 border border-electric-blue/30 rounded-lg p-2 text-white text-sm font-bold focus:outline-none" />
                                        <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} className="w-full bg-slate-800 border border-electric-blue/30 rounded-lg p-2 text-slate-300 text-xs leading-relaxed focus:outline-none" />
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleEditSave(article.id)} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/30 flex items-center space-x-1">
                                                <CheckCircle size={14} /><span>Save</span>
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-white/5 text-slate-400 rounded-lg text-xs font-bold border border-white/10">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">{article.content}</p>
                                )}

                                {/* Template badge */}
                                {(article.templateLink || article.templateFileName) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {article.templateLink && (
                                            <a href={article.templateLink} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-electric-blue/10 text-electric-blue rounded-lg text-[10px] font-bold border border-electric-blue/20 flex items-center space-x-1 hover:bg-electric-blue/20 transition-colors" onClick={e => e.stopPropagation()}>
                                                <LinkIcon size={10} /><span>Template Link</span>
                                            </a>
                                        )}
                                        {article.templateFileName && (
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded-lg text-[10px] font-bold border border-purple-500/20 flex items-center space-x-1">
                                                <FileUp size={10} /><span>{article.templateFileName}</span>
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                    <button onClick={() => setViewingArticle(article)} className="text-xs text-electric-blue font-bold flex items-center space-x-1 hover:text-white transition-colors">
                                        <Eye size={14} /><span>Read Full</span>
                                    </button>
                                    {isAuthorized && (
                                        <div className="flex space-x-1">
                                            <button onClick={() => downloadArticle(article)} className="p-1.5 text-slate-500 hover:text-luxury-gold transition-colors rounded-lg hover:bg-white/5"><Download size={14} /></button>
                                            <button onClick={() => { setEditingId(article.id); setEditContent(article.content); setEditTitle(article.title); }} className="p-1.5 text-slate-500 hover:text-electric-blue transition-colors rounded-lg hover:bg-white/5"><Edit3 size={14} /></button>
                                            <button onClick={() => handleDelete(article.id)} className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors rounded-lg hover:bg-white/5"><Trash2 size={14} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Magazine;
