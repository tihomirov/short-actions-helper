import { TabEvent, ElementAction } from '../common'

console.log('content script')

const elementActionsMethods: Record<ElementAction, (element: HTMLElement) => void> = {
  [ElementAction.Click]: (element) => element.click(),
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.event) {
    case TabEvent.Debbug:
      sendResponse('Hello WWWWW')
      return
    case TabEvent.ElementAction:
      const { elementTagName, elementInnerText, elementAction } = message.action;
      const allElementsByTag = document.getElementsByTagName(elementTagName)
      const elementToClick = Array.from(allElementsByTag).filter(
        (el) => el.innerText.toLowerCase() === elementInnerText,
      )?.[0]
      
      if(elementToClick) {
        elementActionsMethods[elementAction as ElementAction]?.(elementToClick)
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

  dimmElement.blur()

  document.body.appendChild(dimmElement);

  document.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target instanceof Element) {
      const { tagName: elementTagName, innerText: elementInnerText } = e.target as HTMLElement;

      chrome.storage.sync.set({ '__test_intercept_element': {
        elementTagName,
        elementInnerText
      } });
  
    }

    dimmElement.remove();
  }, {
    once: true
  })
}
