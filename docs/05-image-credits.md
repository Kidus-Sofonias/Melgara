# MELGARA — Ore Specimen Image Credits

The photoreal "replica" textures used by the 3D ore renderer are photographs of
real mineral specimens, sourced from **Wikimedia Commons** (freely licensed,
CC / public domain). They are bundled locally at `public/ores/*.jpg`.

| File | Mineral | Source file on Commons |
|---|---|---|
| `copper.jpg` | Chalcopyrite (copper ore) | `File:Chalcopyrite botroïdale.jpg` |
| `manganese.jpg` | Pyrolusite (manganese ore) | `File:Pyrolusite Mineral with Dendrite Macro Digon3.jpg` |
| `chrome.jpg` | Chromite (chrome ore) | `File:Yukon chromite prospect.jpg` |
| `iron.jpg` | Hematite (iron ore) | `File:Hematite (Cavradi Gorge, Switzerland) 4.jpg` |
| `nonmetallic.jpg` | Quartz (non-metallic) | `File:Quartz, Tibet.jpg` |

License: CC BY-SA / CC BY / Public Domain per each individual file page on
Wikimedia Commons. Attribution per CC terms is recommended on any printed
materials; the per-ore `photoCredit` field in `src/data/ores.js` records each
source line.

**Note:** these are stand-ins for Melgara's own product photography. If the
client can supply photos of their actual ore shipments, drop them into
`public/ores/` with the same filenames and they will be used automatically.
