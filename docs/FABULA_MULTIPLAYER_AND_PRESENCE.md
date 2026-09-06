# Fabula Multiplayer and Shared Presence

Status: design specification  
Scope: Fabula shared-world multiplayer presence  
Related systems: locations, private roleplay, world state, user identity, permissions, presence, events  

## Purpose

Fabula is not only a world containing AI characters. Other real users may also exist inside the same authored world and may be present in the same location at the same time.

The multiplayer model is built around **shared presence without exposing private AI roleplay**.

A user can know that another user is nearby without automatically seeing that user's conversation with AI characters.

This is a core privacy boundary, not an optional presentation detail.

---

## 1. Core multiplayer model

### Confirmed

Fabula is a shared roleplay world rather than a conventional multiplayer chat room.

A Fabula world may contain, at the same time:

- AI characters
- authored locations
- persistent world state
- one or more real users
- each user's active persona or player character

Users may move independently through the world.

Two users can therefore be in different places, or they can arrive at the same place at the same time.

Examples:

```text
Bitterroot
|
|-- Whispering Woods
|   |-- User A
|   `-- AI characters
|
|-- Brackenjaw Tavern
|   |-- User B
|   |-- User C
|   `-- AI characters
|
`-- Bitterroot Bluffs
    `-- User D
```

---

## 2. Location presence

### Confirmed

When other users are in the same location, Fabula should be able to show that presence in the interface.

A side panel may contain a section such as:

```text
People here

Derkomor
Eirvargr
Another player
```

The exact visual design is not final, but the information model is.

Presence should be location-based, not global by default.

A user inside a tavern should not automatically see a list of everyone currently somewhere else in the world.

Likewise, a user inside an adult location such as a brothel may see which other users are also present there, subject to the world's access rules and the users' permissions.

---

## 3. Presence is not conversation access

### Core privacy rule

**Being in the same location does not grant access to another user's private AI conversation.**

If User A is speaking privately with an AI character and User B enters the same location, User B may be able to see that User A is present.

User B must not automatically receive:

- User A's prompts
- AI replies generated for User A
- private scene narration
- private sexual or romantic roleplay
- private character memories revealed in that session
- private author notes
- private system or model context
- private branches or rerolls

Shared presence and private AI roleplay are separate channels of state.

---

## 4. Example: tavern

### Confirmed behavior

Suppose Eirvargr is in a tavern speaking privately with an AI character.

Derkomor enters the same tavern.

Derkomor may see:

```text
People here
- Eirvargr
```

Derkomor does **not** see the private conversation Eirvargr is having with the AI character.

The world can still know both users occupy the same authored location.

This allows the tavern to feel inhabited without turning every AI interaction into a public chat log.

---

## 5. Example: adult location

### Confirmed behavior

The same privacy rule applies in adult or intimate locations.

If several users are present in a brothel, private room, bathhouse, bedroom, clinic, or other sensitive location, their presence may be visible where the world and access rules permit it.

Their private AI roleplay remains private unless a separate explicit shared interaction is created.

The application must never infer that entering the same adult location means consenting to share private conversation content.

---

## 6. User-to-user interaction

### Confirmed direction

Seeing another user in the same location should make direct interaction possible, but it should be a separate action from private AI roleplay.

Potential interaction models include:

- greet another user
- send an interaction request
- open a shared scene
- join a shared conversation by consent
- leave the shared scene and return to private roleplay

A shared scene should have a clearly defined participant list.

Users who are merely present in the same location are not automatically participants.

---

## 7. Shared scene versus private scene

Fabula should distinguish at least two scene scopes.

### Private scene

Participants:

- one user
- selected AI characters

Visibility:

- private to that user

Example:

```text
Eirvargr + Ragna
```

### Shared scene

Participants:

- two or more consenting users
- optionally one or more AI characters

Visibility:

- visible to the users who joined that scene

Example:

```text
Eirvargr + Derkomor + Peony + Ragna
```

Other people in the same location remain outside the scene unless they are explicitly joined.

---

## 8. AI characters in multiplayer locations

### Confirmed direction

AI characters belong to the world, not exclusively to one user.

However, one user's private generated interaction with an AI character must not automatically become visible to another user.

The runtime therefore needs to distinguish between:

```text
World character state
Private conversational state
Shared conversational state
```

A character may be physically present in a tavern for everyone while still having separate private conversations with different users.

Changes that become true world state should be committed deliberately and consistently rather than leaking from one user's private generation into everyone else's view without validation.

---

## 9. World truth versus private knowledge

### Confirmed

Fabula already requires separation between objective world truth and what individual characters know.

Multiplayer adds another knowledge boundary.

The system may need to distinguish:

```text
Canonical world truth
What AI Character A knows
What User A knows
What User B knows
What a shared scene revealed
What remains private to one session
```

A private AI conversation is not automatically public world knowledge.

Likewise, another user's presence in the same location does not magically give them information that they did not witness or receive through an explicit shared interaction.

---

## 10. Location occupancy state

### Planned runtime model

A location may expose a lightweight occupancy record.

Example:

```text
location_id: brackenjaw_tavern
present_users:
  - user_id: ...
    persona_id: ...
    presence_visibility: visible
    joined_at: ...

present_ai_characters:
  - character_id: ...
```

This occupancy state should not contain private conversation content.

Presence can therefore be synchronized cheaply without synchronizing entire RP sessions.

---

## 11. Presence lifecycle

### Planned

Presence should update when a user:

- enters a location
- moves to another location
- disconnects
- reconnects
- becomes idle for a long period
- leaves Fabula

The exact idle and disconnect rules still need tuning.

The runtime should avoid leaving ghost users permanently visible after a lost connection.

---

## 12. Reconnect and resume

### Planned

If a user loses connection, Fabula should preserve their private session and world position long enough for a normal reconnect.

Reconnecting should not require reconstructing the roleplay from another user's client.

Private session state belongs to the user's own runtime/session storage.

Shared location presence can then be restored separately.

---

## 13. Public and private worlds

### Confirmed direction

Not every Fabula world has to expose multiplayer presence in the same way.

A world may eventually be configured as:

```text
PRIVATE
Owner/invited users only.

SHARED
Multiple invited or approved users.

PUBLIC
Eligible users may enter according to the world's access rules.
```

These labels are conceptual and may change.

The important rule is that world access and scene privacy are separate concerns.

A public world does not imply public conversations.

---

## 14. Worldbuilder control

### Confirmed direction

World creators should decide who may contribute to their world and under what rules.

A creator may have their own world with their own canon, species, technology, culture and contribution rules.

Bitterroot is one authored world and does not define universal Fabula rules for every other world.

Contribution permissions may later cover:

- who can enter
- who can create characters
- who can create locations
- who can submit canon additions
- who can modify shared world state
- who can publish contributions

---

## 15. Bitterroot as the first multiplayer test world

### Confirmed direction

Bitterroot is a natural first test bed for Fabula shared presence.

Its existing authored locations make it suitable for testing:

- movement
- location occupancy
- visible nearby users
- private AI scenes
- consensual shared scenes
- persistent world state
- adult-location access boundaries
- canon contribution rules

Bitterroot's own canon restrictions still apply independently of the multiplayer system.

---

## 16. Coda / Orbis relationship

### Confirmed architecture

Coda / Orbis remains the control and management layer.

Fabula should not grow a duplicate world-management backend.

Orbis stores and manages reusable authored records such as:

- worlds
- characters
- locations
- factions
- species
- societies
- families
- memories

Fabula consumes those records to run the living shared world.

Multiplayer presence is runtime state, not a replacement for Orbis ownership and authoring data.

---

## 17. Speculus boundary

### Confirmed

Speculus is not multiplayer.

Speculus is a controlled private simulation focused on one active AI character and one user.

Shared-world presence, location occupancy and user-to-user interaction belong to Fabula.

This separation keeps Speculus useful as a predictable character-testing environment while Fabula handles the complexity of a living world.

---

## 18. Security and privacy requirements

### Required

The multiplayer implementation must enforce privacy on the server side.

The UI hiding another user's conversation is not sufficient security by itself.

A client must not receive private scene content that it is not authorized to view.

Authorization should be based on scene/session participation rather than mere location presence.

Conceptually:

```text
same location != same private session
same world != same private session
visible presence != conversation permission
shared-scene membership = shared-scene access
```

---

## 19. What is shared by default

### Confirmed direction

Safe default shared information should be small and explicit.

Potentially shared:

- display name
- chosen persona/player identity
- avatar
- current shared location
- presence status
- explicitly public profile information
- actions deliberately performed in a shared scene

Not shared by default:

- private AI messages
- private user prompts
- private memories
- private branches
- private author notes
- provider/model prompts
- hidden diagnostics
- unrelated private session history

---

## 20. Design principle

The goal is to make Fabula feel like a place where other people genuinely exist without sacrificing the intimacy of private AI roleplay.

A user should be able to walk into a tavern, notice that another player is there, continue a private conversation with an AI character, and later choose to interact with that player.

That distinction is the foundation of Fabula multiplayer:

**shared world, shared presence, private by default, shared interaction by choice.**
