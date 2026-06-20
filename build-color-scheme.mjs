/**
 * SUPERSEDED — do not run.
 *
 * The Kronuz color schemes (Kronuz.sublime-color-scheme + Kronuz-Light.sublime-color-scheme)
 * are no longer generated here. They are emitted, identically to the VS Code and TextMate
 * editions, from the single source of truth:
 *
 *   github.com/Kronuz/kronuz-theme-vscode  ->  build.mjs
 *
 * Check that repo out next to this one and run `node build.mjs` there; it writes the two
 * .sublime-color-scheme files in this repo. This stub stays only to prevent the old,
 * now-divergent generator from being run and silently re-introducing drift.
 */
console.error("build-color-scheme.mjs is superseded — regenerate from kronuz-theme-vscode/build.mjs");
process.exit(1);
