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
    const [templateType, setTemplateType] = useState('template1');
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
        if (!topic || !collegeName || !department || !city || !date) return;

        // Extract a headline from the topic
        const generatedTitle = topic.split(' ').slice(0, 8).join(' ');

        const generatedContent = `${generatedTitle}

By Student Editor, B.Tech
${city}, ${new Date(date).toLocaleDateString()}:

The recent focus on ${topic} has brought widespread attention across the ${department} this week. Hosted at the main campus venues of ${collegeName}, this initiative engaged key faculty and enthusiastic students aiming to bridge the gap between theory and practical application. Understanding this subject is crucial now due to the rapid shifts in modern technology and industry demands, making this gathering both timely and highly relevant.

Throughout the central proceedings, participants were introduced to detailed frameworks and immersive scenarios that challenged their existing skill sets. The comprehensive explanation provided by the experts broke down complex topics into digestible components, allowing students to systematically build their proficiency. This rigorous approach ensured that everyone could actively participate and gain substantial knowledge.

A major highlight of the event was the interactive showcase where several standout projects were unveiled. "Seeing such innovative solutions developed in such a short timeframe is nothing short of spectacular," noted one of the judging panel members. These highlights reinforced the positive atmosphere, encouraging participants to step forward and present their ideas gracefully.

The immediate impact of these sessions is evident as students begin integrating these new methodologies into their academic coursework. The primary outcome has been a noticeable increase in collaborative projects and a renewed vigor for research-based learning. Furthermore, several of the prototypes developed during this period are already being refined further.

In conclusion, the success of this initiative has set an inspiring precedent for our college's academic calendar. Future plans involve expanding this single event into a broader festival of innovation, incorporating more diverse fields of study. Our commitment to empowering students through practical experiences continues to be a driving force.`;

        const newEntry = {
            id: Date.now(),
            title: generatedTitle,
            content: generatedContent,
            image: file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
            templateLink: templateLink || null,
            templateFile: templateFile ? templateFile.name : null,
            templateType: templateType,
            date: new Date().toLocaleDateString(),
            author: currentUser.name
        };

        setMagazine(prev => [newEntry, ...prev]);
        setFile(null);
        setTemplateFile(null);
        setTemplateLink('');
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

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <h3 className="text-luxury-gold font-bold text-sm tracking-wide uppercase">Article Information</h3>
                            <div className="space-y-2">
                                <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Topic</label>
                                <input required type="text" placeholder="Enter your topic here" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={topic} onChange={e => setTopic(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">College Name</label>
                                    <input required type="text" placeholder="Enter college name" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={collegeName} onChange={e => setCollegeName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Department</label>
                                    <input required type="text" placeholder="Enter department name" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={department} onChange={e => setDepartment(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">City</label>
                                    <input required type="text" placeholder="Enter city" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={city} onChange={e => setCity(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-300 font-semibold text-xs flex items-center mb-1">Date</label>
                                    <input required type="date" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-slate-400 font-medium focus:ring-1 focus:ring-luxury-gold outline-none" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                            </div>
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
                                    className={`glass-card p-6 rounded-[2rem] border border-glass-border shadow-glass-card group flex ${article.templateType === 'template2' ? 'flex-col' : 'flex-col md:flex-row'} gap-8 relative`}
                                >
                                    <div className={`w-full ${article.templateType === 'template2' ? 'h-80' : 'sm:w-2/5 aspect-[4/3]'} bg-slate-900 rounded-xl overflow-hidden border border-white/10 relative shrink-0`}>
                                        <img src={article.image} alt={article.title} className="w-full h-full object-contain bg-black/40 group-hover:scale-105 transition-transform duration-700" />
                                        {article.templateType === 'template2' && (
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent p-6 pt-12">
                                                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight font-serif drop-shadow-lg">{article.title}</h3>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col w-full">
                                        <div className="flex justify-between items-start mb-2 pr-8 relative">
                                            {article.templateType !== 'template2' && (
                                                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight font-serif mb-2">{article.title}</h3>
                                            )}
                                            <div className="flex space-x-2 absolute top-0 right-0">
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
                                        <div className="text-xs text-luxury-gold font-bold tracking-wider uppercase mb-6 pb-2 border-b border-white/10">
                                            {article.date} &bull; Admin / Faculty &bull; Published
                                        </div>

                                        {editingId === article.id ? (
                                            <textarea
                                                className="w-full flex-1 bg-slate-900 border border-electric-blue/50 rounded-xl p-3 text-slate-300 font-serif leading-relaxed focus:outline-none focus:shadow-glow-blue transition-shadow mt-2"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                rows={15}
                                                style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '16px', lineHeight: '1.5' }}
                                            />
                                        ) : (
                                            <div className="flex-1 flex flex-col">
                                                <p
                                                    className="text-slate-200 leading-relaxed whitespace-pre-wrap flex-1"
                                                    style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '16px', lineHeight: '1.5' }}
                                                >
                                                    {article.content}
                                                </p>
                                                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/10">
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
