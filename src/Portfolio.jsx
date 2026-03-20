import { useState } from "react";
import ProjectsView from "./ProjectsView";
import OrbitImages from "./OrbitImages";
import SplashCursor from "./SplashCursor";
import Threads from "./Threads";
import BorderGlow from "./BorderGlow";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --bg:        #18171a;
    --surface:   #1f1e22;
    --border:    rgba(255,255,255,0.07);
    --accent:    #8b1a2e;
    --accent-lt: #b52240;
    --text:      #e4e0db;
    --muted:     #7a7672;
    --sidebar:   180px;
    --sidebar-peek: 46px;
  }

  html, body { height: 100%; overflow: hidden; cursor: none; }

  #root, .app,
  a, button, [role="button"], input, textarea, select {
    cursor: none;
  }

  .app {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .threads-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .navbar-glow {
    width: var(--sidebar);
    height: calc(100vh - 28px);
    position: fixed;
    top: 14px;
    left: 14px;
    z-index: 500;
    transition: transform .3s cubic-bezier(.4,0,.2,1);
  }

  .navbar-glow,
  .navbar-glow * {
    cursor: auto !important;
  }

  .navbar-glow a,
  .navbar-glow button {
    cursor: pointer !important;
  }

  .navbar-glow .border-glow-inner {
    height: 100%;
    overflow: visible;
    border-radius: inherit;
  }

  .sidebar {
    width: var(--sidebar);
    height: 100%;
    display: flex; flex-direction: column;
    padding: 2.2rem 1.25rem;
    border: none;
    border-radius: 20px;
    background: transparent;
    box-shadow: none;
    transition: background .3s, border-color .3s;
  }

  .sidebar-toggle {
    position: absolute;
    top: 50%;
    right: -16px;
    transform: translateY(-50%);
    width: 32px;
    height: 64px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: color .2s, border-color .2s, background .2s;
  }

  .sidebar-toggle:hover {
    color: var(--text);
    border-color: rgba(255,255,255,.18);
    background: rgba(31, 30, 34, 0.98);
  }

  .sidebar-toggle span {
    font-size: .72rem;
    line-height: 1;
    transform: translateX(-1px);
  }

  .logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    color: var(--text);
    letter-spacing: .01em;
    margin-bottom: 3rem;
    line-height: 1.2;
  }

  .logo span {
    display: block;
    color: var(--muted);
    font-size: .75rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    margin-top: .2rem;
  }

  .nav { display: flex; flex-direction: column; gap: .2rem; }

  .nav-btn {
    background: none; border: none; cursor: pointer;
    text-align: left; padding: .5rem .65rem;
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem; font-weight: 400; letter-spacing: .12em;
    color: var(--muted); border-radius: 4px;
    transition: color .2s, background .2s;
    position: relative;
  }

  .nav-btn::before {
    content: '';
    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 2px; height: 0; background: var(--accent);
    transition: height .2s; border-radius: 2px;
  }

  .nav-btn:hover { color: var(--text); }
  .nav-btn.active { color: var(--text); background: rgba(139,26,46,.12); }
  .nav-btn.active::before { height: 60%; }

  .socials {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: .85rem;
    padding-bottom: 1.5rem;
  }

  .soc { color: var(--muted); transition: color .2s; display: block; width: 16px; height: 16px; }
  .soc:hover { color: var(--accent-lt); }

  .copy { font-size: .58rem; color: var(--muted); letter-spacing: .04em; }

  .theme-btn {
    position: fixed; top: 1.5rem; right: 1.75rem; z-index: 100;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: .4rem .7rem;
    font-size: .65rem; font-weight: 500; letter-spacing: .1em;
    color: var(--muted); cursor: pointer; transition: color .2s, border-color .2s;
  }

  .theme-btn:hover { color: var(--text); border-color: rgba(255,255,255,.15); }

  .main {
    margin-left: calc(var(--sidebar) + 28px);
    flex: 1;
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    transition: margin-left .3s cubic-bezier(.4,0,.2,1);
  }

  .app.nav-collapsed .navbar-glow {
    transform: translateX(calc(-1 * (var(--sidebar) - var(--sidebar-peek))));
  }

  .app.nav-collapsed .main {
    margin-left: calc(var(--sidebar-peek) + 22px);
  }

  .main::before {
    content: '';
    position: fixed;
    top: -120px; right: -120px;
    width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(139,26,46,.18) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .page { display: none; position: relative; z-index: 1; }
  .page.active { display: block; animation: rise .45s ease both; }
  .page.skills-page { z-index: 450; }

  @keyframes rise {
    from { opacity:0; transform: translateY(14px); }
    to { opacity:1; transform: translateY(0); }
  }

  .home {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr auto;
  }

  .home-hero {
    padding: 4.5rem 3rem 3rem;
    display: flex; flex-direction: column; justify-content: space-between;
    border-right: 1px solid var(--border);
  }

  .home-name {
    font-family: 'DM Serif Display', serif;
    font-weight: 200;
    font-size: clamp(3rem, 5.5vw, 5.2rem);
    line-height: .95;
    color: var(--text);
    letter-spacing: -.01em;
  }

  .home-name em { font-style: italic; color: var(--accent-lt); }

  .home-role {
    margin-top: 1.4rem;
    font-size: .78rem; font-weight: 300; letter-spacing: .1em;
    color: var(--muted); text-transform: uppercase;
  }

  .home-contact {
    font-size: .78rem; font-weight: 300; line-height: 2;
    color: var(--muted);
  }

  .home-contact a { color: var(--text); text-decoration: none; transition: color .2s; }
  .home-contact a:hover { color: var(--accent-lt); }

  .home-about {
    padding: 4.5rem 3rem 3rem;
    display: flex; flex-direction: column; justify-content: center;
  }

  .section-eyebrow {
    font-size: .65rem; font-weight: 500; letter-spacing: .2em;
    color: var(--accent-lt); text-transform: uppercase;
    display: flex; align-items: center; gap: .6rem;
    margin-bottom: 1.6rem;
  }

  .section-eyebrow::after { content:''; flex:1; height:1px; background: var(--border); max-width: 60px; }

  .about-body {
    font-size: .88rem; font-weight: 300; line-height: 1.85;
    color: var(--muted); max-width: 560px;
  }

  .about-body p + p { margin-top: .7rem; }

  .home-footer {
    grid-column: 1 / -1;
    border-top: 1px solid var(--border);
    padding: 1.2rem 3rem;
    display: flex; gap: 3rem;
  }

  .stat-num {
    font-family: 'DM Serif Display', serif;
    font-size: 1.8rem;
    color: var(--text);
    line-height: 1;
  }

  .stat-label {
    font-size: .65rem;
    font-weight: 300;
    letter-spacing: .1em;
    color: var(--muted);
    margin-top: .2rem;
  }

  .inner { padding: 4rem 3.5rem; max-width: 960px; }

  .page-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    color: var(--text); margin-bottom: .4rem; line-height: 1;
  }

  .page-sub { font-size: .75rem; font-weight: 300; letter-spacing: .1em; color: var(--muted); margin-bottom: 3rem; }
  .skills-sub { margin-bottom: 1.25rem; }

  .projects {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  .proj {
    background: var(--bg);
    padding: 1.8rem;
    transition: background .2s;
    position: relative; overflow: hidden;
  }

  .proj::after {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 100%; height: 2px;
    background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform .3s;
  }

  .proj:hover { background: var(--surface); }
  .proj:hover::after { transform: scaleX(1); }

  .proj-idx { font-size: .65rem; color: var(--accent); font-weight: 500; letter-spacing: .12em; margin-bottom: .8rem; }
  .proj-name { font-size: .92rem; font-weight: 500; color: var(--text); margin-bottom: .7rem; line-height: 1.3; }
  .proj-desc { font-size: .78rem; font-weight: 300; line-height: 1.72; color: var(--muted); margin-bottom: 1.2rem; }
  .tags { display: flex; flex-wrap: wrap; gap: .35rem; }

  .tag {
    font-size: .6rem; letter-spacing: .07em; font-weight: 400;
    padding: .22rem .55rem;
    border: 1px solid rgba(139,26,46,.3);
    color: rgba(181,34,64,.7);
    border-radius: 2px;
  }

  .skills-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 42%);
    gap: 2rem;
    align-items: center;
  }

  .skills-left {
    min-width: 0;
  }

  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2.5rem; }

  .skills-right {
    min-height: 520px;
    display: grid;
    place-items: center end;
  }

  .skills-orbit {
    width: 100%;
    max-width: 720px;
    justify-self: end;
    margin-left: auto;
    margin-right: 0;
    transform: translateX(380px);
  }

  .sg-label {
    font-size: .62rem; letter-spacing: .18em; font-weight: 500;
    color: var(--accent-lt); text-transform: uppercase;
    padding-bottom: .5rem; margin-bottom: 1rem;
    border-bottom: 1px solid rgba(139,26,46,.25);
  }

  .skill-list { display: flex; flex-wrap: wrap; gap: .4rem; }

  .skill {
    font-size: .72rem; font-weight: 300; letter-spacing: .03em;
    color: var(--muted); padding: .28rem .6rem;
    border: 1px solid var(--border);
    border-radius: 2px;
    transition: color .2s, border-color .2s;
  }

  .skill:hover { color: var(--text); border-color: rgba(139,26,46,.4); }

  .exp-list { display: flex; flex-direction: column; gap: 0; }

  .exp-item {
    padding: 2rem 0 2rem 1.5rem;
    border-left: 1px solid var(--border);
    position: relative;
  }

  .exp-item::before {
    content: '';
    position: absolute; left: -4px; top: 2.4rem;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); border: 1px solid var(--bg);
  }

  .exp-role { font-size: .9rem; font-weight: 500; color: var(--text); margin-bottom: .2rem; }
  .exp-company { font-size: .75rem; font-weight: 400; color: var(--accent-lt); margin-bottom: .15rem; }
  .exp-date { font-size: .65rem; letter-spacing: .1em; color: var(--muted); font-weight: 300; margin-bottom: .9rem; text-transform: uppercase; }
  .exp-pts { list-style: none; }

  .exp-pts li {
    font-size: .78rem; font-weight: 300; line-height: 1.72;
    color: var(--muted); padding-left: 1rem; position: relative; margin-bottom: .3rem;
  }

  .exp-pts li::before { content: '-'; position: absolute; left: 0; color: var(--accent); font-size: .7rem; }

  @media (max-width: 800px) {
    .navbar-glow {
      top: 0;
      left: 0;
      height: 100vh;
      border-radius: 0;
    }

    .sidebar {
      border-radius: 0;
      box-shadow: none;
    }

    .sidebar-toggle {
      display: none;
    }

    .main,
    .app.nav-collapsed .main {
      margin-left: var(--sidebar);
    }

    .app.nav-collapsed .navbar-glow {
      transform: none;
    }

    .home { grid-template-columns: 1fr; }
    .home-hero { border-right: none; border-bottom: 1px solid var(--border); padding: 3rem 1.75rem 2.5rem; }
    .home-about { padding: 2.5rem 1.75rem; }
    .home-footer { padding: 1.2rem 1.75rem; }
    .inner { padding: 2.5rem 1.75rem; }
    .skills-layout { grid-template-columns: 1fr; }
    .skills-right { min-height: 320px; }
    .skills-orbit { margin: 1rem auto 0; max-width: 100%; transform: none; }
    :root { --sidebar: 140px; }
  }
`;

const NAV = ["HOME", "EXPERIENCE", "PROJECTS", "SKILLS"];

const PROJECTS = [
  {
    name: "BrightSUM - Adaptive Learning Platform",
    desc: "Full-stack platform with ML-driven hint prediction, correctness estimation, and adaptive question selection. Flask + React with JWT-secured REST APIs.",
    tech: ["Python", "Flask", "React", "SQLite", "Scikit-Learn", "JWT"],
  },
  {
    name: "F1 Driver Performance Analysis",
    desc: "Analytics model studying race results across multiple seasons. Applied linear regression to performance indicators and win probability with full visualization pipeline.",
    tech: ["Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "Matplotlib"],
  },
  {
    name: "Agent-Based Disease Simulation",
    desc: "Models disease spread with agent movement, infection, and immunity. Trained Random Forest and Decision Tree models; deployed on AWS Elastic Beanstalk.",
    tech: ["Python", "Flask", "Scikit-Learn", "AWS EB", "Amazon S3"],
  },
  {
    name: "Open Source Contributor - NLTK",
    desc: "Fixed PCFG CNF conversion, removed redundant productions, resolved CLI conflicts, and improved sentence tokenization for multi-period abbreviations.",
    tech: ["Python", "NLTK", "NLP", "Open Source"],
  },
];

const SKILLS = [
  { label: "Languages", items: ["C", "Java", "Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS", "Bash", "VHDL", "Verilog"] },
  { label: "Frameworks", items: ["React", "TailwindCSS", "Node.js", "Express.js", "Flask", "FastAPI"] },
  { label: "Libraries", items: ["NumPy", "Pandas", "Matplotlib", "Scikit-Learn", "TensorFlow", "PyTorch", "NLTK", "BeautifulSoup"] },
  { label: "Developer Tools & Platforms", items: ["Git", "GitHub", "Docker", "Linux", "Jira", "Jupyter", "Vivado", "Vivado HLS","Xilinx SDK"] },
  { label: "Engineering & Analysis Tools", items: ["MATLAB", "Excel", "Tableau", "AutoCAD", "SolidWorks", "JUnit", "Pytest"] },
  { label: "Cloud & Databases", items: ["AWS (EB, S3)", "PostgreSQL", "SQLite"] },
];

const skillImageModules = import.meta.glob("./Skill Images/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

const SKILL_ORBIT_IMAGES = Object.entries(skillImageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function Portfolio() {
  const [page, setPage] = useState("HOME");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <SplashCursor
        SPLAT_FORCE={1500}
        SPLAT_RADIUS={0.08}
        COLOR_UPDATE_SPEED={3}
        DENSITY_DISSIPATION={1.9}
        VELOCITY_DISSIPATION={1.1}
        COLOR_PALETTE={[
          { r: 0.45, g: 0.1, b: 0.16 },
          { r: 0.34, g: 0.08, b: 0.13 },
          { r: 0.3, g: 0.11, b: 0.15 },
          { r: 0.22, g: 0.2, b: 0.2 },
        ]}
      />
      <div className="threads-bg" aria-hidden="true">
        <Threads
          color={[0.50, 0.12, 0.2]}
          color2={[0.42, 0.48, 0.56]}
          amplitude={5}
          distance={1}
          speed={0.5}
          enableMouseInteraction={false}
        />
      </div>
      <style>{css}</style>
      <div className={`app${sidebarCollapsed ? " nav-collapsed" : ""}`}>
        <BorderGlow
          className="navbar-glow"
          edgeSensitivity={0}
          glowColor="348 56 46"
          backgroundColor="rgba(24, 23, 26, 0.92)"
          borderRadius={20}
          glowRadius={28}
          glowIntensity={1.6}
          coneSpread={18}
          animated={false}
          colors={["#8b1a2e", "#b52240", "#7a7672"]}
          fillOpacity={0.28}
        >
          <aside className="sidebar">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand" : "Collapse"}
            >
              <span>{sidebarCollapsed ? ">" : "<"}</span>
            </button>
            <div className="logo">
              H.S.<span>Portfolio</span>
            </div>
            <nav className="nav">
              {NAV.map((n) => (
                <button key={n} className={`nav-btn${page === n ? " active" : ""}`} onClick={() => setPage(n)}>
                  {n}
                </button>
              ))}
            </nav>
            <div className="socials">
              <a href="https://linkedin.com/in/hemanthsundaresan" target="_blank" rel="noreferrer" className="soc" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href="https://github.com/Hemu-unk" target="_blank" rel="noreferrer" className="soc" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </a>
              <a href="mailto:s.hemanthsundar@gmail.com" className="soc" title="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>
              </a>
            </div>
            <p className="copy">&copy; 2025 Hemanth Sundaresan</p>
          </aside>
        </BorderGlow>

        <main className="main">
          <div className={`page${page === "HOME" ? " active" : ""}`}>
            <div className="home">
              <div className="home-hero">
                <div>
                  <h1 className="home-name">
                    Hemanth
                    <br />
                    <em>Sundaresan</em>
                  </h1>
                  <p className="home-role">Computer Engineer · Data Developer</p>
                </div>
                <div className="home-contact">
                  <div>University of Guelph - Guelph, ON</div>
                  <div>B.Eng. Computer Engineering - 2027</div>
                  <div style={{ marginTop: ".5rem" }}>
                    <a href="mailto:s.hemanthsundar@gmail.com">s.hemanthsundar@gmail.com</a>
                  </div>
                  <div><a href="tel:3659981981">365-998-1981</a></div>
                </div>
              </div>

              <div className="home-about">
                <p className="section-eyebrow">About Me</p>
                <div className="about-body">
                  <p>I'm a Computer Engineering student at the University of Guelph focused on data science, machine learning, and system design. I enjoy analyzing data to uncover patterns and building systems that use those insights to solve real problems.</p>
                  <p>I've worked on projects ranging from data analysis models to full stack applications with integrated machine learning, including an agent based infectious disease simulation where I modeled outbreak dynamics and used machine learning to predict infection trends. This experience strengthened my interest in building data driven and scalable systems.</p>
                  <p>Currently working as an AI Model Trainer at Outlier AI, evaluating and improving technical outputs across engineering and data focused tasks.</p>
                  <p>Open source contributor to NLTK. I'm particularly interested in problems at the intersection of data science, machine learning, and scalable systems.</p>
                </div>
              </div>

              <div className="home-footer">
                <div className="stat"><div className="stat-num">4</div><div className="stat-label">Projects shipped</div></div>
                <div className="stat"><div className="stat-num">5+</div><div className="stat-label">ML models built</div></div>
                <div className="stat"><div className="stat-num">11</div><div className="stat-label">Languages & frameworks</div></div>
                <div className="stat"><div className="stat-num">INF</div><div className="stat-label">Bugs squashed</div></div>
              </div>
            </div>
          </div>

          <div className={`page${page === "PROJECTS" ? " active" : ""}`}>
            <ProjectsView />
          </div>

          <div className={`page skills-page${page === "SKILLS" ? " active" : ""}`}>
            <div className="inner">
              <h2 className="page-heading">Skills</h2>
              <p className="page-sub skills-sub">Technologies and tools</p>
              <div className="skills-layout">
                <div className="skills-left">
                  <div className="skills-grid">
                    {SKILLS.map((g) => (
                      <div key={g.label} className="skill-group">
                        <div className="sg-label">{g.label}</div>
                        <div className="skill-list">
                          {g.items.map((s) => <span key={s} className="skill">{s}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="skills-right">
                  <div className="skills-orbit">
                    <OrbitImages
                      images={SKILL_ORBIT_IMAGES}
                      shape="ellipse"
                      radiusX={2000}
                      radiusY={500}
                      rotation={-15}
                      duration={60}
                      itemSize={200}
                      responsive={true}
                      radius={300}
                      direction="normal"
                      fill={true}
                      showPath={true}
                      pathColor="rgba(122, 118, 114, 0.55)"
                      paused={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`page${page === "EXPERIENCE" ? " active" : ""}`}>
            <div className="inner">
              <h2 className="page-heading">Experience</h2>
              <p className="page-sub">Professional and academic</p>
              <div className="exp-list">
                <div className="exp-item">
                  <div className="exp-role">AI Model Trainer - Freelance Contractor</div>
                  <div className="exp-company">Outlier AI</div>
                  <div className="exp-date">April 2025 - Present</div>
                  <ul className="exp-pts">
                    <li>Prompt engineered high-quality prompts to train and refine AI models across technical domains.</li>
                    <li>Analyzed large volumes of AI-generated data to evaluate accuracy, quality, and performance metrics.</li>
                    <li>Identified inconsistencies and edge cases to improve model robustness and factual correctness.</li>
                    <li>Applied subject matter expertise to ensure comprehensive coverage of key concepts and industry standards.</li>
                  </ul>
                </div>
                <div className="exp-item">
                  <div className="exp-role">Bachelor of Engineering - Computer Engineering</div>
                  <div className="exp-company">University of Guelph</div>
                  <div className="exp-date">April 2027 · Guelph, ON</div>
                  <ul className="exp-pts">
                    <li>Comprehensive program focused on the integration of hardware and software systems, with a strong foundation in programming, circuit design, embedded systems, and computer architecture. Developed problem solving and teamwork skills through hands on projects and design courses, preparing for roles in software development, hardware engineering, and related fields.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
