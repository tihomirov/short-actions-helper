import { ElementData } from '../../common';

export function queryElement(elementData: ElementData): HTMLElement | undefined {
  const { tagName, id, innerText, href, title, src } = elementData;

  const elementsByTagName = document.getElementsByTagName(tagName as keyof HTMLElementTagNameMap);
  let elementsArray = Array.from(elementsByTagName);

  if (innerText) {
    elementsArray = elementsArray.filter((e) => e.innerText.toLowerCase() === innerText.toLowerCase());
  }

  if (id) {
    elementsArray = elementsArray.filter((e) => e.id.toLowerCase() === id.toLowerCase());
  }

  if (title) {
    elementsArray = elementsArray.filter((e) => e.title === title);
  }

  if (href) {
    elementsArray = elementsArray.filter((e) => e instanceof HTMLAnchorElement && e.href === href);
  }

  if (src) {
    elementsArray = elementsArray.filter((e) => e instanceof HTMLImageElement && e.src === src);
  }

  // just get first element for now
  return elementsArray[0];
}
