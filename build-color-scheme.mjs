/**
 * Build the Kronuz Sublime Text color schemes (dark + light) from one palette
 * and one scope -> color map (the same design as the VS Code theme).
 *
 *   node build-color-scheme.mjs
 *
 * The original scheme mixed the clean Kronuz palette with leftover ad-hoc hex
 * from an older base and was dark-only. This rebuilds the rules coherently from
 * the palette and adds a light variant in the same spirit.
 *
 * Writes Kronuz.sublime-color-scheme and Kronuz-Light.sublime-color-scheme.
 */
import { writeFileSync } from "node:fs";

// Palette as HSL strings (Sublime resolves hsl() natively), so the scheme reads
// like the hand-written original. Hue is fixed per color; dark vs light only
// changes the lightness/saturation of the ramp and the neutral bg/fg.
const HUE = { red: 0, orange: 24, yellow: 40, green: 154, blue: 210, purple: 267, pink: 330 };

function scheme(variant) {
  const dark = variant === "dark";
  const S = dark ? 58 : 62;
  const L = dark ? 64 : 42;
  const vars = {
    background: dark ? "hsl(0, 0%, 22%)" : "hsl(36, 30%, 97%)",
    foreground: dark ? "hsl(20, 3%, 80%)" : "hsl(20, 12%, 24%)",
    dim: dark ? "hsl(20, 4%, 52%)" : "hsl(20, 8%, 52%)",
    soft: dark ? "hsl(20, 4%, 62%)" : "hsl(22, 8%, 42%)",
    caret: dark ? "hsl(28, 70%, 55%)" : "hsl(28, 75%, 42%)",
  };
  for (const [name, h] of Object.entries(HUE)) vars[name] = `hsl(${h}, ${S}%, ${L}%)`;

  const globals = {
    background: "var(background)",
    foreground: "var(foreground)",
    caret: "var(caret)",
    block_caret: "var(caret)",
    line_highlight: dark ? "hsla(0, 0%, 100%, 0.04)" : "hsla(0, 0%, 0%, 0.04)",
    selection: dark ? "hsla(222, 100%, 60%, 0.30)" : "hsla(222, 100%, 50%, 0.16)",
    selection_border: "var(background)",
    inactive_selection: dark ? "hsla(0, 0%, 100%, 0.07)" : "hsla(0, 0%, 0%, 0.06)",
    highlight: "var(blue)",
    find_highlight: "var(orange)",
    find_highlight_foreground: "var(background)",
    gutter: "var(background)",
    gutter_foreground: "var(dim)",
    guide: dark ? "hsla(0, 0%, 100%, 0.08)" : "hsla(0, 0%, 0%, 0.08)",
    active_guide: "var(caret)",
    stack_guide: dark ? "hsla(28, 70%, 55%, 0.4)" : "hsla(28, 70%, 45%, 0.4)",
    brackets_foreground: "var(orange)",
    brackets_options: "underline",
    bracket_contents_foreground: "var(orange)",
    bracket_contents_options: "underline",
    tags_foreground: "var(pink)",
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
    rule("comment, punctuation.definition.comment", "var(dim)", "italic"),
    rule("string, string.quoted, string.template, meta.string", "var(green)"),
    rule("constant.character.escape, constant.other.placeholder", "var(purple)"),
    rule("string.regexp, keyword.operator.regexp", "var(orange)"),
    rule("constant.numeric, constant.numeric.integer, constant.numeric.float, keyword.other.unit", "var(purple)"),
    rule("constant.language, constant.language.boolean, constant.language.null", "var(orange)"),
    rule("constant.other, support.constant", "var(orange)"),
    rule("keyword, keyword.control, keyword.other, keyword.declaration", "var(pink)"),
    rule("keyword.operator, keyword.operator.new, punctuation.accessor", "var(pink)"),
    rule("storage, storage.type, storage.modifier", "var(pink)"),
    rule("entity.name.function, support.function, variable.function", "var(blue)"),
    rule("entity.name.class, entity.name.type, entity.name.namespace, support.type, support.class, entity.other.inherited-class", "var(yellow)"),
    rule("entity.name.tag, punctuation.definition.tag", "var(pink)"),
    rule("entity.other.attribute-name", "var(green)"),
    rule("support.type.property-name, meta.object-literal.key, entity.name.tag.yaml", "var(blue)"),
    rule("variable, variable.other, meta.definition.variable", "var(foreground)"),
    rule("variable.other.constant, variable.other.enummember", "var(orange)"),
    rule("variable.parameter", "var(orange)", "italic"),
    rule("variable.language, variable.language.this, variable.language.self", "var(orange)", "italic"),
    rule("entity.name.function.decorator, meta.decorator, punctuation.decorator, storage.type.annotation", "var(yellow)"),
    rule("punctuation, meta.brace, punctuation.separator, punctuation.terminator", "var(soft)"),
    rule("entity.name.label", "var(yellow)"),
    rule("markup.heading, entity.name.section", "var(blue)", "bold"),
    rule("markup.bold", "var(orange)", "bold"),
    rule("markup.italic", "var(foreground)", "italic"),
    rule("markup.underline.link, markup.link, string.other.link", "var(blue)", "underline"),
    rule("markup.raw.inline, markup.raw, markup.fenced_code", "var(green)"),
    rule("markup.quote", "var(soft)", "italic"),
    rule("markup.inserted, markup.inserted.diff", "var(green)"),
    rule("markup.deleted, markup.deleted.diff", "var(red)"),
    rule("markup.changed, markup.changed.diff", "var(yellow)"),
    rule("meta.diff.range", "var(purple)"),
    rule("invalid, invalid.illegal", "var(red)"),
    rule("invalid.deprecated", "var(orange)"),
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
