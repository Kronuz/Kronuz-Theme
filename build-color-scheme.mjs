/**
 * Build the Kronuz Sublime Text color schemes (dark + light).
 *
 *   node build-color-scheme.mjs
 *
 * The DARK palette is the classic Kronuz palette (the exact 0.0.6 colors, same
 * as the VS Code theme github.com/Kronuz/kronuz-theme-vscode). The LIGHT scheme
 * is derived from it with the same mathematical transform the editor uses:
 * invert lightness (hue kept), brighten neutral surfaces toward white, and keep
 * chromatic colors deep + saturated so they don't wash out on the light page.
 *
 * Writes Kronuz.sublime-color-scheme and Kronuz-Light.sublime-color-scheme.
 */
import { writeFileSync } from "node:fs";

const parseHex = (hex) => {
  let m = hex.slice(1), a = "";
  if (m.length === 8) { a = m.slice(6); m = m.slice(0, 6); }
  else if (m.length === 4) { a = m[3] + m[3]; m = m.slice(0, 3); }
  if (m.length === 3) m = [...m].map((c) => c + c).join("");
  return [parseInt(m.slice(0, 2), 16) / 255, parseInt(m.slice(2, 4), 16) / 255, parseInt(m.slice(4, 6), 16) / 255, a];
};
const rgb2hsl = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, l = (mx + mn) / 2;
  let s = 0, h = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (mx) { case r: h = ((g - b) / d) % 6; break; case g: h = (b - r) / d + 2; break; default: h = (r - g) / d + 4; }
    h = (h * 60 + 360) % 360;
  }
  return [h, s * 100, l * 100];
};
const hsl = (h, s, l) => {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const to = (x) => Math.round(255 * x).toString(16).padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
};
const toLight = (hex) => {
  if (typeof hex !== "string" || hex[0] !== "#") return hex;
  const [r, g, b, a] = parseHex(hex);
  const [h, s, l] = rgb2hsl(r, g, b);
  if (s < 12) return hsl(h, s, l < 28 ? 92 + l * 0.28 : Math.max(16, 100 - l)) + a;
  const luminous = h >= 55 && h <= 175;
  const L = Math.max(28, Math.min(100 - l, luminous ? 32 : 40));
  const S = Math.min(92, s * 1.2 + 12);
  return hsl(h, S, L) + a;
};

// The classic Kronuz dark palette (exact 0.0.6 colors).
const DARK = {
  background: "#383838", foreground: "#c8c6c5", dim: "#7a7775", soft: "#9a9794", caret: "#d08040",
  comment: "#95815e", string: "#a5c261", number: "#a5c260", regexp: "#c7d87b", escape: "#d08442",
  keyword: "#cc7833", func: "#e8bf6a", type: "#da4939", cls: "#ffd68d", tag: "#caa473",
  vari: "#e8e6e5", param: "#fde9bbdd", lang: "#d0d0ff", constLang: "#6e9cbe", raw: "#d687bf", link: "#6089b4",
  heading: "#fd971f", mdBold: "#437cb9", mdItalic: "#7ea4cc", list: "#9aa83a",
  ins: "#219186", del: "#dc322f", chg: "#cb4b16", invalid: "#ff0b00",
};

function scheme(variant) {
  const dark = variant === "dark";
  const vars = dark ? DARK : Object.fromEntries(Object.entries(DARK).map(([k, v]) => [k, toLight(v)]));

  const globals = {
    background: "var(background)",
    foreground: "var(foreground)",
    caret: "var(caret)",
    block_caret: "var(caret)",
    line_highlight: dark ? "hsla(0, 0%, 100%, 0.04)" : "hsla(0, 0%, 0%, 0.04)",
    selection: dark ? "hsla(222, 100%, 60%, 0.30)" : "hsla(222, 100%, 50%, 0.16)",
    selection_border: "var(background)",
    inactive_selection: dark ? "hsla(0, 0%, 100%, 0.07)" : "hsla(0, 0%, 0%, 0.06)",
    highlight: "var(link)",
    find_highlight: "var(keyword)",
    find_highlight_foreground: "var(background)",
    gutter: "var(background)",
    gutter_foreground: "var(dim)",
    guide: dark ? "hsla(0, 0%, 100%, 0.08)" : "hsla(0, 0%, 0%, 0.08)",
    active_guide: "var(caret)",
    stack_guide: dark ? "hsla(28, 70%, 55%, 0.4)" : "hsla(28, 70%, 45%, 0.4)",
    brackets_foreground: "var(keyword)",
    brackets_options: "underline",
    bracket_contents_foreground: "var(keyword)",
    bracket_contents_options: "underline",
    tags_foreground: "var(tag)",
    tags_options: "stippled_underline",
    invisibles: dark ? "hsla(0, 0%, 100%, 0.12)" : "hsla(0, 0%, 0%, 0.12)",
    shadow: dark ? "hsla(0, 0%, 0%, 0.25)" : "hsla(0, 0%, 0%, 0.12)",
  };

  const rule = (scope, fg, font_style) => ({
    scope,
    ...(fg ? { foreground: fg } : {}),
    ...(font_style ? { font_style } : {}),
  });
  const rules = [
    rule("comment, punctuation.definition.comment", "var(comment)", "italic"),
    rule("string, string.quoted, string.template, meta.string", "var(string)"),
    rule("constant.character.escape, constant.other.placeholder", "var(escape)"),
    rule("string.regexp, keyword.operator.regexp", "var(regexp)"),
    rule("constant.numeric, constant.numeric.integer, constant.numeric.float, keyword.other.unit", "var(number)"),
    rule("constant.language, constant.language.boolean, constant.language.null", "var(constLang)"),
    rule("constant.other, support.constant", "var(keyword)"),
    rule("keyword, keyword.control, keyword.other, keyword.declaration", "var(keyword)"),
    rule("keyword.operator, keyword.operator.new, punctuation.accessor", "var(keyword)"),
    rule("storage, storage.type, storage.modifier", "var(keyword)"),
    rule("entity.name.function, support.function, variable.function", "var(func)"),
    rule("entity.name.type, entity.name.namespace, support.type", "var(type)"),
    rule("entity.name.class", "var(cls)"),
    rule("support.class", "var(func)"),
    rule("entity.other.inherited-class", "var(tag)"),
    rule("entity.name.tag, punctuation.definition.tag", "var(tag)"),
    rule("entity.other.attribute-name", "var(vari)"),
    rule("support.type.property-name, meta.object-literal.key, entity.name.tag.yaml", "var(vari)"),
    rule("variable, variable.other, meta.definition.variable", "var(vari)"),
    rule("variable.other.constant, variable.other.enummember", "var(keyword)"),
    rule("variable.parameter", "var(param)", "italic"),
    rule("variable.language, variable.language.this, variable.language.self", "var(lang)", "italic"),
    rule("entity.name.function.decorator, meta.decorator, punctuation.decorator, storage.type.annotation", "var(func)"),
    rule("punctuation, meta.brace, punctuation.separator, punctuation.terminator", "var(foreground)"),
    rule("entity.name.label", "var(func)"),
    rule("markup.heading, entity.name.section", "var(heading)", "bold"),
    rule("markup.bold", "var(mdBold)", "bold"),
    rule("markup.italic", "var(mdItalic)", "italic"),
    rule("markup.underline.link, markup.link, string.other.link", "var(link)", "underline"),
    rule("markup.raw.inline, markup.raw, markup.fenced_code", "var(raw)"),
    rule("markup.quote", "var(tag)", "italic"),
    rule("markup.list", "var(list)"),
    rule("markup.inserted, markup.inserted.diff", "var(ins)"),
    rule("markup.deleted, markup.deleted.diff", "var(del)"),
    rule("markup.changed, markup.changed.diff", "var(chg)"),
    rule("meta.diff.range", "var(lang)"),
    rule("invalid, invalid.illegal", "var(invalid)"),
    rule("invalid.deprecated", "var(keyword)"),
  ];

  return {
    name: dark ? "Kronuz" : "Kronuz Light",
    author: "Germán Méndez Bravo (Kronuz)",
    variables: vars,
    globals,
    rules,
  };
}

for (const v of ["dark", "light"]) {
  const file = v === "dark" ? "Kronuz.sublime-color-scheme" : "Kronuz-Light.sublime-color-scheme";
  writeFileSync(new URL(`./${file}`, import.meta.url), JSON.stringify(scheme(v), null, "\t") + "\n");
  console.log(`wrote ${file}`);
}
