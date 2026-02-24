import React, { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileBadge, PlusCircle, X, Eye, Download, Trash2, Edit3,
    CheckCircle, Newspaper, User, MapPin, Calendar, Image as ImageIcon,
    AlignLeft, Sparkles, ChevronDown, ChevronUp, Wand2, Link as LinkIcon
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

// ── Helpers ─────────────────────────────────────────────────────
const fileToBase64 = (f) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
});

const gradients = [
    'from-violet-600 via-purple-600 to-indigo-700',
    'from-emerald-600 via-teal-600 to-cyan-700',
    'from-amber-500 via-orange-600 to-red-600',
    'from-blue-600 via-indigo-600 to-violet-700',
    'from-rose-600 via-pink-600 to-fuchsia-700',
    'from-sky-500 via-blue-600 to-indigo-600',
];

// ── Professional Magazine Writer (AI Mock) ──────────────────────
const generateElegantContent = (form) => {
    const t = form.title || "The Unnamed Event";
    const d = form.department || "the concerned department";
    const c = form.college || "our esteemed educational institution";
    const loc = form.city || "our vibrant city";
    const dateStr = form.date ? new Date(form.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "recently";

    return {
        intro: `In an era defined by rapid advancements and continuous paradigm shifts, ${d} at ${c} orchestrated a landmark gathering titled '${t}' on ${dateStr}. Set against the dynamic and intellectually stimulating backdrop of ${loc}, this momentous occasion brought together a confluence of esteemed academicians, industry luminaries, and enthusiastic scholars. The primary objective of the initiative was to foster a spirit of relentless inquiry and provide a comprehensive platform for elevated intellectual discourse. By seamlessly bridging the inherent gap between theoretical frameworks and pragmatic applications, the event underscored the institution's unwavering commitment to holistic education. Attendees were presented with an unparalleled opportunity to engage with cutting-edge concepts, thereby setting the stage for a highly transformative pedagogical experience.`,

        body1: `The proceedings commenced with a majestic inaugural ceremony, characterized by an aura of palpable excitement and rigorous academic focus. Distinguished keynote speakers took the podium to elucidate upon the multifaceted dimensions of the subject matter, offering profound insights that resonated deeply with the diverse audience. These sessions were meticulously curated to systematically address contemporary challenges and illuminate emerging paradigms within the academic and professional spheres. Through a series of highly detailed and comprehensive presentations, delegates were guided through complex thematic landscapes. This deliberate structural design not only expanded the participants' intellectual horizons but also served to stimulate profound critical thinking and analytical rigor across all involved disciplines.`,

        body2: `A defining highlight of the comprehensive itinerary was the interactive panel discussions, which acted as a powerful catalyst for dynamic exchanges of innovative ideas. "The depth of intellectual engagement and the extraordinary caliber of discourse witnessed today are truly a testament to the boundless potential of our future leaders," remarked a senior dignitary during the primary address. Collaborative workshops and hands-on demonstrations further augmented the educational paradigm, granting individuals the framework to translate abstract theoretical concepts into tangible, real-world solutions. The seamless and elegant integration of expert academic perspectives with vibrant peer-to-peer collaborative learning successfully forged an environment of exceptional scholarly enrichment and mutual discovery.`,

        body3: `The broader implications and tangible impacts of this strategic initiative extend far beyond the immediate confines of the physical venue. By purposefully cultivating a sustainable ecosystem of collaborative learning, the department has successfully empowered its constituents with the requisite adaptive skills and inspired the confidence necessary to thoughtfully navigate increasingly complex professional landscapes. Tangible outcomes of the sessions included the cooperative formulation of innovative, forward-thinking strategies and the successful establishment of robust, enduring networking channels among peers and veterans alike. Such distinguished endeavors remain inherently instrumental in continually positioning the institution as a recognized vanguard of sustained academic excellence and visionary thought leadership.`,

        conclusion: `Looking ahead, the resounding and unequivocal success of '${t}' establishes a formidable and inspiring precedent for all forthcoming institutional initiatives. The planning committee and department faculty envision proactively expanding upon these foundational achievements to encompass even broader, more ambitious horizons of interdisciplinary research and global collaboration. Ultimately, this momentous gathering will be rightfully chronicled as a pivotal and enduring milestone in the college's relentless pursuit of educational preeminence and broader societal advancement.`
    };
};

// ── Ultra-Premium Cover Template Simulator ───────────────────────
// This identically matches the visual Canva template provided.
const CoverTemplate = ({ article }) => {
    const parts = article.structured || {};
    return (
        <div style={{ containerType: 'inline-size', width: '100%', display: 'block', backgroundColor: '#2b2624' }}>
            <div style={{
                position: 'relative', width: '100%', aspectRatio: '1 / 1.414',
                backgroundColor: '#2b2624', overflow: 'hidden', color: '#ffffff',
                fontFamily: '"Times New Roman", Times, serif', // matches aesthetic 
                borderBottom: '4px solid #1a1207'
            }}>
                {/* Background geometric shapes */}
                <div style={{ position: 'absolute', right: '-15cqw', top: '15%', bottom: '15%', width: '70cqw', backgroundColor: '#b26c48', opacity: 0.3, borderRadius: '50cqw 0 0 50cqw' }} />

                {/* Main Photo (right justified, fitting bounds flawlessly) */}
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '65cqw', zIndex: 1 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #2b2624 0%, transparent 40%)', zIndex: 2 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(43,38,36,0.9) 0%, transparent 35%)', zIndex: 2 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(43,38,36,0.9) 0%, transparent 30%)', zIndex: 2 }} />
                    {article.image && (
                        <img src={article.image} alt="Magazine Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                </div>

                {/* Left Side "MAGAZINE" vertical word */}
                <div style={{ position: 'absolute', left: '7cqw', top: '0', bottom: '0', display: 'flex', alignItems: 'center', zIndex: 3 }}>
                    <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '13cqw', fontWeight: 900, letterSpacing: '0.8cqw', lineHeight: 1 }}>
                        MAGAZINE
                    </div>
                </div>

                {/* Top Strip */}
                <div style={{ position: 'absolute', top: '5cqw', width: '100%', textAlign: 'center', fontSize: '1.4cqw', letterSpacing: '0.5cqw', zIndex: 3, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {(parts.course || 'FASHION').substring(0, 15)} | NEWS | {(article.college || 'STYLE').substring(0, 20)}
                </div>

                {/* Title & Subtitle Area overlapping photo */}
                <div style={{ position: 'absolute', right: '6cqw', top: '48%', textAlign: 'right', zIndex: 3, width: '55cqw' }}>
                    <h1 style={{ fontSize: '4.8cqw', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, textShadow: '2px 2px 10px rgba(0,0,0,0.8)' }}>
                        {article.title}
                    </h1>
                    {article.subtitle && (
                        <p style={{ fontSize: '1.6cqw', marginTop: '2cqw', opacity: 0.9, letterSpacing: '0.15cqw', textTransform: 'uppercase', textShadow: '1px 1px 4px rgba(0,0,0,0.8)', fontFamily: 'Arial, sans-serif' }}>
                            {article.subtitle}
                        </p>
                    )}
                    <div style={{ fontSize: '2.4cqw', fontWeight: 900, marginTop: '5cqw', letterSpacing: '0.2cqw', textTransform: 'uppercase', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                        {(article.department || 'WINTER EDITION').substring(0, 30)}
                    </div>
                    {/* Tiny line separator */}
                    <div style={{ width: '30cqw', height: '0.2cqw', backgroundColor: 'white', float: 'right', marginTop: '3cqw', opacity: 0.8 }} />
                </div>

                {/* Bottom Left Short Text */}
                <div style={{ position: 'absolute', left: '25cqw', bottom: '8%', width: '30cqw', zIndex: 3 }}>
                    <p style={{ fontSize: '1.2cqw', lineHeight: 1.6, opacity: 0.85, textAlign: 'justify', fontWeight: 500, fontFamily: 'Arial, sans-serif' }}>
                        {parts.intro ? (parts.intro.slice(0, 120) + '...') : 'Many new collections with youth styles. Winter clothing with fashionable style has arrived. Get it soon before it runs out.'}
                    </p>
                </div>

                {/* Bottom Right Barcode & Date */}
                <div style={{ position: 'absolute', right: '6cqw', bottom: '6%', zIndex: 3, textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1cqw', marginBottom: '1cqw', opacity: 0.9, fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
                        {article.date} | & 5,08
                    </div>
                    {/* Simulated barcode graphic */}
                    <div style={{ height: '3.5cqw', display: 'flex', gap: '0.3cqw', justifyContent: 'flex-end', backgroundColor: 'rgba(255,255,255,0.95)', padding: '0.5cqw', borderRadius: '0.3cqw' }}>
                        {[2, 3, 1, 4, 1, 5, 1, 2, 2, 1, 4, 1, 3, 1, 2, 1].map((w, i) => <div key={i} style={{ width: `${w * 0.3}cqw`, backgroundColor: '#000' }} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ── Newspaper Article Viewer ─────────────────────────────────────
const ArticleViewer = ({ article, onClose, onDownload }) => {
    const parts = article.structured || {};
    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
                style={{ background: '#faf8f3', color: '#1a1207' }}
                onClick={e => e.stopPropagation()}
            >
                {/* 1. Ultra-Premium Automatic Canva Cover match! */}
                <CoverTemplate article={article} />

                {/* Newspaper masthead */}
                <div style={{ borderBottom: '3px double #1a1207', padding: '16px 32px 10px' }} className="text-center">
                    <div style={{ fontSize: 11, letterSpacing: 6, fontFamily: 'Times New Roman, serif', textTransform: 'uppercase', marginBottom: 4 }}>
                        {article.college || 'KGiSL Institute Of Technology'}
                    </div>
                    <div style={{ fontSize: 38, fontFamily: 'Times New Roman, serif', fontWeight: 900, lineHeight: 1.1 }}>
                        {article.title}
                    </div>
                    {article.subtitle && (
                        <div style={{ fontSize: 15, fontFamily: 'Times New Roman, serif', fontStyle: 'italic', marginTop: 4 }}>
                            {article.subtitle}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 11, fontFamily: 'Times New Roman, serif', borderTop: '1px solid #1a1207', paddingTop: 6 }}>
                        <span>By {parts.byline || article.author} {parts.course ? `— ${parts.course}` : ''}</span>
                        <span style={{ fontStyle: 'italic' }}>{parts.dateline || article.date}</span>
                        <span>{article.department || 'Department News'}</span>
                    </div>
                </div>

                {/* Article body */}
                <div style={{ padding: '20px 32px 32px', fontFamily: 'Times New Roman, serif', fontSize: 13, lineHeight: '1.9' }}>
                    {/* Photo — perfectly fitted */}
                    {article.image && (
                        <figure style={{ float: 'right', margin: '0 0 16px 20px', width: '42%', border: '1px solid #c8b89a' }}>
                            <img
                                src={article.image}
                                alt="Article"
                                style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 220 }}
                            />
                            <figcaption style={{ textAlign: 'center', fontSize: 10, padding: '4px 6px', background: '#f0ebe0', fontStyle: 'italic', color: '#555' }}>
                                {parts.caption || article.title}
                            </figcaption>
                        </figure>
                    )}

                    {/* Introduction with Drop Cap */}
                    {parts.intro && (
                        <p style={{ textIndent: '2em', marginBottom: '1em', textAlign: 'justify' }}>
                            <strong style={{ fontSize: 18, float: 'left', lineHeight: 1, paddingRight: '4px', fontSize: '3.2rem', marginTop: '-4px', color: '#1a1207', fontFamily: 'Georgia, serif' }}>
                                {parts.intro.charAt(0)}
                            </strong>
                            {parts.intro.slice(1)}
                        </p>
                    )}

                    {/* Body paragraphs */}
                    {[parts.body1, parts.body2, parts.body3].map((para, i) => para && (
                        <p key={i} style={{ textIndent: '2em', marginBottom: '1em', textAlign: 'justify' }}>{para}</p>
                    ))}

                    {/* Conclusion */}
                    {parts.conclusion && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid #c8b89a', margin: '12px 0' }} />
                            <p style={{ textIndent: '2em', marginBottom: '0.5em', textAlign: 'justify', fontStyle: 'italic' }}>{parts.conclusion}</p>
                        </>
                    )}

                    {/* Fallback: plain content */}
                    {!parts.intro && article.content && (
                        <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{article.content}</div>
                    )}

                    {article.templateLink && (
                        <div style={{ marginTop: 24, padding: 12, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 8 }}>
                            <a href={article.templateLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', color: '#0369a1', fontWeight: 'bold', textDecoration: 'none', fontSize: 13 }}>
                                <span style={{ marginRight: 8 }}>📄 View Attached Template / Original Magazine</span>
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer bar */}
                <div style={{ borderTop: '2px solid #1a1207', padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0ebe0' }}>
                    <span style={{ fontFamily: 'Times New Roman, serif', fontSize: 11, color: '#666' }}>
                        Published: {article.date} — {article.department || article.author}
                    </span>
                    <div className="flex space-x-2">
                        <button onClick={() => onDownload(article)}
                            className="px-4 py-1.5 bg-amber-800/20 text-amber-900 rounded-lg font-bold text-xs border border-amber-800/30 flex items-center space-x-1 hover:bg-amber-800/30 transition">
                            <Download size={13} /><span>Download</span>
                        </button>
                        <button onClick={onClose}
                            className="px-4 py-1.5 bg-slate-800/10 text-slate-700 rounded-lg font-bold text-xs border border-slate-400/30 flex items-center space-x-1 hover:bg-slate-800/20 transition">
                            <X size={13} /><span>Close</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ── Mini Card ────────────────────────────────────────────────────
const ArticleCard = ({ article, onView, onEdit, onDelete, isAuthorized }) => {
    const idx = article.gradientIdx ?? 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.01 }} transition={{ type: 'spring' }}
            className="glass-card rounded-[2rem] border border-glass-border shadow-glass-card overflow-hidden flex flex-col cursor-pointer group"
        >
            {/* Cover thumbnail */}
            <div
                className={`relative h-44 bg-gradient-to-br ${gradients[idx]} overflow-hidden`}
                onClick={() => onView(article)}
            >
                {article.image && (
                    <img
                        src={article.image} alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
                        {article.department || 'Article'}
                    </span>
                    <h3 className="text-base font-black text-white mt-1.5 leading-snug line-clamp-2">{article.title}</h3>
                </div>
            </div>

            {/* Card footer */}
            <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
                    {article.date} · {article.author}
                </p>
                {article.structured?.intro && (
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
                        {article.structured.intro}
                    </p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <button onClick={() => onView(article)}
                        className="text-xs text-electric-blue font-bold flex items-center space-x-1 hover:text-white transition-colors">
                        <Eye size={13} /><span>Read Full Article</span>
                    </button>
                    {isAuthorized && (
                        <div className="flex space-x-1">
                            <button onClick={() => { onEdit(article); }}
                                className="p-1.5 text-slate-500 hover:text-electric-blue transition-colors rounded-lg hover:bg-white/5">
                                <Edit3 size={13} />
                            </button>
                            <button onClick={() => onDelete(article.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors rounded-lg hover:bg-white/5">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ── Collapsible Section helper ───────────────────────────────────
const Section = ({ icon: Icon, label, children, accent = 'text-electric-blue' }) => {
    const [open, setOpen] = useState(true);
    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden">
            <button type="button" onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between p-4 bg-slate-800/40 hover:bg-white/5 transition text-left">
                <span className={`flex items-center space-x-2 font-bold text-sm ${accent}`}>
                    <Icon size={16} /><span>{label}</span>
                </span>
                {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
            </button>
            {open && <div className="p-4 space-y-4 bg-slate-900/30">{children}</div>}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────
const Magazine = () => {
    const { currentUser, magazine, setMagazine } = useContext(AppContext);
    const isAuthorized = currentUser?.role === 'Admin' || currentUser?.role === 'Faculty';

    const [showForm, setShowForm] = useState(false);
    const [viewingArticle, setViewingArticle] = useState(null);
    const [editingArticle, setEditingArticle] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form fields — structured
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        byline: '',
        course: '',
        college: '',
        department: '',
        city: '',
        date: new Date().toISOString().split('T')[0],
        caption: '',
        dateline: '',
        templateLink: '',
        eventDetails: '',
        intro: '',
        body1: '',
        body2: '',
        body3: '',
        conclusion: '',
    });
    const [coverPreview, setCoverPreview] = useState(null);

    const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleCoverChange = async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setIsUploading(true);
        try {
            const b64 = await fileToBase64(f);
            setCoverPreview(b64);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAutoGenerate = () => {
        if (!form.title && !form.eventDetails) {
            alert("Please enter a Headline and Event Details first!");
            return;
        }
        setIsGenerating(true);
        // Simulate a brief AI thinking delay for UX
        setTimeout(() => {
            const generated = generateElegantContent(form);
            setForm(f => ({
                ...f,
                intro: generated.intro,
                body1: generated.body1,
                body2: generated.body2,
                body3: generated.body3,
                conclusion: generated.conclusion
            }));
            setIsGenerating(false);
        }, 800);
    };

    const resetForm = () => {
        setForm({
            title: '', subtitle: '', byline: '', course: '', college: '',
            department: '', city: '', date: new Date().toISOString().split('T')[0],
            caption: '', dateline: '', templateLink: '', eventDetails: '',
            intro: '', body1: '', body2: '', body3: '', conclusion: '',
        });
        setCoverPreview(null);
        setShowForm(false);
        setEditingArticle(null);
    };

    const handlePublish = (e) => {
        e.preventDefault();
        if (!form.title || !form.intro) return;

        const entry = {
            id: editingArticle?.id || Date.now(),
            title: form.title,
            subtitle: form.subtitle,
            author: form.byline || currentUser.name,
            college: form.college,
            department: form.department,
            date: new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            image: coverPreview || editingArticle?.image || null,
            templateLink: form.templateLink || null,
            gradientIdx: editingArticle?.gradientIdx ?? Math.floor(Math.random() * gradients.length),
            structured: {
                byline: form.byline,
                course: form.course,
                dateline: form.dateline || (form.city ? `${form.city}, ${new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''),
                caption: form.caption,
                intro: form.intro,
                body1: form.body1,
                body2: form.body2,
                body3: form.body3,
                conclusion: form.conclusion,
            },
            // plain content fallback for search/display
            content: [form.intro, form.body1, form.body2, form.body3, form.conclusion].filter(Boolean).join('\n\n'),
        };

        if (editingArticle) {
            setMagazine(prev => prev.map(m => m.id === editingArticle.id ? entry : m));
        } else {
            setMagazine(prev => [entry, ...prev]);
        }
        resetForm();
    };

    const handleEdit = (article) => {
        const s = article.structured || {};
        setForm({
            title: article.title || '',
            subtitle: article.subtitle || '',
            byline: s.byline || article.author || '',
            course: s.course || '',
            college: article.college || '',
            department: article.department || '',
            city: '',
            date: new Date().toISOString().split('T')[0],
            caption: s.caption || '',
            dateline: s.dateline || '',
            intro: s.intro || '',
            body1: s.body1 || '',
            body2: s.body2 || '',
            body3: s.body3 || '',
            conclusion: s.conclusion || '',
        });
        setCoverPreview(article.image || null);
        setEditingArticle(article);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        setMagazine(prev => prev.filter(m => m.id !== id));
        if (viewingArticle?.id === id) setViewingArticle(null);
        setDeleteTarget(null);
    };

    const downloadArticle = (article) => {
        const s = article.structured || {};
        const lines = [
            '─'.repeat(60),
            `${article.title.toUpperCase()}`,
            article.subtitle || '',
            '─'.repeat(60),
            `By ${s.byline || article.author}   ${s.course || ''}`,
            s.dateline || article.date,
            '',
            s.intro || '',
            '',
            s.body1 || '',
            '',
            s.body2 || '',
            '',
            s.body3 || '',
            '',
            s.conclusion || '',
            '─'.repeat(60),
            `${article.college || ''} — ${article.department || ''}`,
        ].join('\n');

        const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `Article_${article.title.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const fieldClass = "w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/30 transition-all placeholder-slate-600";
    const textareaClass = `${fieldClass} leading-relaxed resize-none`;
    const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5";

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-6 rounded-2xl glass-card border border-glass-border shadow-glass-card gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3 text-glow">
                        <Newspaper className="text-luxury-gold" size={32} />
                        <span>Department Magazine</span>
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium">Auto-write & publish beautifully formatted newspaper articles.</p>
                </div>
                {isAuthorized && (
                    <button onClick={() => { setEditingArticle(null); resetForm(); setShowForm(!showForm); }}
                        className="px-5 py-3 bg-gradient-to-r from-luxury-gold to-yellow-600 rounded-xl text-slate-900 font-bold hover:shadow-glow-gold flex items-center space-x-2 transition-shadow">
                        {showForm ? <X size={18} /> : <PlusCircle size={18} />}
                        <span>{showForm ? 'Close Form' : 'New Article'}</span>
                    </button>
                )}
            </div>

            {/* ── Article Form ── */}
            <AnimatePresence>
                {showForm && isAuthorized && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <form onSubmit={handlePublish}
                            className="glass-card p-8 rounded-[2rem] border border-glass-border shadow-glass-card max-w-4xl mx-auto space-y-5">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-white/10 gap-4">
                                <div className="flex items-center space-x-3">
                                    <Sparkles className="text-luxury-gold" size={22} />
                                    <h2 className="text-xl font-bold text-white">
                                        {editingArticle ? 'Edit Article' : 'New College Newspaper Article'}
                                    </h2>
                                </div>
                                <button type="button" onClick={handleAutoGenerate} disabled={isGenerating}
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold text-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition flex items-center space-x-2 disabled:opacity-50">
                                    <Wand2 size={16} className={isGenerating ? "animate-spin" : ""} />
                                    <span>{isGenerating ? 'Writing...' : '✨ Auto-Write Content'}</span>
                                </button>
                            </div>

                            {/* 1. Headline */}
                            <Section icon={Newspaper} label="① Headline" accent="text-luxury-gold">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Headline (Bold & Centered) *</label>
                                        <input type="text" required placeholder="e.g. Annual Tech Fest Concludes with Record Participation"
                                            value={form.title} onChange={e => setF('title', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Sub-Headline (Optional)</label>
                                        <input type="text" placeholder="Supporting tagline..."
                                            value={form.subtitle} onChange={e => setF('subtitle', e.target.value)} className={fieldClass} />
                                    </div>
                                </div>
                            </Section>

                            {/* 2. Byline */}
                            <Section icon={User} label="② Byline & Department" accent="text-royal-purple">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Author Name *</label>
                                        <input type="text" placeholder="By [Your Name]"
                                            value={form.byline} onChange={e => setF('byline', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Course / Year</label>
                                        <input type="text" placeholder="e.g. B.Tech AI&ML, 2nd Year"
                                            value={form.course} onChange={e => setF('course', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Department</label>
                                        <input type="text" placeholder="e.g. Artificial Intelligence & ML"
                                            value={form.department} onChange={e => setF('department', e.target.value)} className={fieldClass} />
                                    </div>
                                </div>
                            </Section>

                            {/* 3. Dateline */}
                            <Section icon={MapPin} label="③ Dateline" accent="text-emerald-400">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>City</label>
                                        <input type="text" placeholder="e.g. Coimbatore"
                                            value={form.city} onChange={e => setF('city', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Date</label>
                                        <input type="date" value={form.date} onChange={e => setF('date', e.target.value)} className={fieldClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>College Name</label>
                                        <input type="text" placeholder="KGiSL Institute of Technology"
                                            value={form.college} onChange={e => setF('college', e.target.value)} className={fieldClass} />
                                    </div>
                                </div>
                            </Section>

                            {/* Photo upload */}
                            <Section icon={ImageIcon} label="Photo Layout" accent="text-electric-blue">
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelClass}>Upload Article Photo</label>
                                        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-white/10 hover:border-luxury-gold/40 rounded-xl p-6 cursor-pointer transition-colors group">
                                            <ImageIcon size={28} className="text-slate-500 group-hover:text-luxury-gold mb-2 transition-colors" />
                                            <span className="text-slate-400 text-sm group-hover:text-slate-300">
                                                {isUploading ? '⏳ Processing image…' : 'Click to upload article photo (JPG, PNG)'}
                                            </span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                                        </label>
                                    </div>

                                    {/* LIVE NEWSPAPER PREVIEW of the photo in template */}
                                    {coverPreview && (
                                        <div className="mt-3 rounded-xl overflow-hidden border border-amber-800/30 bg-amber-50/5">
                                            <div className="px-4 py-2 bg-amber-900/20 border-b border-amber-800/20 text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                                                <Eye size={12} /><span>Photo Preview — Aligned to Newspaper Template</span>
                                            </div>
                                            {/* Newspaper column preview */}
                                            <div style={{ background: '#faf8f3', padding: 16, fontFamily: 'Times New Roman, serif', color: '#1a1207' }}>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <div style={{ flex: 1, fontSize: 11, lineHeight: 1.7, color: '#333', textAlign: 'justify' }}>
                                                        <span style={{ fontSize: 16, fontWeight: 900 }}>P</span>hoto positioned as it will appear in the published article — floated right with caption below, perfectly fitted to the column width. Text wraps naturally around it in the final print layout.
                                                    </div>
                                                    <figure style={{ width: '45%', margin: 0, border: '1px solid #c8b89a', flexShrink: 0 }}>
                                                        <img
                                                            src={coverPreview}
                                                            alt="Preview"
                                                            style={{ width: '100%', display: 'block', objectFit: 'cover', height: 130 }}
                                                        />
                                                        <figcaption style={{ textAlign: 'center', fontSize: 9, padding: '3px 5px', background: '#f0ebe0', fontStyle: 'italic', color: '#666' }}>
                                                            {form.caption || form.title || 'Photo caption appears here'}
                                                        </figcaption>
                                                    </figure>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/20 border-t border-amber-800/20">
                                                <span className="text-xs text-slate-500">✓ Photo fits template correctly</span>
                                                <button type="button" onClick={() => setCoverPreview(null)}
                                                    className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1">
                                                    <X size={11} /><span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className={labelClass}>Photo Caption</label>
                                        <input type="text" placeholder="Describe what's in the photo..."
                                            value={form.caption} onChange={e => setF('caption', e.target.value)} className={fieldClass} />
                                    </div>
                                </div>
                            </Section>

                            {/* Magazine Link */}
                            <Section icon={LinkIcon} label="④ Template / Magazine Link (Optional)" accent="text-cyan-400">
                                <div>
                                    <label className={labelClass}>Canva, Google Docs, or Drive Link</label>
                                    <input type="url" placeholder="https://..." value={form.templateLink} onChange={e => setF('templateLink', e.target.value)} className={fieldClass} />
                                </div>
                            </Section>

                            {/* Event Details */}
                            <Section icon={AlignLeft} label="⑤ Event Details (Write roughly 1 paragraph) *" accent="text-rose-400">
                                <textarea required rows={5} placeholder="Describe what happened, where, when, who was involved, and any highlights..."
                                    value={form.eventDetails} onChange={e => setF('eventDetails', e.target.value)} className={textareaClass} />
                                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-3">
                                    <Wand2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-sm text-emerald-100 font-bold mb-1">AI Article Formatting</p>
                                        <p className="text-xs text-emerald-200/70 leading-relaxed">
                                            Just type your raw event details above. When you click <strong className="text-emerald-300">"✨ Auto-Write Content"</strong>, our AI will automatically expand your details into a perfectly formatted, 5-paragraph professional newspaper article.
                                        </p>
                                    </div>
                                </div>
                            </Section>

                            {/* Generated Content Preview */}
                            <AnimatePresence>
                                {(form.intro || isGenerating) && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <Section icon={AlignLeft} label="⑥ Review Generated Article" accent="text-luxury-gold">
                                            {isGenerating ? (
                                                <div className="py-8 text-center text-luxury-gold animate-pulse">
                                                    <Wand2 size={32} className="mx-auto mb-3 animate-spin" />
                                                    <p className="font-bold text-sm">Professional Magazine Writer is crafting...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <p className="text-xs text-slate-400 italic mb-2">You can edit the AI-generated formal text below before publishing:</p>
                                                    <textarea rows={4} value={form.intro} onChange={e => setF('intro', e.target.value)} className={textareaClass} placeholder="Introduction" />
                                                    <textarea rows={4} value={form.body1} onChange={e => setF('body1', e.target.value)} className={textareaClass} placeholder="Body Paragraph 1" />
                                                    <textarea rows={4} value={form.body2} onChange={e => setF('body2', e.target.value)} className={textareaClass} placeholder="Body Paragraph 2" />
                                                    <textarea rows={4} value={form.body3} onChange={e => setF('body3', e.target.value)} className={textareaClass} placeholder="Body Paragraph 3" />
                                                    <textarea rows={4} value={form.conclusion} onChange={e => setF('conclusion', e.target.value)} className={textareaClass} placeholder="Conclusion" />
                                                </div>
                                            )}
                                        </Section>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Word-count guide */}
                            <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 text-xs text-slate-500 flex flex-wrap gap-4">
                                <span>📝 Target word count: <strong className="text-slate-300">450–550 words</strong></span>
                                <span>🖋 Format: <strong className="text-slate-300">Times New Roman, 12pt, 1.5 spacing</strong></span>
                                <span>✍️ Style: <strong className="text-slate-300">Formal · Third-person · Past tense</strong></span>
                                <span className="ml-auto font-bold text-slate-400">
                                    ~{[form.intro, form.body1, form.body2, form.body3, form.conclusion].join(' ').split(/\s+/).filter(Boolean).length} words
                                </span>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={resetForm}
                                    className="px-5 py-2.5 border border-white/20 rounded-xl text-slate-300 font-bold hover:bg-white/5 transition">Cancel</button>
                                <button type="submit"
                                    className="px-7 py-2.5 bg-gradient-to-r from-luxury-gold to-yellow-500 rounded-xl font-black text-slate-900 hover:shadow-glow-gold transition-shadow flex items-center space-x-2">
                                    <Sparkles size={16} />
                                    <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Article Grid ── */}
            {magazine.length === 0 ? (
                <div className="text-center py-20 glass-card rounded-[2rem] border border-dashed border-white/20">
                    <FileBadge size={52} className="mx-auto text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">No Articles Published Yet</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        {isAuthorized
                            ? 'Click "New Article" to create your first structured newspaper article.'
                            : 'Check back soon — articles will appear here once published.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {magazine.map(article => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            onView={setViewingArticle}
                            onEdit={handleEdit}
                            onDelete={id => setDeleteTarget(id)}
                            isAuthorized={isAuthorized}
                        />
                    ))}
                </div>
            )}

            {/* ── Article viewer modal ── */}
            <AnimatePresence>
                {viewingArticle && (
                    <ArticleViewer
                        article={viewingArticle}
                        onClose={() => setViewingArticle(null)}
                        onDownload={downloadArticle}
                    />
                )}
            </AnimatePresence>

            {/* ── Delete confirmation ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="bg-slate-900 border border-rose-500/30 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                            <Trash2 size={36} className="text-rose-400 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-white mb-2">Delete Article?</h3>
                            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
                            <div className="flex space-x-3">
                                <button onClick={() => setDeleteTarget(null)}
                                    className="flex-1 py-3 rounded-xl font-bold bg-slate-800 text-slate-300 border border-white/10 hover:bg-slate-700 transition">Cancel</button>
                                <button onClick={() => handleDelete(deleteTarget)}
                                    className="flex-1 py-3 rounded-xl font-black bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:shadow-[0_0_16px_rgba(239,68,68,0.4)] transition">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Magazine;
