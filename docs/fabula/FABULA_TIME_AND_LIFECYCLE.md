# Fabula Time and Lifecycle Simulation

Status: design specification  
Scope: Fabula living-world simulation  
Related systems: genealogy, heredity, relationships, world timeline, sessions, branching  

## Purpose

Fabula is a persistent living-world simulation. Time can pass, characters can age, children can develop into distinct people, pregnancies can progress, births can add new characters, and characters can eventually die while remaining part of world history.

This document records the current design decisions and separates confirmed direction from ideas that still need tuning.

---

## 1. Core boundary: Fabula and Speculus

### Confirmed

**Fabula is timeful.**

A Fabula world may progress through days, seasons, years, generations, births and deaths.

**Speculus is timeless.**

Speculus does not automatically advance age, pregnancy, seasons, lifespan, family growth, population or background world state. It is a controlled character-testing chamber.

Speculus may temporarily simulate a circumstance such as an older version of a character, winter conditions, or a hypothetical death, but the test itself does not advance a persistent world clock.

---

## 2. World calendar

### Confirmed

Every Fabula world should have its own internal calendar.

A character should not rely on a mutable stored age as the primary truth.

Prefer:

```text
birth_date: Year 431, Spring 12
current_world_date: Year 449, Autumn 3
calculated_age: 18
```

This keeps age, pregnancy, family trees, anniversaries and historical events synchronized.

The same principle should apply to dated world events wherever possible.

---

## 3. Active roleplay time

### Confirmed

Time during an active roleplay scene should follow the fiction rather than a fixed message-to-minute conversion.

Examples:

- A twenty-minute conversation advances roughly twenty world minutes.
- Sleeping until morning advances the clock to morning.
- A three-day journey advances three world days.
- Spending an afternoon fishing advances that afternoon.
- A scene may remain within a few minutes if very little in-world time passes.

Fabula should understand explicit and strongly implied time passage instead of forcing every generated message to consume the same amount of time.

---

## 4. Background world progression

### Planned

A Fabula world may optionally continue progressing while the user is away.

Possible presets:

```text
PAUSED
Only roleplay and manual time advancement move the world clock.

SLOW
Example: 1 real day = 2 world days.

NORMAL
Example: 1 real day = 1 world week.

FAST
Example: 1 real day = 1 world month.

CUSTOM
The worldbuilder chooses the progression rate.
```

The exact preset ratios are not final. They are tuning values.

### Important principle

Real-world time progression must never be the only way to age a world. Fabula needs explicit time skips so users do not have to wait real years for generational play.

---

## 5. Manual time advancement

### Confirmed direction

Fabula should support deliberate world advancement.

Possible controls:

```text
Advance to tomorrow
Advance one week
Advance one month
Advance one season
Advance one year
Custom...
```

During a larger skip, Fabula can simulate events that logically occur in the gap.

Potentially simulated changes include:

- aging
- birthdays
- pregnancy progression
- births
- illness progression or recovery
- healing
- changing relationships
- child development
- seasonal changes
- environmental changes
- movement between locations
- deaths

### Planned safeguard

World creators should be able to require approval for major irreversible events during unattended or large time skips.

Examples include:

- death of an established character
- destruction of an important location
- permanent disability
- major faction collapse
- other world-changing events

This prevents a time skip from casually erasing an important part of the user's intended story.

---

## 6. Species lifespan profiles

### Confirmed

Fabula should not use one universal lifespan for every character.

Life expectancy and development belong to the species definition.

A species life profile may contain:

```text
maturity_age
typical_lifespan
natural_lifespan_range
exceptional_maximum_age
pregnancy_duration
development_stages
ageing_rate
fertility_profile
```

A character does not automatically die when reaching the species' typical lifespan.

Typical lifespan is a population expectation, not a fixed death date.

Individual lifespan may be affected by:

- genetics
- inherited conditions
- illness
- injuries
- nutrition
- environment
- lifestyle
- accidents
- violence
- random variation

Age should gradually affect natural mortality rather than acting as a hard timer.

---

## 7. Development stages

### Confirmed direction

Species should be able to define their own development stages instead of Fabula assuming human development for every species.

A humanoid-like default might resemble:

```text
Infant
Young child
Child
Adolescent
Young adult
Mature
Elder
```

The age boundaries belong to the species profile and may differ substantially between species.

---

## 8. Childhood development

### Confirmed

A child born in Fabula should not arrive with a complete adult personality.

Personality and preferences should develop through a mixture of:

- inherited temperament
- parents and caregivers
- siblings
- friendships
- repeated treatment by other characters
- repeated treatment by the user
- culture
- home location
- society
- important memories
- major events
- repeated experiences
- personal choices

Repeated experiences should generally matter more than one isolated interaction.

### Example: positive development

If a child is repeatedly taken fishing by someone who is patient, kind and makes those outings enjoyable, the child may gradually develop:

- an interest in fishing
- comfort around rivers
- patience
- trust toward that person
- positive memories associated with the activity

### Example: negative development

If someone is repeatedly cruel, frightening or unreliable toward the child, possible results may include:

- distrust of that individual
- fear of raised voices
- avoidance
- guarded behavior
- negative memories

These are possible developments, not guaranteed scripted outcomes.

Two children can react differently to similar treatment because their temperament, history, relationships and other experiences differ.

---

## 9. Developmental plasticity

### Confirmed direction

External influence should be strongest early in life and gradually weaken as a character forms a more established identity.

Conceptually:

```text
Infant        very high external influence
Young child   high
Child         high to moderate
Adolescent    moderate
Young adult   lower
Mature        low
```

The exact values are not final and do not need to be exposed as visible percentages.

### Important clarification

Learning does **not** literally stop in adulthood.

Instead, ordinary interactions become less capable of rewriting a mature personality.

Major adult change can still happen through:

- long-term relationships
- sustained experiences
- deliberate personal growth
- major life events
- trauma
- major environmental changes
- significant losses or achievements

As characters mature, self-directed development should matter increasingly more than childhood-style external shaping.

---

## 10. Development provenance

### Experimental

Fabula may internally track what contributed to a developing trait, preference, fear or interest.

Example:

```text
Love of forests
Influences:
- parent interaction
- childhood home
- repeated exploration
- personal preference
```

This does not need to appear as artificial percentages during normal roleplay, but it could be useful in diagnostics and character-history inspection.

The purpose is to make development explainable rather than allowing traits to appear from nowhere.

---

## 11. Pregnancy and chronology

### Confirmed

Pregnancy should be tied to the world calendar.

Chronology validation should prevent structurally impossible states such as:

- a biological child being born before a biological parent
- a biological parent being younger than their child
- pregnancy ending before conception
- a normal biological birth occurring after the birthing parent has already died
- circular ancestry
- impossible generation ordering

### Integrity principle

Fabula should distinguish **impossible or contradictory** from **possible but unusual**.

Relationship choices should not be blocked merely because they violate a real-world social norm.

For example, reproduction between siblings or cousins is biologically possible and therefore is not rejected on moral grounds. The simulation may model biological consequences where appropriate, but the relationship itself is not prohibited by an application-authored morality rule.

World-authored biology or supernatural rules may explicitly override normal biological assumptions.

---

## 12. Birth creates a real character

### Confirmed

A birth in Fabula should create a real character record, not merely a decorative family-tree node.

The newborn may receive:

### Identity

- generated stable ID
- name when assigned
- world ID
- birth date
- birthplace

### Family

- biological parents
- siblings
- grandparents and ancestry links
- family membership
- family-tree position

### Biology

- species
- sex where the species uses it
- inherited appearance foundations
- inherited biological traits
- genetic markers or inherited conditions where modeled
- health state

### Development

- current developmental stage
- temperament foundations
- age derived from world time

### World links

- home location
- family
- relevant society or faction links
- birth-event memory

A birth can update multiple systems at once:

```text
Character population
Family tree
World timeline
Relationships
Inheritance / heredity data
Relevant memories
```

---

## 13. Heredity

### Confirmed direction

Biological children may inherit meaningful biological information from their parents.

Potential inherited information includes:

- species characteristics
- physical appearance
- biological traits
- inherited conditions
- recessive traits
- fertility tendencies
- species-specific genetics

Fabula should avoid simplistic personality inheritance such as:

```text
Father is aggressive -> child gets Aggressive +15
```

Most personality should develop through life and experience. Biology should contribute only where it meaningfully belongs.

---

## 14. Repeated close ancestry and genetic risk

### Experimental

Fabula may calculate ancestry relatedness or an inbreeding-coefficient-like value from the real genealogy graph.

Repeated close-relative reproduction across generations may increase the probability of recessive conditions or other biological complications.

Possible modeled effects may include, depending on species and world rules:

- recessive conditions becoming expressed
- fertility complications
- pregnancy complications
- developmental differences
- immune weakness
- stillbirth risk
- other inherited biological problems

### Important rule

This must be probabilistic rather than punitive.

A close-relative pairing does not automatically produce an unhealthy child, and the system must not frame the result as moral punishment.

The genealogy and biology determine probability.

---

## 15. Family tree and genealogy

### Confirmed direction

Fabula should eventually support a true genealogy system driven by actual character and relationship records.

The tree should not maintain a second independent version of canon.

Editing the underlying family relationship should update the tree, and tree editing should update the same underlying records.

The genealogy system should be capable of representing:

- biological parents
- children
- siblings
- half-siblings
- grandparents
- multiple generations
- mates
- spouses
- multiple partners
- adoption
- guardianship
- wards
- unknown parents
- clan or non-biological lineage
- species-specific family structures
- deceased ancestors

### Integrity

The graph must prevent ancestry loops such as:

```text
A is parent of B
B is parent of C
C is parent of A
```

This should produce a clear validation error rather than creating an infinite or contradictory tree.

---

## 16. Death is not deletion

### Confirmed

This is a core Fabula rule:

**Dead is not deleted.**

Deletion means that a record should no longer exist as part of canon.

Death means that the character existed, affected the world, and is now part of its history.

A deceased character remains connected to:

- family trees
- descendants
- old relationships
- memories
- historical events
- previous roleplay
- factions and societies
- inheritance
- possessions where tracked
- world history

Possible lifecycle states may include:

```text
Alive
Critical / Dying
Dead
Missing
Presumed dead
```

World-specific systems may additionally support states such as:

```text
Undead
Resurrected
```

only when the authored world permits them.

---

## 17. Causes of death

### Confirmed direction

Characters may die through causes including:

- old age
- sickness
- accidents
- injuries
- murder
- environmental hazards
- other world-authored causes

A death should generate a permanent world event.

Potential event data:

```text
character_id
death_date
death_location
cause
circumstances
witnesses
body_status
burial_or_resting_place
known_information
private_information
```

---

## 18. Death by old age

### Planned

Natural aging should use a mortality curve rather than a fixed maximum-age trigger.

As a character enters the later portion of the species lifespan, the chance of natural health decline and death can rise.

Exceptional longevity remains possible within or, rarely, beyond the normal species range where world rules permit it.

---

## 19. Death from sickness

### Planned

A sickness-related death may interact with other simulation systems.

Fabula may track:

- illness type
- contagiousness
- exposure
- carers
- attempted treatment
- progression
- recovery or death
- memories created by the illness

These details should depend on how sophisticated the world's health and disease simulation becomes.

---

## 20. Accidental death

### Planned

Accidents should remain world events with consequences beyond the victim.

Possible follow-on effects include:

- witness memories
- survivor fears
- reputation changes for a dangerous location
- investigation into the circumstances
- changes to family or faction roles

---

## 21. Murder and knowledge separation

### Confirmed

Fabula must distinguish objective world truth from what individual characters know or believe.

Example:

```text
Canonical truth:
Arrax killed Torren.

Known by:
- Arrax
- one witness

Public explanation:
Torren disappeared in the forest.

Suspected by:
Nobody yet.
```

The simulation knowing the killer does **not** give that knowledge to every character.

A murder event may track:

- victim
- killer if known to the simulation
- witnesses
- evidence
- suspects
- motives
- location
- method or weapon where relevant
- investigation state
- who knows the truth
- who believes an incorrect explanation

This supports investigations, secrets, rumors, false accusations, revenge and later discoveries without knowledge leaking across characters.

---

## 22. Death affects survivors

### Confirmed direction

Death may influence surviving characters through the same memory and development systems that shape them during life.

The effect depends on factors such as:

- relationship strength
- developmental age
- whether they witnessed the death
- circumstances of death
- existing temperament
- previous experiences
- support from others afterward

A very young child may retain little direct memory of a deceased parent.

An older child who witnessed a violent death may retain a strong memory and develop fears, attitudes or behavior influenced by the event.

The outcome should be character-specific rather than a universal scripted grief response.

---

## 23. Inheritance after death

### Planned

Death may trigger non-genetic inheritance systems where relevant to the world.

Potential inheritance includes:

- possessions
- titles
- family roles
- clan responsibilities
- social status
- leadership positions
- debts or obligations

Inheritance rules should come from the authored world, family, faction or society rather than a universal modern legal model.

---

## 24. New session versus new world state

### Confirmed

Starting a new Fabula chat should not normally reset the world.

A fresh conversation and a fresh reality are different actions.

Suggested concepts:

### Continue

Continue an existing conversation in its current world state.

### New Session

Start a fresh conversation while using the same persistent world/timeline state.

### Branch From Here

Fork the current state into an alternative timeline.

### Start From Canon

Create a fresh runtime timeline from the authored baseline without destroying the existing living timeline.

The UI must make these choices clear so users do not accidentally reset or fork a world when they only wanted a new conversation.

---

## 25. Timeline branching

### Confirmed direction

Fabula should support alternative histories.

Example:

```text
Bitterroot
|
|-- Main Timeline
|   `-- Year 449
|
|-- Ragna Survived
|   `-- forked from Year 442
|
`-- Before the Flood
    `-- forked from Year 431
```

Each timeline may have its own:

- current world date
- character ages
- births
- deaths
- relationships
- character development
- family trees
- memories
- location state
- population
- faction and society state
- other runtime world changes

Branches begin from a known canonical or runtime state and then evolve independently.

---

## 26. Time skips and child development

### Planned

When a child ages during a large time skip, Fabula should not simply increase the age number.

Development during the skipped period may be inferred from:

- family environment
- caregivers
- home location
- society and culture
- established temperament
- existing relationships
- previous interests and fears
- major world events during the skip

The system should avoid inventing extreme personality changes without sufficient cause.

Where a skipped period contains important uncertain development, Fabula may summarize proposed changes for approval or keep them conservative.

---

## 27. Information authority during simulation

### Confirmed principle

Simulation must preserve authored canon and world rules.

Fabula should not introduce application-authored morality, romance restrictions, social norms or generic judgments as if they were world canon.

Simulation validity should primarily ask:

1. Is it structurally possible under this world's rules?
2. Is it chronologically consistent?
3. Does it contradict established canon?
4. Does the relevant character actually know this information?
5. Is the consequence supported by the character's history and world state?

Unusual is not the same as impossible.

---

## 28. Current confirmed principles

The following are treated as the strongest current design decisions:

1. Fabula is a living world with persistent time.
2. Speculus is timeless.
3. Age derives from birth date plus current world date.
4. Species control lifespan and development profiles.
5. Children develop through temperament, environment, relationships and experience.
6. Early life has greater developmental plasticity than mature life.
7. Learning does not completely stop at adulthood.
8. Pregnancy and ancestry must obey chronology unless authored world rules explicitly override normal biology.
9. Birth creates a real persistent character.
10. Genealogy is based on actual relationships, not a separate decorative tree.
11. Genetic risks are probabilistic and based on ancestry, not moral judgment.
12. Death is a historical state, not deletion.
13. Death can affect survivors and future generations.
14. Objective truth and character knowledge must remain separate.
15. A new session does not automatically mean a new timeline.
16. Timeline branches evolve independently after their fork point.
17. Large time skips may simulate world change but need controls for irreversible events.

---

## 29. Still needs decisions

The following details remain open and should not yet be treated as final implementation constants:

- exact default real-time-to-world-time speed
- which progression preset should be the default
- whether worlds progress while nobody is online by default
- exact mortality curves
- exact development/plasticity curves
- default species lifespan values
- how much autonomous simulation occurs during large time skips
- which irreversible events require approval by default
- detailed pregnancy/fertility simulation depth
- depth of genetic modeling
- whether genetic coefficients are visible to ordinary users or diagnostics only
- inheritance system depth
- UI for branches, world dates and lifecycle history
- rules for resolving conflicting simultaneous events during background simulation

---

## 30. Long-term generational goal

Fabula should eventually support a continuous chain such as:

```text
birth
  -> childhood
  -> learning and development
  -> adolescence
  -> adulthood
  -> relationships
  -> family / descendants
  -> aging
  -> illness, accident or natural decline
  -> death
  -> inheritance and memories
  -> descendants continuing the world
```

The important part is not simply that characters can be born and die.

The important part is that the world remembers how they lived, what shaped them, who they affected, what they left behind, and how later generations grew from that history.
