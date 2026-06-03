# Assets

## Logo

The canonical TaskChain logo is `logo.svg` in this directory. Every in-app rendering goes through [`src/components/Logo.js`](../components/Logo.js), which inlines the same SVG paths so screens stay consistent and there are no PNG round-trips at runtime.

## Launcher icons

### Android — already vector

The launcher icon is wired up as a fully-vector adaptive icon (no PNG generation needed):

- `android/app/src/main/res/drawable/ic_launcher_background.xml` — gradient fill
- `android/app/src/main/res/drawable/ic_launcher_foreground.xml` — chain-check mark
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` — adaptive icon descriptor
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` — round mask variant

The bitmap fallbacks already in `mipmap-{m,h,xh,xxh,xxxh}dpi/ic_launcher.png` are only used on Android 7 and below; everything from Android 8 (API 26) onward uses the vector adaptive icon. Replace those PNGs by exporting `logo.svg` at 48 / 72 / 96 / 144 / 192 px if you need to support pre-Oreo devices.

### iOS — needs PNGs

iOS `AppIcon.appiconset` requires raster PNGs. Generate them from `logo.svg` once with any of the following tools, then drop them into `ios/TaskChain/Images.xcassets/AppIcon.appiconset/`:

| Tool | Command |
| --- | --- |
| [`appicon`](https://www.npmjs.com/package/appicon) | `npx appicon -i src/assets/logo.svg -o ios/TaskChain/Images.xcassets/AppIcon.appiconset` |
| `sharp` (script) | render the SVG at 1024×1024 then resize to required sizes |
| Figma / Sketch | export at the sizes listed in `Contents.json` |

Required sizes (all PNG, no alpha for the marketing 1024 slot): 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024. Sizes are auto-described in the existing `Contents.json` once filenames are added.
