export function isElementHidden(element: HTMLElement) {
  return element.offsetParent === null;
}
