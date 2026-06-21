# AGENTS.md: working on Kronuz-Theme (Sublime Text)

This repo is the **Sublime Text** edition of the Kronuz theme. It is part of a
three-repo set that shares **one** source of truth, so read this before editing colors.

## The two color schemes are GENERATED — do not hand-edit

`Kronuz.sublime-color-scheme` and `Kronuz-Light.sublime-color-scheme` are **output**.
They are emitted, identically to the VS Code, TextMate, and Zed editions, from the
single source of truth:

```
github.com/Kronuz/kronuz-theme-vscode  →  build.mjs   (canonical: src/base-dark.json + palette)
```

To change a color, edit it **there** and re-run the generator — never patch the
`.sublime-color-scheme` files here (a hand-edit is silently overwritten on the next
build and drifts this repo from the others):

```sh
# check both repos out side by side under ~/Development/, then:
cd ../kronuz-theme-vscode && npm run build   # writes the two .sublime-color-scheme files here
```

`build-color-scheme.mjs` in this repo is a **dead stub** (it prints a notice and exits
1). It stays only to stop the old, now-divergent generator from being run. Don't run it,
don't revive it.

## What IS maintained here (Sublime-native, by hand)

Everything else is genuine Sublime-only material with no upstream equivalent, edited
directly in this repo:

- `Theme - Kronuz.sublime-theme` (the UI theme), `Widget.sublime-settings`
- `Console.sublime-syntax`
- `prefs/Ext/*.sublime-settings` (per-language tweaks)

## Git identity (public Kronuz repo)

Commit as **Germán Méndez Bravo \<german.mb@gmail.com\>** (already the local config). No
`Co-authored-by: Copilot` trailer; if signing prompts, `git -c commit.gpgsign=false
commit`. Push with the Kronuz account over HTTPS:

```sh
git -c credential.helper='!gh auth git-credential' push https://github.com/Kronuz/Kronuz-Theme.git
```
