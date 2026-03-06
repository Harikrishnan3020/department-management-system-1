import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileBadge, Upload, Edit3, Image as ImageIcon, Save, CheckCircle, PlusCircle, Trash2, Link as LinkIcon, Download } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Magazine = () => {
    const { currentUser, magazine, setMagazine } = useContext(AppContext);

    // Auth Check
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [file, setFile] = useState(null);
    const [templateFile, setTemplateFile] = useState(null);
    const [templateType, setTemplateType] = useState('template1');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [department, setDepartment] = useState('');
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const newEntry = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            topic: topic.trim(),
            collegeName: collegeName.trim(),
            department: department.trim(),
            city: city.trim(),
            articleDate: date,
            image: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
            templateFile: templateFile ? templateFile.name : null,
            templateType: templateType,
            date: new Date().toLocaleDateString(),
            author: currentUser.name
        };

        setMagazine(prev => [newEntry, ...prev]);
        setFile(null);
        setTemplateFile(null);
        setTitle('');
        setContent('');
        setTopic('');
        setCollegeName('');
        setDepartment('');
        setCity('');
        setDate('');
    };

    const handleEditSave = (id) => {
        setMagazine(prev => prev.map(m => m.id === id ? { ...m, content: editContent } : m));
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setMagazine(prev => prev.filter(m => m.id !== id));
    };

    const downloadArticle = (article) => {
        const contentStr = `${article.title}\nTopic: ${article.topic || 'N/A'}\nCollege: ${article.collegeName || 'N/A'}\nDepartment: ${article.department || 'N/A'}\nCity: ${article.city || 'N/A'}\nEvent Date: ${article.articleDate ? new Date(article.articleDate).toLocaleDateString() : 'N/A'}\n\nGenerated: ${article.date}\nAuthor: ${article.author}\n\n${article.content}`;
        const blob = new Blob([contentStr], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Magazine_Article_${article.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isAuthorized) {
        return <div className="text-white p-8">Unauthorized access to Magazine creation.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3 text-glow">
                        <FileBadge className="text-luxury-gold" size={32} />
                        <span>Department Magazine Generator</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generator Form */}
                <div className="glass-card p-6 rounded-[2rem] border border-glass-border shadow-glass-card h-fit">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                        <PlusCircle className="text-emerald-glow" size={24} />
                        <span>New Edition</span>
                    </h2>
                    <form onSubmit={handleGenerate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                <ImageIcon size={18} /> <span>Event Photo</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files[0])}
                                className="w-full bg-slate-900 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-luxury-gold/20 file:text-luxury-gold hover:file:bg-luxury-gold/30 rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                <FileBadge size={18} /> <span>Template Style</span>
                            </label>
                            <select
                                value={templateType}
                                onChange={e => setTemplateType(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:ring-1 focus:ring-luxury-gold outline-none"
                            >
                                <option value="template1">Layout 1 (Short & Sweet - Split)</option>
                                <option value="template2">Layout 2 (Professional - Full Width)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                <Upload size={18} /> <span>Upload Template (Optional)</span>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.docx,.pptx"
                                onChange={e => setTemplateFile(e.target.files[0])}
                                className="w-full bg-slate-900 border border-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-electric-blue/20 file:text-electric-blue hover:file:bg-electric-blue/30 rounded-xl"
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <h3 className="text-luxury-gold font-bold text-sm tracking-wide uppercase">Article Content</h3>
                            <div className="space-y-2">
                                <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Title</label>
                                <input required type="text" placeholder="Enter article title" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Topic</label>
                                    <input required type="text" placeholder="Enter your topic here" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={topic} onChange={e => setTopic(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">College Name</label>
                                    <input required type="text" placeholder="Enter college name" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={collegeName} onChange={e => setCollegeName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Department</label>
                                    <input required type="text" placeholder="Enter department name" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={department} onChange={e => setDepartment(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">City</label>
                                    <input required type="text" placeholder="Enter city" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={city} onChange={e => setCity(e.target.value)} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Date</label>
                                    <input required type="date" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-slate-400 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Content</label>
                                <textarea required rows={5} placeholder="Write your article content here..." className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none resize-y" value={content} onChange={e => setContent(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-luxury-gold to-yellow-500 rounded-xl font-black text-slate-900 flex items-center justify-center space-x-2 shadow-glow-gold hover:scale-[1.02] transition-transform">
                            <Upload size={20} />
                            <span>Publish Article</span>
                        </button>
                    </form>
                </div>

                {/* Magazine Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Generated Magazine Content</h2>
                    <AnimatePresence>
                        {magazine.length === 0 ? (
                            <div className="text-center p-12 glass-card rounded-[2rem] border border-glass-border text-slate-500">
                                No articles generated yet.
                            </div>
                        ) : (
                            magazine.map((article) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative group w-full max-w-[850px] mx-auto mb-16 overflow-hidden rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                                >
                                    {/* Transparent Action Bar on Hover */}
                                    <div className="absolute top-4 right-4 z-50 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={() => downloadArticle(article)} className="p-2.5 bg-slate-900/80 text-white rounded-full hover:bg-luxury-gold hover:text-slate-900 transition-colors shadow-lg backdrop-blur-md" title="Download Article">
                                            <Download size={18} />
                                        </button>
                                        {editingId === article.id ? (
                                            <button onClick={() => handleEditSave(article.id)} className="p-2.5 bg-emerald-500/80 text-white rounded-full hover:bg-emerald-400 transition-colors shadow-lg backdrop-blur-md">
                                                <CheckCircle size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => { setEditingId(article.id); setEditContent(article.content); }} className="p-2.5 bg-slate-900/80 text-white rounded-full hover:bg-electric-blue transition-colors shadow-lg backdrop-blur-md">
                                                <Edit3 size={18} />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(article.id)} className="p-2.5 bg-rose-500/80 text-white rounded-full hover:bg-rose-400 transition-colors shadow-lg backdrop-blur-md">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Custom Magazine Page Body */}
                                    <div className="bg-[#1a6b82] p-8 md:p-12 relative flex flex-col h-full min-h-[900px]">

                                        {/* Subtle texture overlay */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

                                        {/* Top Image & Title Banner */}
                                        <div className="relative bg-white pt-2.5 px-2.5 pb-8 md:pt-4 md:px-4 md:pb-10 shadow-2xl mb-12 transform -rotate-1 hover:rotate-0 transition-transform duration-500 z-10 w-[95%] mx-auto">
                                            <div className="relative overflow-hidden w-full flex justify-center items-center">
                                                <img src={article.image} alt={article.title} className="w-full h-auto max-h-[700px] object-contain md:object-cover transform hover:scale-105 transition-transform duration-[2000ms]" />
                                            </div>

                                            {/* Stylized Floating Title Wrapper */}
                                            <div className="absolute -top-4 right-0 md:top-6 md:-right-8 bg-white/95 px-8 py-4 shadow-2xl backdrop-blur-sm z-20" style={{ borderBottom: '6px solid #1a6b82' }}>
                                                <h3 className="text-4xl md:text-6xl text-[#0d3440] font-bold" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                                    {article.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Article Typography Below */}
                                        {editingId === article.id ? (
                                            <textarea
                                                className="w-full flex-1 bg-white/10 border border-white/20 rounded-xl p-6 text-slate-100 focus:outline-none transition-shadow min-h-[450px] relative z-10"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', lineHeight: '1.8' }}
                                            />
                                        ) : (
                                            <div className="px-4 md:px-10 relative z-10 text-[#d8eff5]">
                                                {(article.topic || article.collegeName || article.department || article.city || article.articleDate) && (
                                                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm mb-6 pb-6 border-b border-[#d8eff5]/20 opacity-90" style={{ fontFamily: '"Playfair Display", serif' }}>
                                                        {article.topic && <div><strong className="text-white">Topic:</strong> {article.topic}</div>}
                                                        {article.collegeName && <div><strong className="text-white">College:</strong> {article.collegeName}</div>}
                                                        {article.department && <div><strong className="text-white">Department:</strong> {article.department}</div>}
                                                        {article.city && <div><strong className="text-white">City:</strong> {article.city}</div>}
                                                        {article.articleDate && <div><strong className="text-white">Date:</strong> {new Date(article.articleDate).toLocaleDateString()}</div>}
                                                    </div>
                                                )}
                                                <div className="space-y-6" style={{ fontFamily: '"Playfair Display", serif', fontSize: '0.95rem', lineHeight: '1.9', textAlign: 'justify' }}>
                                                    {article.content.split('\n').map((para, i) => {
                                                        if (!para.trim()) return null;
                                                        return <p key={i}>{para}</p>;
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-10 px-4 md:px-10 flex flex-wrap gap-2 relative z-10">
                                            {article.templateFile && (
                                                <span className="px-4 py-1.5 bg-white/20 text-white rounded font-bold text-xs flex items-center space-x-2 shadow-lg backdrop-blur-sm">
                                                    <FileBadge size={14} /> <span>{article.templateFile}</span>
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Magazine;
