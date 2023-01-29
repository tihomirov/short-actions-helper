import React, { useCallback } from 'react'
import { TabEvent } from '../../common'
import s from './style.scss'

const actionFn = (isDebbug: boolean) => {
  console.log('run action')
  const outputEl = document.getElementById('output')

  if (isDebbug) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0]?.id

      if (tabId === undefined) return

      console.log('tabId', tabId)

      chrome.tabs.sendMessage(
        tabId,
        {
          event: TabEvent.Debbug,
          payload: undefined,
        },
        function (response) {
          console.log('response', response)

          if (outputEl) {
            outputEl.innerHTML = response
          }
        },
      )
    })
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0]?.id

      if (tabId === undefined) return

      console.log('tabId', tabId)

      chrome.tabs.sendMessage(
        tabId,
        {
          event: TabEvent.ElementClick,
          payload: {
            tag: 'a',
            innerText: 'наступна серія',
          },
        },
        function (response) {
          console.log('response', response)

          if (outputEl) {
            outputEl.innerHTML = response
          }
        },
      )
    })
  }
}

function App(): JSX.Element {
  const onDebbug = useCallback(() => {
    actionFn(true);
  }, [])
  const onElementClick = useCallback(() => {
    actionFn(false);
  }, [])

  return (
    // <div className='app'>
    <div className={s.app}>
      <h1>Popup Page</h1>
      <p>If you are seeing this, React is working!</p>

      <button onClick={onDebbug}>Run Debbug</button>
      <button onClick={onElementClick}>Run Element Click</button>
      <div id="output" />
    </div>
  )
}

export default App
