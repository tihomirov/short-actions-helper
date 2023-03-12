export function createBackgroundElement(): HTMLDivElement {
  const element = document.createElement('div');
  const spanElementsCount = 4;
  const spanElementsColors = ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF'];
  const cssProps: Partial<CSSStyleDeclaration> = {
    position: 'fixed',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgba(102, 102, 153, 0.3)',
    zIndex: '999999999',
    pointerEvents: 'none',
    fontSize: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20%',
  };

  for (const property in cssProps) {
    const propertyValue = cssProps[property];
    if (property && propertyValue) {
      element.style[property] = propertyValue;
    }
  }

  for (let i = 0; i < spanElementsCount; i++) {
    const spanElement = document.createElement('span');
    spanElement.innerText = 'Click on Element and open Extention again please';
    spanElement.style.color = spanElementsColors[i];
    element.appendChild(spanElement);
  }

  return element;
}
