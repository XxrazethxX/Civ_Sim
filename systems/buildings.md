# Buildings System

Owns building definitions, prerequisites, land use, obsolete-building conversion, construction queue, demolition queue, and building effects.

Current conversion flow:
- `Hut -> House`
- `Footpath -> Roads`
- `Watch Post -> Watchtower`

Conversions are queued projects and use builders over time, like normal construction.
