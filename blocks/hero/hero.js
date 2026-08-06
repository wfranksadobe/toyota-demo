export default function decorate(block) {
  const col = block.firstElementChild;
  const pic = col.querySelector('picture');

  // Ensure the picture element is properly positioned for background display
  if (pic) {
    const picWrapper = pic.closest('div');
    if (picWrapper && picWrapper !== col) {
      // Move the picture to the main hero container for proper background positioning
      block.appendChild(pic);
      // Remove the now-empty wrapper if it exists
      if (picWrapper.children.length === 0) {
        picWrapper.remove();
      }
    }
  }

  createHeroButton(block);
}

/**
 * Find the buttonText/buttonLink/buttonType fields and turn them into a real
 * button, then remove the source paragraphs so nothing is left behind to
 * overlap the title/text overlay.
 *
 * These three fields are declared consecutively in blocks/hero/_hero.json, in
 * this order: buttonText, buttonLink, buttonType. Each is a plain text/select
 * field (never richtext), so each renders as exactly one paragraph. buttonType
 * is a two-option enum ("primary" | "secondary"), so it can be located
 * reliably by its value - buttonLink and buttonText are then simply the two
 * paragraphs immediately before it, in that order. This holds regardless of
 * exactly how the fields are nested in the authored markup, and regardless of
 * how many paragraphs the richtext "text" field itself contains.
 *
 * @param {Element} block The hero block element
 */
function createHeroButton(block) {
  const paragraphs = [...block.querySelectorAll('p')];
  const buttonTypeIndex = paragraphs.findIndex((p) => {
    const value = p.textContent.trim().toLowerCase();
    return value === 'primary' || value === 'secondary';
  });

  // Need at least two paragraphs before the buttonType field (buttonText, buttonLink).
  if (buttonTypeIndex < 2) return;

  const buttonTypeEl = paragraphs[buttonTypeIndex];
  const buttonLinkEl = paragraphs[buttonTypeIndex - 1];
  const buttonTextEl = paragraphs[buttonTypeIndex - 2];

  const buttonType = buttonTypeEl.textContent.trim().toLowerCase();
  const buttonLink = buttonLinkEl.textContent.trim();
  const buttonText = buttonTextEl.textContent.trim();

  if (!buttonText || !buttonLink) return;

  const buttonWrapper = document.createElement('div');
  buttonWrapper.className = 'hero-button-wrapper';

  const button = document.createElement('a');
  button.className = `button ${buttonType}`;
  button.href = buttonLink;
  button.textContent = buttonText;

  buttonWrapper.appendChild(button);
  block.appendChild(buttonWrapper);

  // Remove the source field cells entirely (not just hide them) so they can't
  // be counted or positioned by the .hero p / nth-of-type overlay rules.
  [buttonTextEl, buttonLinkEl, buttonTypeEl].forEach((el) => {
    const cell = el.parentElement;
    el.remove();
    if (cell && cell.children.length === 0 && cell.textContent.trim() === '') {
      cell.remove();
    }
  });
}
