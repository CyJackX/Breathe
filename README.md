# BreatheWidget

A lightweight, always-on-top breathing reminder widget for Windows.

It shows a breathing object that expands/contracts. Settings live in a separate window and apply instantly.

![BreatheWidget Example](src/assets/example.jpg)

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

### GitHub Releases

Download the latest release from [GitHub Releases](https://github.com/CyJackX/Breathe/releases).

**Available installers:**

| Installer | SHA256 Checksum |
|-----------|-----------------|
| `BreatheWidget_0.1.0_x64-setup.exe` | `19ea737ed30714fa3f216501af74fb0d8f67659c402303834d0f7b5436eb66c9` |
| `BreatheWidget_0.1.0_x64_en-US.msi` | `7481f2f1aa427f438697b7c1ccabe80d468f3f5fd8b5c274047ffd9af28e8e6f` |

**To verify checksums:**

Windows PowerShell:
```powershell
Get-FileHash .\BreatheWidget_0.1.0_x64-setup.exe -Algorithm SHA256
```

Windows Command Prompt:
```cmd
certutil -hashfile BreatheWidget_0.1.0_x64-setup.exe SHA256
```

### Build locally

If you built locally, the Windows installer is produced at:

- `src-tauri/target/release/bundle/nsis/BreatheWidget_0.1.0_x64-setup.exe`

There is also an MSI at:

- `src-tauri/target/release/bundle/msi/BreatheWidget_0.1.0_x64_en-US.msi`

**Note:** If the app is not code-signed, Windows may show a SmartScreen warning (common for freeware).

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
