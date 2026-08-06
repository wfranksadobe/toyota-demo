import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Hero block.
 *
 * Field order comes directly from blocks/hero/_hero.json (no key-value markup,
 * so each model field renders as a single row/cell, in declaration order):
 *   1. image      (reference)
 *   2. imageAlt   (text)
 *   3. text       (richtext)
 *   4. buttonText (text)
 *   5. buttonLink (text)
 *   6. buttonType (select: primary | secondary)
 *
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const [imageRow, imageAltRow, textRow, buttonTextRow, buttonLinkRow, buttonTypeRow] = [
    ...block.children,
  ];

  const picture = imageRow?.querySelector('picture');
  const imageAlt = imageAltRow?.textContent.trim() || '';
  const buttonText = buttonTextRow?.textContent.trim() || '';
  const buttonLink = buttonLinkRow?.textContent.trim() || '';
  const buttonType = buttonTypeRow?.textContent.trim() || 'primary';

  if (picture) {
    const img = picture.querySelector('img');
    if (img && imageAlt) img.alt = imageAlt;
  }

  // Move the authored rich text (heading/paragraphs) into the overlay,
  // preserving Universal Editor instrumentation so it stays editable in place.
  const content = document.createElement('div');
  content.className = 'hero-content';
  if (textRow) {
    moveInstrumentation(textRow, content);
    const textCell = textRow.firstElementChild || textRow;
    while (textCell.firstChild) content.append(textCell.firstChild);
  }

  if (buttonText && buttonLink) {
    const buttonWrapper = document.createElement('p');
    buttonWrapper.className = 'hero-button-wrapper';

    const button = document.createElement('a');
    button.className = `button ${buttonType}`;
    button.href = buttonLink;
    button.textContent = buttonText;
    if (buttonTextRow) moveInstrumentation(buttonTextRow, button);

    buttonWrapper.append(button);
    content.append(buttonWrapper);
  }

  block.textContent = '';
  if (picture) block.append(picture);
  block.append(content);
}
