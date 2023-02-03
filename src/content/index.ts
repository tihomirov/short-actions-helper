import { TabEvent, ElementEvent } from '../common'

console.log('content script')

const elementActionsMethods: Record<ElementEvent, (element: HTMLElement) => void> = {
  [ElementEvent.Click]: (element) => element.click(),
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.event) {
    case TabEvent.Debbug:
      sendResponse('Hello WWWWW')
      return
    case TabEvent.ElementAction:
      const { element: { tagName, innerText }, event } = message.action;
      const allElementsByTag = document.getElementsByTagName(tagName)
      const elementToClick = Array.from(allElementsByTag).filter(
        (el) => el.innerText.toLowerCase() === innerText.toLowerCase(),
      )?.[0]
      
      if(elementToClick) {
        elementActionsMethods[event as ElementEvent]?.(elementToClick)
      }

      sendResponse('elementToClick Clicked');
      return;
    case TabEvent.InterceptElement:
      runInterceptMode();
      sendResponse('ok');
      return;
    default:
      return;
  }
})

function runInterceptMode() {
  const dimmElement = document.createElement('div');
  dimmElement.style.position = 'fixed';
  dimmElement.style.top = '0';
  dimmElement.style.bottom = '0';
  dimmElement.style.left = '0';
  dimmElement.style.right = '0';
  dimmElement.style.backgroundColor = 'gray';
  dimmElement.style.opacity = '0.3';
  dimmElement.style.zIndex = '999999999';
  dimmElement.style.pointerEvents = 'none';
  dimmElement.style.fontSize = '24px';
  dimmElement.style.display = 'flex';
  dimmElement.style.justifyContent = 'center';
  dimmElement.style.alignItems = 'center';
  dimmElement.style.gap = '20%';
  dimmElement.innerHTML = `
  <span>Select element and open Extention again please</span>
  <span>Select element and open Extention again please</span>
  <span>Select element and open Extention again please</span>
  `;

  dimmElement.blur()

  document.body.appendChild(dimmElement);

  document.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target instanceof Element) {
      const { tagName, innerText } = e.target as HTMLElement;

      chrome.storage.sync.set({ '__test_intercept_element': {
        tagName,
        innerText
      } });
  
    }

    dimmElement.remove();
  }, {
    once: true
  })
}
