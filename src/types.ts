export type AssetKind =
  | 'character'
  | 'place'
  | 'world'
  | 'faction'
  | 'species'
  | 'society'
  | 'family'
  | 'memory'

export type AssetSource = 'curated' | 'imported-v2' | 'copied' | 'public'

export interface LibraryAsset {
  id: string
  kind: AssetKind
  name: string
  description: string
  originWorld?: string
  source: AssetSource
  tags: string[]
  image?: string
  updatedAt: string
}
