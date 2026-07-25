# AGENTS.md: working on kronuz-theme-sublime

This repository is only the Sublime Text edition of the Kronuz theme.

## Generated color schemes

`Kronuz.sublime-color-scheme` and `Kronuz-Light.sublime-color-scheme` are generated
by the sibling `KronuzTheme` repository. Never hand-edit them.

To change shared colors or scopes:

```sh
cd ../KronuzTheme
npm run build
```

Sublime-specific UI files belong here: `Theme - Kronuz.sublime-theme`,
`Widget.sublime-settings`, `Console.sublime-syntax`, assets, and preferences.

## Validation

Run the canonical generator twice; the second build must leave this repository clean.
Install this directory as `Theme - Kronuz` in Sublime's Packages directory for visual
testing.
