import { TabEvent } from '../common'

console.log('content script')

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.event) {
    case TabEvent.Debbug:
      sendResponse('Hello WWWWW')
      return
    case TabEvent.ElementClick:
      const { tag } = message.payload
      const { innerText } = message.payload
      const allElementsByTag = document.getElementsByTagName(tag)
      const elementToClick = Array.from(allElementsByTag).filter(
        (el) => el.innerText.toLowerCase() === innerText,
      )?.[0]

      console.log(elementToClick)
      
      if(elementToClick) {
        elementToClick.click();
      }

      sendResponse('elementToClick Clicked');
      return;
    default:
      return;
  }
})
