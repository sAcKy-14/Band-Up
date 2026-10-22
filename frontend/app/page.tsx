"use client";

import { useState } from "react";
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

const words = [
  {
    word: "ubiquitous",
    pronunciation: "/juːˈbɪkwɪtəs/",
    type: "ADJECTIVE",
    meaning: "Present, appearing, or found everywhere.",
    example: "Smartphones have become ubiquitous in modern society.",
    synonyms: ["omnipresent", "widespread", "ever-present"],
  },
  {
    word: "resilient",
    pronunciation: "/rɪˈzɪliənt/",
    type: "ADJECTIVE",
    meaning: "Able to recover quickly from difficulty.",
    example: "A resilient community can adapt to economic change.",
    synonyms: ["adaptable", "strong", "flexible"],
  },
  {
    word: "substantiate",
    pronunciation: "/səbˈstænʃieɪt/",
    type: "VERB",
    meaning: "To support a claim with evidence or proof.",
    example: "Writers should substantiate their arguments with research.",
    synonyms: ["verify", "validate", "support"],
  },
];

const navigation = [
  { label: "Overview", icon: Home },
  { label: "Learn words", icon: BookOpen, badge: "12" },
  { label: "Practice", icon: Brain },
  { label: "Weekly review", icon: Layers3, badge: "8" },
];

const categories = [
  { label: "Academic", count: "24 words", color: "lilac", progress: 72 },
  { label: "Writing task 2", count: "18 words", color: "mint", progress: 46 },
  { label: "Speaking", count: "12 words", color: "peach", progress: 28 },
];

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [wordIndex, setWordIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const word = words[wordIndex];

  function startSession() {
    setToast("Your 5-minute word sprint is ready ✨");
    window.setTimeout(() => setToast(""), 2800);
  }

  function learnWord() {
    setWordIndex((current) => (current + 1) % words.length);
    setSaved(false);
    setToast("Nice work! One more word in the bank.");
    window.setTimeout(() => setToast(""), 2400);
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
          {navigation.map(({ label, icon: Icon, badge }) => (
            <button
              className={`nav-item ${activeNav === label ? "nav-active" : ""}`}
              key={label}
              onClick={() => { setActiveNav(label); setMenuOpen(false); }}
            >
              <Icon size={18} strokeWidth={1.9} />
              <span>{label}</span>
              {badge && <span className="nav-badge">{badge}</span>}
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
              <div className="date-line"><span className="live-dot" /> TUESDAY, OCTOBER 22</div>
              <h1>A little progress goes <span>a long way.</span></h1>
              <p className="welcome-subtitle">You’re building a brilliant vocabulary, one day at a time.</p>
            </div>
            <button className="primary-button" onClick={startSession}><Sparkles size={17} /> Start today’s session <ArrowRight size={17} /></button>
          </section>

          <section className="stat-grid" aria-label="Your learning statistics">
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon stat-lilac"><BookOpen size={17} /></span><span className="stat-trend"><ArrowUpRight size={14} /> 12%</span></div>
              <p className="stat-number">128</p><p className="stat-label">Words learned</p>
              <div className="stat-foot"><span>8 this week</span><span className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon stat-peach"><Flame size={17} /></span><span className="stat-neutral">Personal best 12</span></div>
              <p className="stat-number">7 <span className="stat-unit">days</span></p><p className="stat-label">Current streak</p>
              <div className="week-dots"><span className="done">M</span><span className="done">T</span><span className="done">W</span><span className="done">T</span><span className="done">F</span><span className="today">S</span><span>S</span></div>
            </article>
            <article className="stat-card">
              <div className="stat-top"><span className="stat-icon stat-mint"><Target size={17} /></span><span className="stat-neutral">This week</span></div>
              <p className="stat-number">68<span className="stat-percent">%</span></p><p className="stat-label">Weekly goal</p>
              <div className="goal-track"><span /></div>
              <div className="goal-foot"><span>17 of 25 words</span><span>8 to go</span></div>
            </article>
            <article className="stat-card xp-card">
              <div className="stat-top"><span className="stat-icon stat-blue"><Sparkles size={17} /></span><span className="level-pill">LEVEL 04</span></div>
              <p className="stat-number">2,450</p><p className="stat-label">Total experience points</p>
              <div className="xp-track"><span /></div>
              <div className="goal-foot"><span>550 XP to Level 5</span><span>82%</span></div>
            </article>
          </section>

          <section className="content-grid">
            <div className="left-stack">
              <article className="word-card">
                <div className="card-heading">
                  <div><p className="section-kicker"><span className="kicker-dot" /> TODAY’S WORD</p><p className="card-subtitle">A new word to make yours</p></div>
                  <div className="word-controls"><span className="word-count">0{wordIndex + 1} <span>/ 03</span></span><button className="icon-button save-button" onClick={() => { setSaved(!saved); setToast(saved ? "Removed from saved words." : "Saved to your collection."); }} aria-label={saved ? "Remove saved word" : "Save word"}><Bookmark size={17} fill={saved ? "currentColor" : "none"} /></button><button className="icon-button" aria-label="More word options" onClick={() => setToast("More word actions are coming soon.")}><MoreHorizontal size={19} /></button></div>
                </div>
                <div className="word-main">
                  <div className="word-title-row"><h2>{word.word}</h2><button className="audio-button" aria-label="Play pronunciation" onClick={() => setToast("Pronunciation audio is coming soon.")}><AudioLines size={18} /></button><span className="word-tag">{word.type}</span></div>
                  <p className="pronunciation">{word.pronunciation} <span>·</span> British English</p>
                  <p className="word-meaning">{word.meaning}</p>
                  <div className="example-box"><span className="example-mark">“</span><p>{word.example}</p></div>
                  <div className="synonym-row"><span>SIMILAR WORDS</span>{word.synonyms.map((synonym) => <span className="synonym-chip" key={synonym}>{synonym}</span>)}</div>
                </div>
                <div className="word-card-footer"><span><Sparkles size={15} /> Part of your <strong>Academic</strong> collection</span><div><button className="text-button" onClick={() => setToast("Word details opened.")}>Explore word <ArrowUpRight size={15} /></button><button className="learn-button" onClick={learnWord}><Check size={16} /> I’ve got it</button></div></div>
              </article>

              <article className="weekly-card">
                <div className="weekly-copy"><span className="weekly-icon"><Layers3 size={18} /></span><div><p className="section-kicker">YOUR WEEKLY REVIEW</p><h3>8 words are ready for a revisit</h3><p>Keep the words you’ve learned fresh in your mind.</p></div></div>
                <div className="weekly-action"><div className="review-avatars"><span>ab</span><span>re</span><span>co</span><i>+5</i></div><button className="secondary-button" onClick={() => { setActiveNav("Weekly review"); setToast("Your weekly review is ready to begin."); }}>Start review <ArrowRight size={16} /></button></div>
              </article>
            </div>

            <div className="right-stack">
              <article className="goal-card">
                <div className="goal-heading"><div><p className="section-kicker">YOUR WEEKLY GOAL</p><p className="card-subtitle">You’re finding your rhythm</p></div><button className="icon-button" aria-label="Goal options" onClick={() => setToast("Goal settings are coming soon.")}><MoreHorizontal size={19} /></button></div>
                <div className="goal-progress-row"><div className="goal-ring"><div><strong>68<span>%</span></strong><small>complete</small></div></div><div className="goal-numbers"><strong>17 <span>/ 25 words</span></strong><p><span className="green-text"><ArrowUpRight size={14} /> 3 more</span> than last week</p></div></div>
                <div className="chart-heading"><span>THIS WEEK</span><span>17 / 25 WORDS</span></div>
                <div className="bar-chart" aria-label="Words learned each day this week"><div className="chart-line"><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span><span>0</span></div>{[{ day: "M", value: 48 }, { day: "T", value: 78 }, { day: "W", value: 57 }, { day: "T", value: 92 }, { day: "F", value: 38 }, { day: "S", value: 64 }, { day: "S", value: 14 }].map((bar, index) => <div className="bar-column" key={index}><div className="bar-track"><span className={index === 6 ? "bar-today" : ""} style={{ height: `${bar.value}%` }} /></div><small>{bar.day}</small></div>)}</div>
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
