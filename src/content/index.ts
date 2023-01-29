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

      console.log(elementToClick)
      
      if(elementToClick) {
        elementActionsMethods[elementAction as ElementAction]?.(elementToClick)
      }

      sendResponse('elementToClick Clicked');
      return;
    default:
      return;
  }
})
