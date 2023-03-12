import { ElementData } from '../../../common';

const MAX_SAVED_INNER_HTML_LENGTH = 2000;

export function getElementData(target: EventTarget): ElementData {
  if (!(target instanceof HTMLElement)) {
    throw new Error('Target can not be parsed. target should be target');
  }

  const tagName = target.tagName;
  const innerText = target.innerText?.trim();
  const title = target.title?.trim();
  const innerHTML = !innerText && target.innerHTML.length < MAX_SAVED_INNER_HTML_LENGTH ? target.innerHTML.trim() : '';

  let href: string | undefined;
  let src: string | undefined;

  if (!innerText && target instanceof HTMLAnchorElement) {
    href = target.href;
  }

  if (!innerText && target instanceof HTMLImageElement) {
    src = target.src;
  }

  return {
    tagName,
    innerHTML,
    innerText,
    href,
    title,
    src,
  };
}
