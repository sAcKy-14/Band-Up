"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Bookmark,
  Brain,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  Home,
  Layers3,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { api, type LearningQueueItem, type ProgressResponse, type VocabularyWord } from "./lib/api";

const navigation = [
  { label: "Overview", icon: Home },
  { label: "Learn words", icon: BookOpen },
  { label: "Practice", icon: Brain },
  { label: "Weekly review", icon: Layers3 },
];

const categoryStyles: Record<string, { label: string; color: string }> = {
  academic: { label: "Academic", color: "lilac" },
  writing_task_1: { label: "Writing task 1", color: "mint" },
  writing_task_2: { label: "Writing task 2", color: "mint" },
  speaking: { label: "Speaking", color: "peach" },
  reading: { label: "Reading", color: "lilac" },
  listening: { label: "Listening", color: "peach" },
};

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [queue, setQueue] = useState<LearningQueueItem[]>([]);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [answering, setAnswering] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([api.vocabulary(controller.signal), api.today(controller.signal), api.progress(controller.signal)])
      .then(([vocabulary, today, learnerProgress]) => {
        setWords(vocabulary.items);
        setQueue(today.items);
        setProgress(learnerProgress);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(error instanceof Error ? error.message : "Could not load your learning data.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const wordMap = useMemo(() => new Map(words.map((item) => [item.id, item])), [words]);
  const queueWords = queue.map((item) => ({ item, word: wordMap.get(item.word.id) })).filter((entry): entry is { item: LearningQueueItem; word: VocabularyWord } => Boolean(entry.word));
  const current = queueWords[0]?.word;
  const categories = useMemo(() => Object.entries(categoryStyles).map(([key, value]) => {
    const count = words.filter((word) => word.category === key).length;
    return { ...value, count: `${count} ${count === 1 ? "word" : "words"}`, progress: words.length ? Math.round((count / words.length) * 100) : 0 };
  }).filter((category) => category.count.startsWith("0") === false), [words]);

  function startSession() {
    setActiveNav("Learn words");
    setToast(queue.length ? `Your learning session has ${queue.length} words ready ✨` : "You’re all caught up for now ✨");
    window.setTimeout(() => setToast(""), 2800);
  }

  function learnWord() {
    submitAnswer(true);
  }

  async function submitAnswer(recalled: boolean) {
    if (!current || answering) return;
    setAnswering(true);
    try {
      const result = await api.answer(current.id, recalled);
      const [updatedProgress, updatedQueue] = await Promise.all([api.progress(), api.today()]);
      setProgress(updatedProgress);
      setQueue(updatedQueue.items);
      setSaved(false);
      setToast(recalled ? `Saved. Next review: ${new Date(result.next_review_at).toLocaleDateString()}.` : "Thanks for checking in. This word will come back soon.");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Could not save your answer.");
    } finally {
      setAnswering(false);
      window.setTimeout(() => setToast(""), 3000);
    }
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <a className="brand" href="#home" aria-label="BandUp home">
          <span className="brand-mark"><AudioLines size={20} strokeWidth={2.4} /></span>
          <span>band<span className="brand-up">up</span><span className="brand-period">.</span></span>
        </a>

        <div className="workspace-label">YOUR LEARNING SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${activeNav === label ? "nav-active" : ""}`}
              key={label}
              onClick={() => { setActiveNav(label); setMenuOpen(false); }}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {label === "Learn words" && queue.length > 0 && <span className="nav-badge">{queue.length}</span>}
              {label === "Weekly review" && (progress?.words_due ?? 0) > 0 && <span className="nav-badge">{progress?.words_due}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-divider" />
        <div className="workspace-label category-label">YOUR COLLECTIONS <button aria-label="Add collection"><Plus size={15} /></button></div>
        <div className="collection-list">
          {categories.map((category) => (
            <button className="collection-item" key={category.label} onClick={() => setToast(`${category.label} collection selected`)}>
              <span className={`collection-dot dot-${category.color}`} />
              <span>{category.label}</span>
              <span className="collection-count">{category.count.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <div className="tip-icon"><Sparkles size={16} /></div>
          <p className="tip-eyebrow">A LITTLE REMINDER</p>
          <p className="tip-copy">Small steps every day add up to big progress.</p>
          <div className="tip-decoration">✳</div>
        </div>
        <button className="profile-button" onClick={() => setToast("Profile settings are coming soon.")}>
          <span className="avatar">S</span>
          <span className="profile-copy"><strong>Sam Taylor</strong><small>IELTS learner</small></span>
          <MoreHorizontal size={19} className="profile-more" />
        </button>
      </aside>

      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <section className="main-column" id="home">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>My learning</span><ChevronRight size={15} /><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <button className="search-button" onClick={() => setToast("Search your vocabulary collection.")}><Search size={17} /><span>Search words</span><kbd>⌘ K</kbd></button>
            <button className="streak-pill" onClick={() => setToast("You are on a 7-day learning streak!")}><Flame size={17} fill="currentColor" /><strong>7</strong><span>day streak</span></button>
            <button className="avatar top-avatar" aria-label="Open profile" onClick={() => setToast("Profile settings are coming soon.")}>S</button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="date-line"><span className="live-dot" /> {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</div>
              <h1>A little progress goes <span>a long way.</span></h1>
              <p className="welcome-subtitle">You’re building a brilliant vocabulary, one day at a time.</p>
            </div>
            <button className="primary-button" onClick={startSession}><Sparkles size={17} /> Start today’s session <ArrowRight size={17} /></button>
          </section>

          <section className="stat-grid" aria-label="Your learning statistics">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon stat-lilac"><BookOpen size={17} /></span><span className="stat-neutral">Personal library</span></div>
              <p className="stat-number">{progress?.words_learned ?? (loading ? "—" : 0)}</p><p className="stat-label">Words learned</p>
              <div className="stat-foot"><span>{progress?.words_reviewed_this_week ?? 0} this week</span><span className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon stat-peach"><Flame size={17} /></span><span className="stat-neutral">Learning streak</span></div>
              <p className="stat-number">{progress?.current_streak ?? (loading ? "—" : 0)} <span className="stat-unit">days</span></p><p className="stat-label">Current streak</p>
              <div className="stat-foot"><span>{progress?.words_mastered ?? 0} words mastered</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon stat-mint"><Target size={17} /></span><span className="stat-neutral">This week</span></div>
              <p className="stat-number">{progress?.words_reviewed_this_week ?? (loading ? "—" : 0)}</p><p className="stat-label">Words reviewed this week</p>
              <div className="goal-track"><span style={{ width: `${Math.min((progress?.words_reviewed_this_week ?? 0) / 25 * 100, 100)}%` }} /></div>
              <div className="goal-foot"><span>Goal: 25 words</span><span>{Math.max(25 - (progress?.words_reviewed_this_week ?? 0), 0)} to go</span></div>
            </article>
            <article className="stat-card xp-card">
              <div className="stat-top"><span className="stat-icon stat-blue"><Sparkles size={17} /></span><span className="level-pill">LEVEL {String(Math.floor((progress?.xp_total ?? 0) / 1000) + 1).padStart(2, "0")}</span></div>
              <p className="stat-number">{progress?.xp_total ?? (loading ? "—" : 0)}</p><p className="stat-label">Total experience points</p>
              <div className="xp-track"><span style={{ width: `${(progress?.xp_total ?? 0) % 1000 / 10}%` }} /></div>
              <div className="goal-foot"><span>{1000 - ((progress?.xp_total ?? 0) % 1000)} XP to next level</span><span>Level {Math.floor((progress?.xp_total ?? 0) / 1000) + 1}</span></div>
            </article>
          </section>

          <section className="content-grid">
            <div className="left-stack">
              {loadError && <div className="api-message api-error" role="alert">Couldn’t load BandUp data: {loadError}. Check that the backend is running and NEXT_PUBLIC_API_URL is correct. <button className="text-button" onClick={() => window.location.reload()}>Retry</button></div>}
              <article className="word-card">
                <div className="card-heading">
                  <div><p className="section-kicker"><span className="kicker-dot" /> TODAY’S WORD</p><p className="card-subtitle">{queueWords[0]?.item.state === "due" ? "A word ready for review" : "A new word to make yours"}</p></div>
                  <div className="word-controls"><span className="word-count">{queueWords.length ? `01 / ${String(queueWords.length).padStart(2, "0")}` : "— / —"}</span><button className="icon-button save-button" onClick={() => { setSaved(!saved); setToast(saved ? "Removed from saved words." : "Saved to your collection."); }} aria-label={saved ? "Remove saved word" : "Save word"}><Bookmark size={17} fill={saved ? "currentColor" : "none"} /></button><button className="icon-button" aria-label="More word options" onClick={() => setToast("More word actions are coming soon.")}><MoreHorizontal size={19} /></button></div>
                </div>
                {loading ? <div className="api-message">Loading your vocabulary and today’s queue…</div> : !current ? <div className="api-message">{words.length ? "You’ve finished today’s queue. Nice work!" : "No vocabulary is available yet. Add words to the backend library to get started."}</div> : <>
                  <div className="word-main">
                    <div className="word-title-row"><h2>{current.word}</h2><button className="audio-button" aria-label="Play pronunciation" onClick={() => setToast("Pronunciation audio is coming soon.")}><AudioLines size={18} /></button><span className="word-tag">{current.part_of_speech.toUpperCase()}</span></div>
                    <p className="pronunciation">{current.pronunciation ?? "Pronunciation unavailable"} <span>·</span> {current.difficulty}</p>
                    <p className="word-meaning">{current.definition}</p>
                    <div className="example-box"><span className="example-mark">“</span><p>{current.example}</p></div>
                    <div className="synonym-row"><span>SIMILAR WORDS</span>{current.synonyms.map((synonym) => <span className="synonym-chip" key={synonym}>{synonym}</span>)}</div>
                  </div>
                  <div className="word-card-footer"><span><Sparkles size={15} /> Part of <strong>{categoryStyles[current.category]?.label ?? current.category}</strong></span><div><button className="text-button answer-again" disabled={answering} onClick={() => submitAnswer(false)}>Need another look</button><button className="learn-button" disabled={answering} onClick={learnWord}><Check size={16} /> {answering ? "Saving…" : "I’ve got it"}</button></div></div>
                </>}
              </article>

              <article className="weekly-card">
                <div className="weekly-copy"><span className="weekly-icon"><Layers3 size={18} /></span><div><p className="section-kicker">YOUR REVIEW QUEUE</p><h3>{progress?.words_due ?? (loading ? "…" : 0)} {progress?.words_due === 1 ? "word is" : "words are"} ready for a revisit</h3><p>Keep the words you’ve learned fresh in your mind.</p></div></div>
                <div className="weekly-action"><button className="secondary-button" onClick={() => { setActiveNav("Weekly review"); setToast(`${queue.filter((item) => item.state === "due").length} review words are in today’s queue.`); }}>Review words <ArrowRight size={16} /></button></div>
              </article>
            </div>

            <div className="right-stack">
              <article className="goal-card">
                <div className="goal-heading"><div><p className="section-kicker">YOUR WEEKLY PROGRESS</p><p className="card-subtitle">Words reviewed this week</p></div><button className="icon-button" aria-label="Goal options" onClick={() => setToast("Daily goal settings are coming soon.")}><MoreHorizontal size={19} /></button></div>
                <div className="goal-progress-row"><div className="goal-ring" style={{ background: `conic-gradient(#8bc4a5 0% ${Math.min((progress?.words_reviewed_this_week ?? 0) / 25 * 100, 100)}%, #edf5f0 ${Math.min((progress?.words_reviewed_this_week ?? 0) / 25 * 100, 100)}% 100%)` }}><div><strong>{Math.round(Math.min((progress?.words_reviewed_this_week ?? 0) / 25 * 100, 100))}<span>%</span></strong><small>of 25 words</small></div></div><div className="goal-numbers"><strong>{progress?.words_reviewed_this_week ?? (loading ? "—" : 0)} <span>/ 25 words</span></strong><p>{progress?.words_due ?? 0} reviews due</p></div></div>
                <div className="chart-heading"><span>RECENT ACTIVITY</span><span>{progress?.recent_activity.reduce((sum, day) => sum + day.words_reviewed, 0) ?? 0} WORDS</span></div>
                <div className="bar-chart" aria-label="Recent words reviewed"><div className="chart-line"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>{Array.from({ length: 7 }, (_, index) => { const activity = progress?.recent_activity[index]; const reviewed = activity?.words_reviewed ?? 0; const day = activity ? new Date(`${activity.activity_date}T12:00:00`).toLocaleDateString(undefined, { weekday: "narrow" }) : "·"; return <div className="bar-column" key={activity?.activity_date ?? index}><div className="bar-track"><span className={index === 6 ? "bar-today" : ""} style={{ height: `${Math.min(reviewed / 5 * 100, 100)}%` }} /></div><small>{day}</small></div>; })}</div>
              </article>

              <article className="collections-card">
                <div className="collections-heading"><div><p className="section-kicker">YOUR COLLECTIONS</p><p className="card-subtitle">Learn with a little direction</p></div><button className="icon-button" aria-label="See all collections" onClick={() => setToast("All collections are coming soon.")}><ArrowUpRight size={17} /></button></div>
                <div className="category-list">{categories.map((category) => <button className="category-row" key={category.label} onClick={() => setToast(`${category.label}: ${category.count} in your collection`)}><span className={`category-icon cat-${category.color}`}>{category.label === "Academic" ? <BookOpen size={17} /> : category.label === "Speaking" ? <Headphones size={17} /> : <ArrowDownRight size={17} />}</span><span className="category-info"><strong>{category.label}</strong><small>{category.count}</small></span><span className="category-progress"><i style={{ width: `${category.progress}%` }} /></span><ChevronRight size={16} className="category-chevron" /></button>)}</div>
              </article>
            </div>
          </section>

          <footer className="page-footer"><span>Made for the words that take you further <span className="footer-star">✳</span></span><button onClick={() => setToast("Your learning journey is just getting started.")}><Trophy size={14} /> YOUR JOURNEY, YOUR PACE</button></footer>
        </div>
      </section>
      {toast && <div className="toast" role="status"><span className="toast-check"><Check size={14} /></span>{toast}<button onClick={() => setToast("")} aria-label="Dismiss message"><X size={15} /></button></div>}
    </main>
  );
}
