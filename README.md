<div align="center">
  <img src="pack_icon.png" alt="AdminUtils logo" width="140" />
  <h1>AdminUtils</h1>
  <p><b>Administration, moderation and utility tools for Minecraft Bedrock</b></p>
  <p>
    <a href="https://www.curseforge.com/minecraft-bedrock/addons/admin-utils"><img src="https://img.shields.io/badge/Download-CurseForge-f16436?style=flat-square" alt="Download on CurseForge" /></a>
    <a href="https://github.com/MisledPaul58/AdminUtils-RP/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/MisledPaul58/AdminUtils-RP/ci.yml?branch=release&style=flat-square&label=CI" alt="CI" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-GPL--3.0--or--later-2f8f37?style=flat-square" alt="License: GPL-3.0-or-later" /></a>
    <img src="https://img.shields.io/badge/Minecraft-26.50-02A46F?style=flat-square" alt="Minecraft 26.50" />
  </p>
  <p><sub>A form-based in-game GUI for worlds, realms and servers &middot; powered by the Minecraft Script&nbsp;API</sub></p>
</div>

---

> [!IMPORTANT]
> **AdminUtils ships in two parts.** You need the
> **[behavior pack](https://github.com/MisledPaul58/AdminUtils-BP)** *and* this **resource pack** —
> they are one add-on split across two repositories. The GUI will not work without this pack.
> Both packs can be downloaded together from the
> **[official AdminUtils add-on page on CurseForge](https://www.curseforge.com/minecraft-bedrock/addons/admin-utils)**.

<!-- Screenshots: drop PNGs into a `docs/` folder and add them under Features, e.g.
     ![Admin menu](docs/admin-menu.png) -->

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [First steps](#first-steps)
- [Known issues](#known-issues)
- [Building from source](#building-from-source)
- [Versioning](#versioning)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

### 🛡️ Moderation

- **Ban / unban** menu
- **Jail** menu
- **Freeze** menu
- **Vanish** menu
- **Inventory inspection** — view another player's inventory
- **Kill** or **launch** a player

### 🔧 Utilities

- **Freecam** — Spectator and Experimental modes, with teleport-to-player and return-to-start
- **Projectile powers** — attach **Lightning bolt**, **Freeze** or **TNT** to snowballs, arrows and eggs
- **Admin's wand** — a single item that opens the entire GUI

### ⚙️ Administration

- **Admin & owner tag management** straight from the GUI (Settings → Admins)
- **Permissions plugin** — groups, users, wildcard nodes (`ui.settings.*`), inheritance and weight
- **Config editor** — startup message, admin/owner tags, one-click config reset
- **Reliable storage** — chunked, checksummed, auto-backed-up persistence on dynamic properties

## Requirements

- **Minecraft (Bedrock)** — target `26.50` (`min_engine_version` `[1, 26, 50]`)
- **Both packs** — the [behavior pack](https://github.com/MisledPaul58/AdminUtils-BP) and the
  [resource pack](https://github.com/MisledPaul58/AdminUtils-RP)
- **Beta APIs experiment** enabled on your world, realm or server

## Installation

1. Download the add-on from the
   **[official AdminUtils add-on page on CurseForge](https://www.curseforge.com/minecraft-bedrock/addons/admin-utils)** —
   it hosts downloads for both the behavior pack and the resource pack.
2. Import both `.mcpack` files into Minecraft (open them, or use *Settings → Behavior/Resource Packs*).
   - The resource pack comes in two variants: **Dark** (the custom dark UI) or **Light** (the
     vanilla UI) — install only the one you want.
3. Enable the **Beta APIs** experiment on the world.
4. Jump to [First steps](#first-steps).

Alternatively, build it yourself — see [Building from source](#building-from-source) — or grab the
latest `.mcpack` artifacts from the
[Actions](https://github.com/MisledPaul58/AdminUtils-RP/actions) tab of this repository.

## First steps

Once the world is loaded:

```mcfunction
/give @s au:wand
```

```mcfunction
/tag @s add -auadmin
```

- The **Admin's wand** shows up in the *sword* category of the Creative inventory (or use `/give`).
- Use it by **right-clicking** — or **holding**, on touch screens.
- The [`texts/en_US.lang`](./texts/en_US.lang) file in this repository contains every in-game
  string if you want to translate or reword the UI.

## Known issues

- The **Beta APIs experiment** is mandatory; without it the scripts never start.
- Both packs must be installed together (the behavior pack declares a dependency on this pack).

## Building from source

For contributors and anyone who wants an unreleased build.

Requirements: **Node.js 22.12+**.

```bash
git clone https://github.com/MisledPaul58/AdminUtils-RP.git
npm ci
npm run package   # produces both .mcpack files in dist/
```

> [!NOTE]
> Unlike the behavior pack there is nothing to compile — you edit the pack files directly.
> `npm run package` syncs the version into `manifest.json` and then archives the pack.

| Command | Description |
| --- | --- |
| `npm run package` | Sync the version, then produce both the **Dark** and **Light** `.mcpack` files |
| `npm run package:dark` | Produce only the Dark `.mcpack` |
| `npm run package:light` | Produce only the Light `.mcpack` |
| `npm run inject-version` | Sync `manifest.json` version with `package.json` |
| `npm run clean` | Remove the `dist/` folder |

Every push runs **install → package** in GitHub Actions
([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) and uploads both `.mcpack` files as
build artifacts.

## Versioning

The behavior pack and the resource pack are released together as a single add-on and must share
the same version. `package.json` is the source of truth — bump `version` here *and* in the
[behavior pack repository](https://github.com/MisledPaul58/AdminUtils-BP), then run
`npm run package`: `tools/inject-version.mjs` writes the version into `manifest.json` (including
the dependency on the behavior pack) automatically. The `[26.50]` in the filenames comes from
`min_engine_version`.

## Project structure

```
textures/
  items/wand.png      the Admin's wand texture
  ui/                 dark-theme UI textures (excluded from the Light build)
ui/                   form definitions + dark-theme variables (_global_variables.json
                      is excluded from the Light build)
sounds/               custom sound effects
render_controllers/   the wand render controller
texts/                localisation (en_US.lang)
tools/                version + packaging helpers (plain Node ESM)
manifest.json         pack manifest (version is injected at package time)
```

## Contributing

Bug reports and pull requests are welcome on the [issue tracker](https://github.com/MisledPaul58/AdminUtils-RP/issues).

- Fork and branch off `dev`, then open a PR against `dev`.
- CI must pass (packaging) before a PR is merged.
- The archives contain only the shipped pack contents — developer files (`.github/`, `tools/`,
  npm) are excluded by `tools/pack.mjs` and must stay out of the pack.

## License

[GPL-3.0-or-later](./LICENSE) © MisledPaul58.
