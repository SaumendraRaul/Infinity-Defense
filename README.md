# Infinity Defense

A playable, unofficial Marvel tower-defense fan game with a bright violet command panel, large illustrated maps, branching hero upgrades, boss encounters, and custom animated combat.

## Play

Run `npm start` and open `http://127.0.0.1:4173`. The start command now rebuilds the browser bundle first, so source changes are picked up automatically. If a built `dist/` folder is present, **Play.html** opens that static build directly.

Drag a hero from the shop onto open ground beside a road, then press **Play round**. Click a deployed hero to buy upgrades, change its target priority, or sell it. One upgrade branch can reach tier 4 and the other tier 2. Tier 3 unlocks an active ability at the bottom of the battlefield.

Scroll or pinch to zoom, drag empty ground to pan, and use the minimap to navigate. Keyboard: 1–8 select heroes; arrows position a selected hero; Enter deploys; Space pauses; N starts a round; F changes speed; Escape cancels placement or closes a dialog.

## V3.1 presentation pass

V3.1 focuses on presentation instead of piling on another stack of mechanics. It adds a comic-book visual layer with inked/halftone hero portraits, stronger action-figure plinths for deployed heroes, tier-based comic burst accents, chunkier hero-card framing, deeper battlefield contrast, and more dramatic HUD/button treatment. Gameplay balance and rules remain unchanged.

The presentation layer lives in `src/presentation.mjs`, so the art-direction pass stays separate from the deterministic combat engine and can evolve without turning `render.mjs` into an archaeological site.

## Included

- Eight heroes: Iron Man, Captain America, Thor, Spider-Man, Doctor Strange, Scarlet Witch, Black Panther, and Hulk. Each has eight upgrades across two specialization paths and a signature ability.
- Six 2200 × 1380 maps: New York, Wakanda, Asgard, Titan, Dark Dimension, and Avengers Compound. The later maps have split routes. Campaigns last 30 rounds, with 40 at the Compound.
- Ten enemy types with armor, camouflage, regeneration, flying swarms, fast runners, and three bosses. Loki and Ultron summon escorts; Thanos temporarily disables nearby heroes.
- Story, Heroic, and Legendary difficulties; campaign, endless, and sandbox modes. Sandbox offers generous credits, prevents defeat, and supports wave selection in Settings.
- Three-star mission medals, eight achievements, wave forecasts, a field guide, synthetic audio, pause, automatic rounds, and 1×/2×/3× speed.
- Distinct repulsor beams, returning shields, hammer lightning, webs, rotating spell circles, chaos ribbons, claw slashes, and ground-slam debris. Heroes recoil, lunge, leap, and cast; enemies walk, scuttle, or flap. Animation respects pause, game speed, and reduced-motion settings.
- Automatic device-local saves, validated import, downloadable export, and a copyable backup-text fallback. No account or cloud save is required.

## Source and development

`src/data.mjs` contains heroes, upgrades, maps, enemies, and waves. `src/engine.mjs` contains deterministic gameplay. `src/animations.mjs` contains attack poses and effect timelines. `src/render.mjs` draws the world and characters. `src/presentation.mjs` applies the comic presentation layer. `src/app.mjs` handles the interface and persistence. `dist/game-ui.css` styles the base interface when the distribution has been built.

Use a current Node.js installation. There are no application dependencies to install.

```text
npm run build
npm test
npm start
node tests/balance.mjs --all --report
```

On Windows, if the npm shim fails, use `C:\Program Files\nodejs\npm.cmd`.

The build produces a classic JavaScript bundle. Edit source modules, then rebuild. The static distribution is `dist/`.

## Verification and limits

The engine suite covers placement, all legal 4–2 and 2–4 specializations, damage, camouflage, armor, abilities, bosses, saving, and complete campaign simulations. Animation tests exercise all eight timelines, reduced-motion poses, and finite drawing geometry.

The V3.1 presentation build was rebuilt successfully and the full automated suite passed: 29 tests, 29 passing.

The latest automated balance report uses actual starting credits, earned rewards, legal upgrades, and a fixed strategy. It clears all six Story campaigns, three Heroic campaigns, and Titan on Legendary. Failures on other harder campaigns are recorded rather than hidden. This is a repeatable balance baseline, not a substitute for broad human playtesting.

Browser checks covered deployment, upgrades to 4–2, an active ability and cooldown, combat rendering, pause, reload recovery, and desktop/phone layouts. Automated browser file downloads were canceled by the browser environment, so export includes visible copyable save text as a fallback. Save files are validated before import.

This is a substantial playable local game, not a commercially certified release. There is no multiplayer, account synchronization, or paid content. Characters belong to Marvel; this project is not affiliated with or endorsed by Marvel or Ninja Kiwi. All included game drawings and interface code were created for this project.
