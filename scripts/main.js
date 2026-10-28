/**
 * Invisible Notes
 * A map note whose icon file name contains "invisible" (or that has the flag
 * flags.invisible-notes.hidden = true) is drawn without the dark frame/background.
 * Players see nothing but can still click it. The GM sees the frame on hover,
 * when the note is selected, or while the Notes layer is active.
 */
const MOD = "invisible-notes";

function isHidden(note) {
  const doc = note.document;
  if (foundry.utils.getProperty(doc, `flags.${MOD}.hidden`)) return true;
  return /invisible/i.test(doc.texture?.src ?? "");
}

function apply(note) {
  const ci = note?.controlIcon;
  if (!ci || !isHidden(note)) return;
  const show = game.user.isGM && (note.hover || note.controlled || note.layer?.active);
  ci.bg.visible = show;
  ci.border.visible = show;
}

Hooks.on("drawNote", apply);
Hooks.on("refreshNote", apply);
Hooks.on("hoverNote", apply);
Hooks.on("controlNote", apply);

// Re-evaluate all notes when the GM switches layers.
Hooks.on("activateCanvasLayer", () => canvas.notes?.placeables.forEach(apply));
Hooks.on("deactivateCanvasLayer", () => canvas.notes?.placeables.forEach(apply));
