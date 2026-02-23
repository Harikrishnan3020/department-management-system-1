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
    const [templateLink, setTemplateLink] = useState('');
    const [description, setDescription] = useState('');

    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!description) return;

        // Auto-generate magazine content from description (mock)
        const generatedTitle = "Event Highlights: " + description.split(' ').slice(0, 3).join(' ') + "...";
        const generatedContent = `[Generated Magazine Article]\n\nRecently, we celebrated a remarkable event showcasing outstanding student achievements. ${description} This milestone highlights our department's commitment to excellence and continuous growth.`;

        const newEntry = {
            id: Date.now(),
            title: generatedTitle,
            content: generatedContent,
            image: file ? URL.createObjectURL(file) : 'https://picsum.photos/600/400',
            templateLink: templateLink || null,
            templateFile: templateFile ? templateFile.name : null,
            date: new Date().toLocaleDateString(),
            author: currentUser.name
        };

        setMagazine(prev => [newEntry, ...prev]);
        setFile(null);
        setTemplateFile(null);
        setTemplateLink('');
        setDescription('');
    };

    const handleEditSave = (id) => {
        setMagazine(prev => prev.map(m => m.id === id ? { ...m, content: editContent } : m));
        setEditingId(null);
    };

    const handleDelete = (id) => {
        setMagazine(prev => prev.filter(m => m.id !== id));
    };

    const downloadArticle = (article) => {
        const content = `${article.title}\n\nDate: ${article.date}\nAuthor: ${article.author}\n\n${article.content}\n\n${article.templateLink ? `Template Link: ${article.templateLink}` : ''}`;
        const blob = new Blob([content], { type: 'text/plain' });
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
                                <LinkIcon size={18} /> <span>Template Link (Optional)</span>
                            </label>
                            <input
                                type="url"
                                placeholder="https://canva.com/..."
                                value={templateLink}
                                onChange={e => setTemplateLink(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold/50 focus:border-luxury-gold/50 transition-all outline-none"
                            />
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

                        <div className="space-y-2">
                            <label className="text-slate-300 font-semibold flex items-center space-x-2">
                                <Edit3 size={18} /> <span>Event Description</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Describe the student achievement, hackathon win, or event..."
                                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold/50 focus:border-luxury-gold/50 transition-all outline-none"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-luxury-gold to-yellow-500 rounded-xl font-black text-slate-900 flex items-center justify-center space-x-2 shadow-glow-gold hover:scale-[1.02] transition-transform">
                            <Upload size={20} />
                            <span>Generate Article</span>
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
                                    className="glass-card p-6 rounded-[2rem] border border-glass-border shadow-glass-card group flex flex-col sm:flex-row gap-6 relative"
                                >
                                    <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-slate-900 rounded-xl overflow-hidden border border-white/10 relative">
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2 pr-8">
                                            <h3 className="text-xl font-black text-white">{article.title}</h3>
                                            <div className="flex space-x-2 absolute top-6 right-6">
                                                <button onClick={() => downloadArticle(article)} className="text-luxury-gold hover:text-white transition-colors bg-luxury-gold/10 p-2 rounded-lg" title="Download Article">
                                                    <Download size={18} />
                                                </button>
                                                {editingId === article.id ? (
                                                    <button onClick={() => handleEditSave(article.id)} className="text-emerald-glow hover:text-white transition-colors bg-emerald-glow/10 p-2 rounded-lg">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => { setEditingId(article.id); setEditContent(article.content); }} className="text-slate-400 hover:text-electric-blue transition-colors bg-slate-800 p-2 rounded-lg group-hover:bg-white/10">
                                                        <Edit3 size={18} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(article.id)} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-800 p-2 rounded-lg group-hover:bg-white/10">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 font-bold tracking-wider uppercase mb-4">
                                            {article.date} &bull; Admin / Faculty &bull; Published
                                        </div>

                                        {editingId === article.id ? (
                                            <textarea
                                                className="w-full flex-1 bg-slate-900 border border-electric-blue/50 rounded-xl p-3 text-slate-300 font-medium leading-relaxed focus:outline-none focus:shadow-glow-blue transition-shadow mt-2"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={5}
                                            />
                                        ) : (
                                            <div className="flex-1 flex flex-col">
                                                <p className="text-slate-400 font-medium leading-relaxed whitespace-pre-wrap flex-1">
                                                    {article.content}
                                                </p>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {article.templateLink && (
                                                        <a href={article.templateLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-royal-purple/20 text-royal-purple rounded font-bold text-xs flex items-center space-x-1 hover:bg-royal-purple/30">
                                                            <LinkIcon size={12} /> <span>External Template Link</span>
                                                        </a>
                                                    )}
                                                    {article.templateFile && (
                                                        <span className="px-3 py-1 bg-electric-blue/20 text-electric-blue rounded font-bold text-xs flex items-center space-x-1">
                                                            <FileBadge size={12} /> <span>{article.templateFile}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
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
