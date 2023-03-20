import { ElementData } from '../../../common';

export function getElementData(target: EventTarget): ElementData {
  if (!(target instanceof HTMLElement)) {
    throw new Error('Target can not be parsed. target should be target');
  }

  const tagName = target.tagName;
  const id = target.id;
  const innerText = target.innerText?.trim();
  const title = target.title?.trim();

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
    id,
    innerText,
    href,
    title,
    src,
  };
}
