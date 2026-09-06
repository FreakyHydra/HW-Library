import { Copy, Plus, Save, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { libraryApi } from '../api/client';
import type { ContentRating, LibraryAsset, LibraryAssetUpdate } from '../types/library';

type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;
type JsonObject = { [key: string]: JsonValue };

type TabId = 'identity' | 'lore' | 'places' | 'people' | 'societies' | 'families' | 'memory' | 'rules' | 'time';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'identity', label: 'Identity' },
  { id: 'lore', label: 'Lore' },
  { id: 'places', label: 'Places' },
  { id: 'people', label: 'Species & Factions' },
  { id: 'societies', label: 'Peoples & Societies' },
  { id: 'families', label: 'Family Trees' },
  { id: 'memory', label: 'Memory & Timeline' },
  { id: 'rules', label: 'Rules' },
  { id: 'time', label: 'Time & Weather' },
];

const isObject = (value: JsonValue | undefined): value is JsonObject => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const asObject = (value: JsonValue | undefined): JsonObject => isObject(value) ? value : {};
const asArray = (value: JsonValue | undefined): JsonValue[] => Array.isArray(value) ? value : [];
const asString = (value: JsonValue | undefined): string => typeof value === 'string' ? value : '';
const asNumber = (value: JsonValue | undefined, fallback = 0): number => typeof value === 'number' ? value : fallback;
const asBoolean = (value: JsonValue | undefined): boolean => Boolean(value);
const labelOf = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/^./, (letter) => letter.toUpperCase());

function lines(value: JsonValue | undefined): string {
  return asArray(value).map(String).join('\n');
}

function updateObject(root: JsonObject, key: string, childKey: string, value: JsonValue): JsonObject {
  const child = asObject(root[key]);
  return { ...root, [key]: { ...child, [childKey]: value } };
}

function TextField({ label, value, rows, onChange }: { label: string; value: string; rows?: number; onChange: (value: string) => void }) {
  return <label className="forge-field"><span>{label}</span>{rows ? <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function EntityArrayEditor({ label, value, onChange }: { label: string; value: JsonValue | undefined; onChange: (value: JsonValue[]) => void }) {
  const items = asArray(value).filter(isObject);
  const blankFrom = (item?: JsonObject): JsonObject => {
    if (!item) return { id: crypto.randomUUID(), name: '', description: '' };
    return Object.fromEntries(Object.entries(item).map(([key, child]) => {
      if (key === 'id') return [key, crypto.randomUUID()];
      if (typeof child === 'string') return [key, ''];
      if (typeof child === 'number') return [key, 0];
      if (typeof child === 'boolean') return [key, false];
      if (Array.isArray(child)) return [key, []];
      if (isObject(child)) return [key, {}];
      return [key, null];
    }));
  };
  const updateItem = (index: number, key: string, next: JsonValue) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  return <div className="forge-entity-stack">
    {items.length === 0 && <p className="forge-empty">No {label.toLocaleLowerCase()} defined yet.</p>}
    {items.map((item, index) => {
      const name = asString(item.name) || asString(item.title) || `${label} ${index + 1}`;
      return <article className="forge-entity-card" key={asString(item.id) || `${label}-${index}`}>
        <header><div><span className="eyebrow">{label}</span><strong>{name}</strong></div><div className="forge-card-actions"><button type="button" className="icon-button" title="Duplicate" onClick={() => onChange([...items.slice(0, index + 1), { ...structuredClone(item), id: crypto.randomUUID() }, ...items.slice(index + 1)])}><Copy size={14} /></button><button type="button" className="icon-button danger" title="Remove" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button></div></header>
        <div className="forge-entity-fields">{Object.entries(item).filter(([key]) => key !== 'id').map(([key, child]) => {
          if (Array.isArray(child)) return <label className="forge-field forge-field--wide" key={key}><span>{labelOf(key)}</span><textarea rows={3} value={child.map(String).join('\n')} onChange={(event) => updateItem(index, key, event.target.value.split('\n').map((line) => line.trim()).filter(Boolean))} /><small>One item per line</small></label>;
          if (typeof child === 'boolean') return <label className="forge-toggle" key={key}><input type="checkbox" checked={child} onChange={(event) => updateItem(index, key, event.target.checked)} /><span>{labelOf(key)}</span></label>;
          if (typeof child === 'number') return <label className="forge-field" key={key}><span>{labelOf(key)}</span><input type="number" value={child} onChange={(event) => updateItem(index, key, Number(event.target.value))} /></label>;
          if (isObject(child)) return null;
          const text = child == null ? '' : String(child);
          const long = text.length > 90 || /description|origin|notes|custom|belief|structure|making|livelihood/i.test(key);
          return <label className={`forge-field ${long ? 'forge-field--wide' : ''}`} key={key}><span>{labelOf(key)}</span>{long ? <textarea rows={3} value={text} onChange={(event) => updateItem(index, key, event.target.value)} /> : <input value={text} onChange={(event) => updateItem(index, key, event.target.value)} />}</label>;
        })}</div>
      </article>;
    })}
    <button type="button" className="button button--secondary forge-add" onClick={() => onChange([...items, blankFrom(items[0])])}><Plus size={15} /> Add {label.toLocaleLowerCase()}</button>
  </div>;
}

function TimeWeatherEditor({ document, onChange }: { document: JsonObject; onChange: (document: JsonObject) => void }) {
  const timeWeather = asObject(document.timeWeather);
  const seasons = asArray(timeWeather.seasons).filter(isObject);
  const update = (key: string, value: JsonValue) => onChange({ ...document, timeWeather: { ...timeWeather, [key]: value } });
  const updateSeason = (index: number, key: string, value: JsonValue) => update('seasons', seasons.map((season, itemIndex) => itemIndex === index ? { ...season, [key]: value } : season));
  const seasonName = (season: JsonObject, index: number) => asString(season.name) || ['Spring', 'Summer', 'Autumn', 'Winter'][index] || `Season ${index + 1}`;

  return <section className="forge-module">
    <header className="forge-module__title"><div><span className="eyebrow">World Module 09</span><h2>Time & Weather</h2></div><small>CALENDAR · SEASONS · WEATHER</small></header>
    <div className="forge-grid forge-grid--3">
      <TextField label="Mode" value={asString(timeWeather.mode)} onChange={(value) => update('mode', value)} />
      <TextField label="Preset" value={asString(timeWeather.preset)} onChange={(value) => update('preset', value)} />
      <TextField label="Climate" value={asString(timeWeather.climate)} onChange={(value) => update('climate', value)} />
    </div>
    <div className="forge-season-grid">
      {seasons.map((season, index) => <article className="forge-season" key={asString(season.id) || `${index}`}>
        <header><strong>{seasonName(season, index)}</strong><span>{asNumber(season.lengthDays, 1)} days</span></header>
        <TextField label="Season name" value={seasonName(season, index)} onChange={(value) => updateSeason(index, 'name', value)} />
        <label className="forge-field"><span>Length days</span><input type="number" min={1} value={asNumber(season.lengthDays, 1)} onChange={(event) => updateSeason(index, 'lengthDays', Math.max(1, Number(event.target.value)))} /></label>
        <TextField label="Weather prompt" rows={4} value={asString(season.weatherPrompt)} onChange={(value) => updateSeason(index, 'weatherPrompt', value)} />
      </article>)}
    </div>
    <div className="forge-grid forge-grid--3">
      <label className="forge-field"><span>Hours per day</span><input type="number" value={asNumber(timeWeather.hoursPerDay, 24)} onChange={(event) => update('hoursPerDay', Number(event.target.value))} /></label>
      <label className="forge-field"><span>Starting day</span><input type="number" value={asNumber(timeWeather.startingDay, 1)} onChange={(event) => update('startingDay', Number(event.target.value))} /></label>
      <label className="forge-field"><span>Starting hour</span><input type="number" value={asNumber(timeWeather.startingHour, 8)} onChange={(event) => update('startingHour', Number(event.target.value))} /></label>
      <label className="forge-field"><span>Minutes per input</span><input type="number" value={asNumber(timeWeather.minutesPerInput, 1)} onChange={(event) => update('minutesPerInput', Number(event.target.value))} /></label>
      <label className="forge-field"><span>Simple day real minutes</span><input type="number" value={asNumber(timeWeather.simpleDayRealMinutes, 20)} onChange={(event) => update('simpleDayRealMinutes', Number(event.target.value))} /></label>
      <TextField label="Weather mode" value={asString(timeWeather.weatherMode)} onChange={(value) => update('weatherMode', value)} />
    </div>
    <div className="forge-toggle-row"><label className="forge-toggle"><input type="checkbox" checked={asBoolean(timeWeather.seasonsEnabled)} onChange={(event) => update('seasonsEnabled', event.target.checked)} /><span>Seasons enabled</span></label><label className="forge-toggle"><input type="checkbox" checked={asBoolean(timeWeather.pauseWhenInactive)} onChange={(event) => update('pauseWhenInactive', event.target.checked)} /><span>Pause when inactive</span></label></div>
    <TextField label="Weather simulation guidance" rows={6} value={asString(timeWeather.weatherPrompt)} onChange={(value) => update('weatherPrompt', value)} />
  </section>;
}

function ContextPreview({ document }: { document: JsonObject }) {
  const identity = asObject(document.identity);
  const rules = asObject(document.rules);
  const time = asObject(document.timeWeather);
  const counts = [
    ['Species', asArray(document.species).length],
    ['Places', asArray(document.locations).length],
    ['Societies', asArray(document.societies).length],
    ['Families', asArray(document.families).length],
    ['Factions', asArray(document.factions).length],
    ['Memories', asArray(document.memories).length],
  ];
  const seasons = asArray(time.seasons).filter(isObject).map((season, index) => asString(season.name) || ['Spring', 'Summer', 'Autumn', 'Winter'][index] || `Season ${index + 1}`);
  return <aside className="forge-context">
    <div className="forge-context__sigil">{(asString(identity.name) || 'W').slice(0, 1).toUpperCase()}</div>
    <span className="eyebrow">Living Reality Container</span>
    <h2>{asString(identity.name) || 'Untitled world'}</h2>
    <p>{asString(identity.description) || 'Define the reality that every character will grow inside.'}</p>
    <div className="forge-context__facts">
      {asString(identity.genre) && <p><strong>Genre:</strong> {asString(identity.genre)}</p>}
      {asString(identity.tone) && <p><strong>Tone:</strong> {asString(identity.tone)}</p>}
      {asString(rules.technology) && <p><strong>Technology:</strong> {asString(rules.technology)}</p>}
      {asString(rules.magicPhysics) && <p><strong>Magic / physics:</strong> {asString(rules.magicPhysics)}</p>}
      {time.hoursPerDay != null && <p><strong>Time:</strong> {asNumber(time.hoursPerDay, 24)}h day · {asNumber(time.minutesPerInput, 1)}m/input</p>}
      {seasons.length > 0 && <p><strong>Seasons:</strong> {seasons.join(', ')}</p>}
      {asString(time.climate) && <p><strong>Climate:</strong> {asString(time.climate)}</p>}
    </div>
    <div className="forge-context__counts">{counts.map(([label, count]) => <span key={String(label)}><b>{count}</b>{label}</span>)}</div>
  </aside>;
}

export function WorldForgeEditor({ asset }: { asset: LibraryAsset }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('identity');
  const [name, setName] = useState(asset.name);
  const [summary, setSummary] = useState(asset.summary);
  const [contentRating] = useState<ContentRating>(asset.contentRating ?? 'sfw');
  const [tags] = useState(asset.tags.join('\n'));
  const [visualTone] = useState<LibraryAsset['visualTone']>(asset.visualTone);
  const [document, setDocument] = useState<JsonObject>(() => structuredClone(asset.document ?? {}) as JsonObject);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const identity = asObject(document.identity);
  const lore = asObject(document.lore);
  const rules = asObject(document.rules);
  const markDocument = (next: JsonObject) => { setDocument(next); setDirty(true); setMessage(''); };
  const updateIdentity = (key: string, value: JsonValue) => {
    const next = updateObject(document, 'identity', key, value);
    if (key === 'name') setName(String(value));
    if (key === 'description') setSummary(String(value).slice(0, 2000));
    markDocument(next);
  };

  const payload = useMemo<LibraryAssetUpdate>(() => ({
    name: name.trim(), summary: summary.trim(), contentRating,
    tags: tags.split('\n').map((tag) => tag.trim()).filter(Boolean), visualTone, document,
  }), [contentRating, document, name, summary, tags, visualTone]);

  const save = useCallback(async () => {
    if (!payload.name) return setMessage('World name is required.');
    setSaving(true); setMessage('');
    try {
      await libraryApi.updateAsset(asset.id, payload);
      setDirty(false); setMessage('World saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The world could not be saved.');
    } finally { setSaving(false); }
  }, [asset.id, payload]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    const shortcut = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void save(); } };
    window.addEventListener('beforeunload', beforeUnload); window.addEventListener('keydown', shortcut);
    return () => { window.removeEventListener('beforeunload', beforeUnload); window.removeEventListener('keydown', shortcut); };
  }, [dirty, save]);

  return <div className="world-forge">
    <header className="forge-toolbar">
      <div><span className="eyebrow">World Forge · Root Object</span><h1>{name}</h1></div>
      <div className="forge-toolbar__actions"><span className={dirty ? 'editor-dirty is-dirty' : 'editor-dirty'}>{dirty ? 'Unsaved world changes' : 'World root saved'}</span><button type="button" className="button button--secondary" onClick={() => navigate(`/asset/${asset.id}`)}>Cancel</button><button type="button" className="button button--primary" disabled={saving} onClick={() => void save()}><Save size={16} /> {saving ? 'Saving...' : 'Save world'}</button></div>
    </header>

    <nav className="forge-tabs" aria-label="World editor sections">{tabs.map((tab) => <button key={tab.id} type="button" className={activeTab === tab.id ? 'is-active' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</nav>

    <div className="forge-workbench">
      <main>
        {activeTab === 'identity' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 01</span><h2>Identity</h2></div><small>THE REALITY CONTAINER</small></header><div className="forge-grid forge-grid--3"><TextField label="World name" value={asString(identity.name) || name} onChange={(value) => updateIdentity('name', value)} /><TextField label="Genre" value={asString(identity.genre)} onChange={(value) => updateIdentity('genre', value)} /><TextField label="Tone" value={asString(identity.tone)} onChange={(value) => updateIdentity('tone', value)} /></div><TextField label="Description" rows={8} value={asString(identity.description)} onChange={(value) => updateIdentity('description', value)} /><div className="forge-inheritance"><span className="forge-lamp" /><div><strong>{asset.dependencyCount} connected records</strong><p>World-linked records remain connected to this root object and inherit relevant authored context.</p></div></div></section>}

        {activeTab === 'lore' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 02</span><h2>Lore</h2></div><small>HISTORY · CULTURE · FACT</small></header><TextField label="History" rows={7} value={asString(lore.history)} onChange={(value) => markDocument(updateObject(document, 'lore', 'history', value))} /><TextField label="Cultures" rows={6} value={asString(lore.cultures)} onChange={(value) => markDocument(updateObject(document, 'lore', 'cultures', value))} /><TextField label="Customs" rows={6} value={asString(lore.customs)} onChange={(value) => markDocument(updateObject(document, 'lore', 'customs', value))} /><label className="forge-field"><span>Important facts</span><textarea rows={7} value={lines(lore.importantFacts)} onChange={(event) => markDocument(updateObject(document, 'lore', 'importantFacts', event.target.value.split('\n').map((line) => line.trim()).filter(Boolean)))} /><small>One durable fact per line</small></label></section>}

        {activeTab === 'places' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 03</span><h2>Places</h2></div><small>REGIONS · SETTLEMENTS · LANDMARKS</small></header><EntityArrayEditor label="Place" value={document.locations} onChange={(value) => markDocument({ ...document, locations: value })} /></section>}

        {activeTab === 'people' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 04</span><h2>People of the world</h2></div><small>SPECIES · FACTIONS</small></header><div className="forge-split"><div><h3>Species</h3><EntityArrayEditor label="Species" value={document.species} onChange={(value) => markDocument({ ...document, species: value })} /></div><div><h3>Factions</h3><EntityArrayEditor label="Faction" value={document.factions} onChange={(value) => markDocument({ ...document, factions: value })} /></div></div></section>}

        {activeTab === 'societies' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 05</span><h2>Peoples & Societies</h2></div><small>CLANS · TRIBES · HOUSEHOLDS · SETTLEMENTS</small></header><EntityArrayEditor label="Society" value={document.societies} onChange={(value) => markDocument({ ...document, societies: value })} /></section>}

        {activeTab === 'families' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 06</span><h2>Family Trees</h2></div><small>KINSHIP · ADOPTION · GUARDIANSHIP</small></header><EntityArrayEditor label="Family" value={document.families} onChange={(value) => markDocument({ ...document, families: value })} /></section>}

        {activeTab === 'memory' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 07</span><h2>Memory & Timeline</h2></div><small>EVENTS · CONSEQUENCES · PERSISTENT MEMORY</small></header><EntityArrayEditor label="Memory" value={document.memories} onChange={(value) => markDocument({ ...document, memories: value })} /></section>}

        {activeTab === 'rules' && <section className="forge-module"><header className="forge-module__title"><div><span className="eyebrow">World Module 08</span><h2>Rules</h2></div><small>TECHNOLOGY · SOCIETY · PHYSICS · CONSTRAINTS</small></header><TextField label="Technology" rows={6} value={asString(rules.technology)} onChange={(value) => markDocument(updateObject(document, 'rules', 'technology', value))} /><TextField label="Society" rows={6} value={asString(rules.society)} onChange={(value) => markDocument(updateObject(document, 'rules', 'society', value))} /><TextField label="Magic / physics" rows={6} value={asString(rules.magicPhysics)} onChange={(value) => markDocument(updateObject(document, 'rules', 'magicPhysics', value))} /><label className="forge-field"><span>Constraints</span><textarea rows={8} value={lines(rules.constraints)} onChange={(event) => markDocument(updateObject(document, 'rules', 'constraints', event.target.value.split('\n').map((line) => line.trim()).filter(Boolean)))} /><small>One durable world constraint per line</small></label></section>}

        {activeTab === 'time' && <TimeWeatherEditor document={document} onChange={markDocument} />}
      </main>
      <ContextPreview document={document} />
    </div>
    <footer className="forge-footer"><span role="status">{message}</span><small>Ctrl+S saves the world.</small></footer>
  </div>;
}
