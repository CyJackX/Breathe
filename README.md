# BreatheWidget

A lightweight, always-on-top breathing reminder widget for Windows.

It shows a breathing object that expands/contracts. Settings live in a separate window and apply instantly.

## How to use

- **Move the widget**: click and drag the breathing object.
- **Resize**: hover the widget edges/corners and drag (custom resize handles).
- **Open settings**: hover the widget and click the **gear** button.
- **Exit**: hover the widget and click the **X** button.

## Settings

The settings window lets you change:
- **Seconds per phase** (inhale/exhale timing)
- **Min size** (how small the object gets)
- **Opacity** (how transparent the object is)
- **Accent color** (only used when no image is set)
- **Custom image/SVG** for the breathing object

Settings are saved automatically and persist across restarts.

## Download / install

If you built locally, the Windows installer is produced at:

- `src-tauri/target/release/bundle/nsis/BreatheWidget_0.1.0_x64-setup.exe`

There is also an MSI at:

- `src-tauri/target/release/bundle/msi/BreatheWidget_0.1.0_x64_en-US.msi`

Note: if the app is not code-signed, Windows may show a SmartScreen warning (common for freeware).

## Development

Install dependencies:

```bash
npm install
```

Run dev build:

```bash
npm run dev
```

Build release installers:

```bash
npm run build
```

## Architecture notes

See `ARCHITECTURE.md` for how the two-window widget/settings architecture, settings model, and persistence work.
