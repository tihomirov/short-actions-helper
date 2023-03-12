import { ElementData } from '../../common';

export function queryElement(elementData: ElementData): HTMLElement | undefined {
  const { tagName, innerText, innerHTML, href, title, src } = elementData;

  const elementsByTagName = document.getElementsByTagName(tagName as keyof HTMLElementTagNameMap);
  let elementsArray = Array.from(elementsByTagName);

  if (innerText) {
    elementsArray = elementsArray.filter((e) => e.innerText.toLowerCase() === innerText.toLowerCase());
  }

  if (innerHTML) {
    elementsArray = elementsArray.filter((e) => e.innerHTML === innerHTML);
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
