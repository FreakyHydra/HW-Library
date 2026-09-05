import './style.css'
import { mockAssets } from './mock-assets'
import type { AssetKind, LibraryAsset } from './types'

const app = document.querySelector<HTMLDivElement>('#app')!

const categories: Array<{ kind: AssetKind | 'all'; label: string; glyph: string }> = [
  { kind: 'all', label: 'All Assets', glyph: '✦' },
  { kind: 'character', label: 'Characters', glyph: '◉' },
  { kind: 'place', label: 'Places', glyph: '⌂' },
  { kind: 'world', label: 'Worlds', glyph: '◎' },
  { kind: 'faction', label: 'Factions', glyph: '◆' },
  { kind: 'species', label: 'Species', glyph: '◇' },
  { kind: 'society', label: 'Societies', glyph: '◌' },
  { kind: 'family', label: 'Families', glyph: '⌁' },
  { kind: 'memory', label: 'Memories', glyph: '✧' },
]

let activeKind: AssetKind | 'all' = 'all'
let query = ''

function sourceLabel(asset: LibraryAsset): string {
  switch (asset.source) {
    case 'imported-v2': return 'IMPORTED V2'
    case 'copied': return 'COPIED'
    case 'public': return 'PUBLIC'
    default: return 'CURATED'
  }
}

function filteredAssets(): LibraryAsset[] {
  const normalized = query.trim().toLowerCase()
  return mockAssets.filter((asset) => {
    if (activeKind !== 'all' && asset.kind !== activeKind) return false
    if (!normalized) return true
    return [asset.name, asset.description, asset.originWorld ?? '', ...asset.tags]
      .join(' ')
      .toLowerCase()
      .includes(normalized)
  })
}

function assetCard(asset: LibraryAsset): string {
  const origin = asset.originWorld ? `FROM ${asset.originWorld.toUpperCase()}` : 'ROOT ASSET'
  const monogram = asset.name.trim().slice(0, 2).toUpperCase() || 'HW'

  return `
    <article class="asset-card" data-kind="${asset.kind}">
      <div class="asset-art" aria-hidden="true">
        <span>${monogram}</span>
        <i></i>
      </div>
      <div class="asset-body">
        <div class="asset-meta">
          <span>${asset.kind.toUpperCase()}</span>
          <span>${sourceLabel(asset)}</span>
        </div>
        <h2>${asset.name}</h2>
        <p>${asset.description}</p>
        <div class="tag-row">${asset.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join('')}</div>
        <div class="asset-origin">${origin}</div>
      </div>
      <div class="asset-actions">
        <button class="simulate-button" type="button" data-simulate="${asset.id}">SIMULATE</button>
        <button class="ghost-button" type="button" data-open="${asset.id}">OPEN</button>
        <button class="more-button" type="button" aria-label="More actions for ${asset.name}">•••</button>
      </div>
    </article>
  `
}

function renderGrid(): void {
  const grid = app.querySelector<HTMLElement>('#asset-grid')
  const count = app.querySelector<HTMLElement>('#result-count')
  if (!grid || !count) return
  const assets = filteredAssets()
  count.textContent = `${assets.length} ${assets.length === 1 ? 'asset' : 'assets'}`
  grid.innerHTML = assets.length
    ? assets.map(assetCard).join('')
    : `<div class="empty-state"><span>☾</span><h2>Nothing found in this moonlight</h2><p>Try another search or category.</p></div>`
}

app.innerHTML = `
  <div class="library-shell">
    <aside class="library-sidebar">
      <a class="brand" href="#" aria-label="Howling Whispers Library home">
        <span class="brand-mark">HW</span>
        <span><strong>Howling Whispers</strong><small>LIBRARY</small></span>
      </a>

      <nav class="category-nav" aria-label="Library categories">
        <p>YOUR LIBRARY</p>
        ${categories.map((category) => `
          <button type="button" data-category="${category.kind}" class="${category.kind === activeKind ? 'active' : ''}">
            <span>${category.glyph}</span>${category.label}
          </button>
        `).join('')}
      </nav>

      <div class="sidebar-note">
        <span>☾</span>
        <div><strong>Warm Moonlight</strong><p>Your reusable worlds and creations live here.</p></div>
      </div>
    </aside>

    <main class="library-main">
      <header class="topbar">
        <div class="search-wrap">
          <span>⌕</span>
          <input id="library-search" type="search" placeholder="Search characters, places, worlds, tags..." autocomplete="off" />
        </div>
        <div class="top-actions">
          <button type="button" class="top-icon" title="Favorites">♡</button>
          <button type="button" class="profile-placeholder">GUEST</button>
        </div>
      </header>

      <section class="hero-panel">
        <div>
          <p class="eyebrow">THE HOWLING WHISPERS LIBRARY</p>
          <h1>Everything you've created,<br /><em>waiting to live again.</em></h1>
          <p class="hero-copy">Browse, recycle, export, and eventually simulate any reusable piece of your worlds without entering the whole reality first.</p>
        </div>
        <div class="moon-orbit" aria-hidden="true"><span>☾</span><i></i><i></i></div>
      </section>

      <section class="library-heading">
        <div>
          <p class="eyebrow">COLLECTION</p>
          <h2>Browse your assets</h2>
        </div>
        <div class="library-heading-actions">
          <span id="result-count"></span>
          <button type="button" class="view-button active" aria-label="Card view">▦</button>
          <button type="button" class="view-button" aria-label="Compact view" disabled>☷</button>
        </div>
      </section>

      <section id="asset-grid" class="asset-grid"></section>
    </main>
  </div>
`

app.querySelectorAll<HTMLButtonElement>('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    activeKind = button.dataset.category as AssetKind | 'all'
    app.querySelectorAll('[data-category]').forEach((item) => item.classList.toggle('active', item === button))
    renderGrid()
  })
})

app.querySelector<HTMLInputElement>('#library-search')?.addEventListener('input', (event) => {
  query = (event.currentTarget as HTMLInputElement).value
  renderGrid()
})

app.addEventListener('click', (event) => {
  const simulate = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-simulate]')
  if (simulate) {
    const asset = mockAssets.find((item) => item.id === simulate.dataset.simulate)
    if (asset) window.alert(`Project Whispers integration is not connected yet.\n\nSimulation target: ${asset.name}`)
  }
})

renderGrid()
