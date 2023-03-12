export function markIframeAsNotSupported(iframe: HTMLIFrameElement): HTMLDivElement {
  const divElement = document.createElement('div');
  const { left, top, height, width } = iframe.getBoundingClientRect();
  const topPosition = top + document.documentElement.scrollTop;
  const leftPosition = left + document.documentElement.scrollLeft;
  const cssProps: Partial<CSSStyleDeclaration> = {
    position: 'absolute',
    top: `${topPosition}px`,
    left: `${leftPosition}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: 'rgba(241, 42, 42, 0.7)',
    zIndex: '999999999',
    cursor: 'not-allowed',
  };

  for (const property in cssProps) {
    const propertyValue = cssProps[property];
    if (property && propertyValue) {
      divElement.style[property] = propertyValue;
    }
  }

  document.body.appendChild(divElement);

  return divElement;
}
