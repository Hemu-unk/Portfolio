import { useState, useEffect, useRef, useCallback } from "react";
import brightsum1 from "./Project Pics/BrightSUM 1.png";
import brightsum2 from "./Project Pics/BrightSUM 2.png";
import brightsum3 from "./Project Pics/BrightSUM 3.png";
import f11 from "./Project Pics/F1 1.png";
import f12 from "./Project Pics/F1 2.png";
import abs1 from "./Project Pics/ABS 1.png";
import abs2 from "./Project Pics/ABS 2.png";
import simd1 from "./Project Pics/SIMD 1.png";
import simd2 from "./Project Pics/SIMD 2.png";
import simd3 from "./Project Pics/SIMD 3.png";
import simd4 from "./Project Pics/SIMD 4.png";

const projectsCSS = `
  /* -- PROJECTS SCROLL -- */
  .projects-scroll {
    height:100vh;
    overflow-y:scroll;
    scroll-snap-type:y mandatory;
    scroll-behavior:smooth;
    overscroll-behavior:contain;
  }
  .projects-scroll::-webkit-scrollbar { display:none; }
  .projects-scroll { -ms-overflow-style:none; scrollbar-width:none; }

  /* -- PROJECT SLIDE -- */
  .proj-slide {
    height:100vh;
    scroll-snap-align:start;
    scroll-snap-stop:always;
    display:grid;
    grid-template-columns:1fr 1fr;
    overflow:hidden;
  }

  /* -- LEFT PANEL -- */
  .proj-left {
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding:3rem 2.8rem;
    border-right:1px solid rgba(255,255,255,0.07);
    background:rgba(24,23,26,.66);
    backdrop-filter:blur(2px);
    position:relative;
    z-index:2;
    overflow:hidden;
  }

  .proj-counter {
    font-size:.62rem; letter-spacing:.18em; font-weight:500;
    color:#8b1a2e; margin-bottom:1.6rem;
    display:flex; align-items:center; gap:.7rem;
  }
  .proj-counter::after {
    content:''; flex:1; height:1px; background:rgba(139,26,46,.2);
  }

  .proj-name {
    font-family:'DM Serif Display',serif;
    font-size:clamp(1.7rem,3vw,2.5rem);
    line-height:1.0; color:#e4e0db;
    letter-spacing:.01em; margin-bottom:.85rem;
  }

  .proj-roles-line {
    font-size:.66rem; font-weight:300; letter-spacing:.1em;
    color:#7a7672; text-transform:uppercase;
    display:flex; align-items:center; gap:.5rem;
    margin-bottom:1.1rem;
  }
  .proj-roles-line::before {
    content:''; width:16px; height:1px;
    background:#8b1a2e; flex-shrink:0;
  }

  .proj-tags { display:flex; flex-wrap:wrap; gap:.32rem; }
  .proj-tag {
    font-size:.58rem; letter-spacing:.07em; font-weight:400;
    padding:.2rem .5rem;
    border:1px solid rgba(139,26,46,.3);
    color:rgba(181,34,64,.85); border-radius:2px;
  }

  /* -- PREVIEW CARD -- */
  .proj-preview-card {
    --preview-scale:.9;
    --preview-opacity:.72;
    --hover-boost:.5;
    width:100%;
    max-width:380px;
    aspect-ratio:var(--preview-aspect-ratio, 16/10);
    border-radius:12px;
    overflow:hidden;
    position:relative;
    background:#1f1e22;
    border:1px solid rgba(255,255,255,0.07);
    box-shadow:0 8px 32px rgba(0,0,0,.45), 0 2px 8px rgba(0,0,0,.3);
    flex-shrink:0;
    transition:box-shadow .4s ease, transform .4s ease, opacity .35s ease;
    transform-origin:left bottom;
    transform:scale(var(--preview-scale));
    opacity:var(--preview-opacity);
  }
  .proj-preview-card:hover {
    box-shadow:0 16px 48px rgba(0,0,0,.6), 0 4px 12px rgba(139,26,46,.15);
    transform:scale(calc(var(--preview-scale) + var(--hover-boost))) translateY(-3px);
  }

  .proj-img {
    position:absolute; inset:0;
    width:100%; height:100%;
    object-fit:contain; object-position:center;
    display:block;
    transition:transform .6s ease;
    transform:scale(1);
    background:transparent;
  }
  .proj-preview-card:hover .proj-img { transform:scale(1); }

  .proj-ph {
    position:absolute; inset:0;
    display:grid;
    grid-template-columns:repeat(4,1fr);
    grid-template-rows:repeat(3,1fr);
    gap:1px;
    background:rgba(255,255,255,.025);
  }
  .ph-cell { background:#1f1e22; position:relative; }
  .ph-cell:nth-child(1)  { background:rgba(139,26,46,.12); }
  .ph-cell:nth-child(6)  { background:rgba(139,26,46,.07); }
  .ph-cell:nth-child(11) { background:rgba(139,26,46,.05); }
  .ph-cell::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.02) 0%,transparent 100%);
  }

  .ph-hint {
    position:absolute; inset:0; z-index:3;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:.35rem;
    pointer-events:none;
  }
  .ph-hint svg { opacity:.18; }
  .ph-hint-text {
    font-size:.55rem; letter-spacing:.14em;
    color:rgba(228,224,219,.3); text-transform:uppercase;
  }
  .ph-hint-code {
    font-size:.58rem; font-family:monospace;
    color:rgba(181,34,64,.45);
  }

  .card-chrome {
    position:absolute; top:0; left:0; right:0; z-index:2;
    height:22px;
    background:rgba(15,14,17,.75);
    backdrop-filter:blur(4px);
    display:flex; align-items:center; padding:0 .6rem; gap:.3rem;
  }
  .chrome-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.12); }
  .chrome-dot:first-child  { background:rgba(255,90,85,.5); }
  .chrome-dot:nth-child(2) { background:rgba(255,189,46,.5); }
  .chrome-dot:nth-child(3) { background:rgba(40,200,64,.5); }

  /* -- RIGHT PANEL -- */
  .proj-right {
    display:flex; flex-direction:column; justify-content:center;
    padding:3.5rem 3rem;
    position:relative; overflow:hidden;
  }

  .proj-right-ghost {
    position:absolute; right:-1rem; bottom:-2.5rem;
    font-family:'DM Serif Display',serif; font-style:italic;
    font-size:clamp(8rem,16vw,14rem); line-height:1;
    color:rgba(255,255,255,.025);
    user-select:none; pointer-events:none;
  }

  .proj-overview-label {
    font-size:.62rem; letter-spacing:.2em; font-weight:500;
    color:#b52240; text-transform:uppercase; margin-bottom:.9rem;
  }

  .proj-summary {
    font-size:.9rem; font-weight:300; line-height:1.88;
    color:#7a7672; max-width:400px; margin-bottom:2.4rem;
  }

  .proj-meta-row {
    display:flex; gap:2.5rem; margin-bottom:2rem;
    padding-bottom:2rem; border-bottom:1px solid rgba(255,255,255,0.07);
  }
  .proj-meta-key {
    font-size:.58rem; letter-spacing:.16em; font-weight:500;
    color:#8b1a2e; text-transform:uppercase; margin-bottom:.25rem;
  }
  .proj-meta-val { font-size:.78rem; font-weight:300; color:#e4e0db; letter-spacing:.02em; }

  .proj-links { display:flex; gap:.7rem; }
  .proj-link {
    display:inline-flex; align-items:center; gap:.4rem;
    font-size:.67rem; font-weight:400; letter-spacing:.08em;
    padding:.42rem 1rem; border-radius:2px;
    text-decoration:none; transition:background .2s,color .2s,border-color .2s;
  }
  .proj-link.gh { border:1px solid rgba(255,255,255,0.07); color:#7a7672; }
  .proj-link.gh:hover { border-color:rgba(255,255,255,.2); color:#e4e0db; }
  .proj-link.demo { background:#8b1a2e; color:#fff; border:1px solid #8b1a2e; }
  .proj-link.demo:hover { background:#b52240; border-color:#b52240; }

  /* scroll hint */
  .scroll-hint {
    position:absolute; bottom:1.8rem; left:2.8rem;
    display:flex; align-items:center; gap:.7rem;
    opacity:0; animation:fadeHint 1s ease 1.8s forwards; pointer-events:none;
  }
  .scroll-hint-text { font-size:.55rem; letter-spacing:.18em; color:#7a7672; text-transform:uppercase; }
  .scroll-hint-line { width:28px; height:1px; background:linear-gradient(to right,#7a7672,transparent); animation:shimmer 2s ease-in-out infinite; }
  @keyframes fadeHint { to{opacity:1} }
  @keyframes shimmer  { 0%,100%{opacity:.3} 50%{opacity:.9} }

  /* dot nav */
  .proj-dots {
    position:fixed; right:1.4rem; top:50%; transform:translateY(-50%);
    display:flex; flex-direction:column; gap:.55rem; z-index:300;
  }
  .proj-dot {
    width:5px; height:5px; border-radius:50%;
    background:#7a7672; cursor:pointer;
    transition:background .3s,transform .3s;
  }
  .proj-dot.active { background:#b52240; transform:scale(1.5); }

  @media (max-width: 980px) {
    .proj-slide {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }

    .proj-left,
    .proj-right {
      padding: 2rem 1.6rem;
    }

    .proj-left {
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }

    .proj-preview-card {
      max-width: 100%;
      margin-top: 1.2rem;
    }

    .proj-right-ghost {
      font-size: clamp(5rem, 20vw, 9rem);
      right: 0;
      bottom: -1rem;
    }

    .proj-dots {
      right: .8rem;
    }
  }
`;

export const projects = [
  {
    id: "1",
    title: "BRIGHTSUM",
    image: [brightsum1, brightsum2, brightsum3],
    github: "https://github.com/Hemu-unk/BrightSUM",
    demo: null,
    techs: ["Python", "Flask", "React", "SQLite", "Scikit-Learn", "JWT"],
    duration: "6 weeks",
    roles: "Design · Frontend · Backend · ML",
    summary:
      "Fullstack adaptive learning platform that combines a Flask backend with a React frontend to deliver personalized educational experiences. It features secure RESTful APIs for authentication, lessons, quizzes, and practice sessions, and leverages machine learning to predict hints, estimate correctness, and adapt question difficulty based on user performance.",
  },
  {
    id: "2",
    title: "F1 PERFORMANCE ANALYSIS",
    image: [f11, f12],
    github: "https://github.com/Hemu-unk/Formula-1-xgb-model",
    demo: null,
    techs: ["Python", "Pandas", "NumPy", "Scikit-Learn", "SQL", "Matplotlib", "Jupyter"],
    duration: "3 weeks",
    roles: "Data Engineering · ML · Visualization",
    summary:
      "Formula 1 prediction app powered by XGBoost machine learning models trained on historical race features. The models estimate win chance, podium chance, top 6 and top 10 chances, and expected finish, while a Flask backend serves predictions and a React frontend lets users enter race inputs and view visual analysis.",
  },
  {
    id: "3",
    title: "DISEASE SIMULATION",
    image: [abs1, abs2],
    github: "https://github.com/Hemu-unk/Modelling-Infectious-Disease-Spread",
    demo: null,
    techs: ["Python", "Flask", "Scikit-Learn", "NumPy", "AWS EB", "Amazon S3"],
    duration: "4 weeks",
    roles: "Backend · ML · Cloud Deployment",
    summary:
      "This project simulates how a disease spreads through a population of moving people. It then generates data from many runs, trains machine learning models to estimate peak infections, total infections, and outbreak length, and exposes results through a simple Flask web app and API. In short, it is a complete flow from simulation to prediction with a simple interface.",
  },
  {
    id: "4",
    title: "SIMD HARDWARE ACCELERATOR",
    image: [simd1, simd2, simd3, simd4],
    github: "https://github.com/Hemu-unk/SIMD-Hardware-Accelerator",
    demo: null,
    techs: ["VHDL", "Vivado HLS", "ModelSim", "NEXYS-A7 FPGA", "ZedBoard Zynq-7000", "Xilinx SDK", "AXI4-Lite"],
    duration: "3 weeks",
    type: "Academic Project",
    roles: "Digital Design · Verification · Embedded Co-Design",
    summary:
      "Designed a SIMD FPGA accelerator to execute four parallel long-division operations with modular datapaths and concurrent execution. Verified correctness with ModelSim waveforms and compared VHDL, HLS, and SDK implementations for performance and resource utilization. Built AXI4-Lite registers and C control routines to pack operands, trigger execution, and read results on NEXYS-A7 and ZedBoard platforms.",
  },
];

const isVideo = (src) => src && /\.(mp4|webm|mov)$/i.test(src);

function PreviewCard({ image, title, cardStyle }) {
  const mediaItems = Array.isArray(image) ? image.filter(Boolean) : image ? [image] : [];
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [mediaAspectRatio, setMediaAspectRatio] = useState("16 / 10");

  useEffect(() => {
    setActiveMediaIdx(0);
    setMediaAspectRatio("16 / 10");
  }, [image]);

  useEffect(() => {
    if (mediaItems.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveMediaIdx((prev) => (prev + 1) % mediaItems.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  const currentMedia = mediaItems[activeMediaIdx];
  const previewStyle = { ...cardStyle, "--preview-aspect-ratio": mediaAspectRatio };

  return (
    <div className="proj-preview-card" style={previewStyle}>
      {currentMedia ? (
        isVideo(currentMedia) ? (
          <video
            className="proj-img"
            src={currentMedia}
            onLoadedMetadata={(e) => {
              const { videoWidth, videoHeight } = e.currentTarget;
              if (videoWidth > 0 && videoHeight > 0) {
                setMediaAspectRatio(`${videoWidth} / ${videoHeight}`);
              }
            }}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            className="proj-img"
            src={currentMedia}
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalWidth > 0 && naturalHeight > 0) {
                setMediaAspectRatio(`${naturalWidth} / ${naturalHeight}`);
              }
            }}
            alt={`${title} preview ${activeMediaIdx + 1}`}
          />
        )
      ) : (
        <>
          <div className="proj-ph">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="ph-cell" />
            ))}
          </div>
          <div className="ph-hint">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <div className="ph-hint-text">Preview image</div>
            <div className="ph-hint-code">image: "/file.png"</div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProjectsView() {
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetIdxRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const wheelResetRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = () => {
      const progress = el.scrollTop / el.clientHeight;
      setScrollProgress(progress);
      setActiveIdx(Math.round(progress));
    };
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  const onWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;

    e.preventDefault();

    // Accumulate wheel deltas so trackpads and mouse wheels both feel consistent.
    wheelAccumRef.current += e.deltaY;

    if (wheelResetRef.current) {
      clearTimeout(wheelResetRef.current);
    }

    wheelResetRef.current = setTimeout(() => {
      wheelAccumRef.current = 0;
    }, 140);

    if (Math.abs(wheelAccumRef.current) < 30) {
      return;
    }

    const dir = wheelAccumRef.current > 0 ? 1 : -1;
    wheelAccumRef.current = 0;

    const currentFloat = el.scrollTop / el.clientHeight;
    const isMidTransition = Math.abs(currentFloat - targetIdxRef.current) > 0.05;
    const baseIdx = isMidTransition ? targetIdxRef.current : Math.round(currentFloat);
    const next = Math.max(0, Math.min(projects.length - 1, baseIdx + dir));

    // Keep target tracking in sync with direct scroll updates.
    targetIdxRef.current = Math.round(currentFloat);

    if (next === targetIdxRef.current) return;

    targetIdxRef.current = next;
    setActiveIdx(next);
    el.scrollTo({ top: next * el.clientHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    return () => {
      if (wheelResetRef.current) {
        clearTimeout(wheelResetRef.current);
      }
    };
  }, []);

  const goTo = (i) =>
    scrollRef.current.scrollTo({
      top: i * scrollRef.current.clientHeight,
      behavior: "smooth",
    });

  return (
    <>
      <style>{projectsCSS}</style>

      <div className="proj-dots">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`proj-dot${i === activeIdx ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <div className="projects-scroll" ref={scrollRef} onWheel={onWheel}>
        {projects.map((p, i) => (
          <div key={p.id} className="proj-slide">
            <div className="proj-left">
              <div className="proj-top">
                <div className="proj-counter">
                  {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </div>
                <h2 className="proj-name">{p.title}</h2>
                <div className="proj-roles-line">{p.roles}</div>
                <div className="proj-tags">
                  {p.techs.map((t) => (
                    <span key={t} className="proj-tag">{t}</span>
                  ))}
                </div>
              </div>

              <PreviewCard
                image={p.image}
                title={p.title}
                cardStyle={{
                  "--preview-scale": `${Math.max(0.72, 1.08 - Math.abs(scrollProgress - i) * 0.32)}`,
                  "--preview-opacity": `${Math.max(0.28, 1 - Math.abs(scrollProgress - i) * 0.72)}`,
                }}
              />
            </div>

            <div className="proj-right">
              <div className="proj-right-ghost">{String(i + 1).padStart(2, "0")}</div>

              <div className="proj-overview-label">Overview</div>
              <p className="proj-summary">{p.summary}</p>

              <div className="proj-meta-row">
                <div>
                  <div className="proj-meta-key">Duration</div>
                  <div className="proj-meta-val">{p.duration}</div>
                </div>
                <div>
                  <div className="proj-meta-key">Type</div>
                  <div className="proj-meta-val">{p.type || "Personal Project"}</div>
                </div>
              </div>

              <div className="proj-links">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-link gh"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                )}
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="proj-link demo"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 8.75l-4 2.5A.75.75 0 016.5 10.5v-5a.75.75 0 011-.7l4 2.5a.75.75 0 010 1.45z" />
                    </svg>
                    Live Demo
                  </a>
                )}
              </div>

              {i < projects.length - 1 && (
                <div className="scroll-hint">
                  <div className="scroll-hint-line" />
                  <div className="scroll-hint-text">Next project</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
