import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Compass, HelpCircle, ListChecks, Target } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects, type ProjectDefinition, type ProjectPhase } from '../data/projects';

const phaseOrder: ProjectPhase[] = ['PLANNING', 'FOUNDATION', 'CORE', 'TESTING', 'CONCEPT LIVE'];

function splitCountdown(targetIso: string, now: number) {
  const remaining = Math.max(0, new Date(targetIso).getTime() - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    live: remaining === 0,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Countdown({ project }: { project: ProjectDefinition }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => splitCountdown(project.targetIso, now), [project.targetIso, now]);

  if (countdown.live) {
    return <div className="project-countdown project-countdown--live"><strong>CONCEPT LIVE</strong><span>The target date has arrived.</span></div>;
  }

  const values = [
    ['Days', countdown.days],
    ['Hours', countdown.hours],
    ['Minutes', countdown.minutes],
    ['Seconds', countdown.seconds],
  ] as const;

  return (
    <div className="project-countdown" aria-label={`Time remaining until ${project.name} ${project.releaseLabel}`} aria-live="polite">
      {values.map(([label, value]) => (
        <div key={label} className="project-countdown__unit">
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectView() {
  const { slug } = useParams();
  const project = slug === 'speculus' || slug === 'fabula' ? projects[slug] : null;

  if (!project) {
    return (
      <section className="page project-page">
        <Link className="back-link" to="/"><ArrowLeft size={15} /> Back to Coda</Link>
        <div className="state-panel"><strong>Project not found</strong><span>This roadmap entry does not exist.</span></div>
      </section>
    );
  }

  const currentPhaseIndex = phaseOrder.indexOf(project.phase);

  return (
    <section className={`page project-page project-page--${project.slug}`}>
      <Link className="back-link" to="/"><ArrowLeft size={15} /> Back to Coda</Link>

      <header className="project-hero">
        <div className="project-hero__copy">
          <span className="eyebrow">THE HOWLING WHISPERS · DEVELOPMENT ROADMAP</span>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          <div className="project-hero__meta">
            <span><CalendarDays size={15} /> Target: {project.targetLabel}</span>
            <span><Clock3 size={15} /> {project.releaseLabel}</span>
          </div>
        </div>
        <div className="project-hero__status">
          <small>Current phase</small>
          <strong>{project.phase}</strong>
          <span>{project.progress}% of concept plan</span>
        </div>
      </header>

      <section className="project-panel project-release-panel">
        <div className="project-panel__heading">
          <div><span className="eyebrow">RELEASE CLOCK</span><h2>{project.releaseLabel}</h2></div>
          <span className="project-target-date">{project.targetLabel}</span>
        </div>
        <Countdown project={project} />
        <p className="project-release-note"><strong>Target date, not a lockout.</strong> Development is continuous. Demos, prototypes, test builds and semi-working versions may appear before the countdown ends. If the project reaches this milestone early, it may release ahead of schedule.</p>
        <div className="project-progress" aria-label={`${project.progress}% complete`}>
          <div className="project-progress__track"><span style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }} /></div>
          <div className="project-progress__labels"><span>Concept progress</span><strong>{project.progress}%</strong></div>
        </div>
        <div className="project-phases" aria-label="Development phases">
          {phaseOrder.map((phase, index) => (
            <div key={phase} className={`project-phase ${index < currentPhaseIndex ? 'is-done' : ''} ${index === currentPhaseIndex ? 'is-current' : ''}`}>
              <i>{index < currentPhaseIndex ? <CheckCircle2 size={14} /> : index + 1}</i>
              <span>{phase}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="project-grid">
        <section className="project-panel">
          <div className="project-panel__icon"><Compass size={18} /></div>
          <span className="eyebrow">WHAT IS THIS?</span>
          <h2>Purpose</h2>
          <p>{project.purpose}</p>
        </section>

        <section className="project-panel">
          <div className="project-panel__icon"><Target size={18} /></div>
          <span className="eyebrow">CURRENT STATUS</span>
          <h2>{project.phase}</h2>
          <p>{project.status}</p>
          <dl className="project-status-list">
            <div><dt>Next milestone</dt><dd>{project.nextMilestone}</dd></div>
            <div><dt>Last updated</dt><dd>{project.lastUpdated}</dd></div>
          </dl>
        </section>
      </div>

      <section className="project-panel">
        <div className="project-panel__heading">
          <div><span className="eyebrow">EXPECTED FEATURES</span><h2>First concept scope</h2></div>
          <ListChecks size={21} />
        </div>
        <div className="project-feature-grid">
          {project.expectedFeatures.map((feature) => <div key={feature}><CheckCircle2 size={15} /><span>{feature}</span></div>)}
        </div>
      </section>

      <section className="project-panel project-later">
        <span className="eyebrow">AFTER THE FIRST CONCEPT</span>
        <h2>What comes later</h2>
        <div className="project-feature-grid project-feature-grid--later">
          {project.laterFeatures.map((feature) => <div key={feature}><span className="project-feature-dot" /><span>{feature}</span></div>)}
        </div>
      </section>

      <section className="project-panel project-qa">
        <div className="project-panel__heading">
          <div><span className="eyebrow">Q&A</span><h2>Common questions</h2></div>
          <HelpCircle size={21} />
        </div>
        <div className="project-qa__list">
          {project.qa.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
