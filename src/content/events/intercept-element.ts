import { Response, ResponseFactory, InterceptElementTabMessage } from '../../common';
import { MessageEvent } from './event';

export class InterceptElementEvent extends MessageEvent<InterceptElementTabMessage> {
  run(): Response<undefined> {
    runInterceptMode();
    return ResponseFactory.success(undefined);
  }
}

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
  dimmElement.style.flexDirection = 'column';
  dimmElement.style.justifyContent = 'center';
  dimmElement.style.alignItems = 'center';
  dimmElement.style.gap = '20%';
  dimmElement.innerHTML = `
    <span>Select element and open Extention again please</span>
    <span>Select element and open Extention again please</span>
    <span>Select element and open Extention again please</span>
    `;

  dimmElement.blur();

  document.body.appendChild(dimmElement);

  const iframes = document.getElementsByTagName('iframe');

  Array.from(iframes)
    .filter(filterOtherDomainIframes)
    .forEach((iframe) => {
      const contentWindow = iframe.contentWindow || iframe.contentDocument; //this is better approach

      contentWindow?.addEventListener(
        'click',
        (e: Event) => {
          onDocumentClick(e);
          dimmElement.remove();
        },
        {
          once: true,
        },
      );
    });

  document.addEventListener(
    'click',
    (e: Event) => {
      onDocumentClick(e);
      dimmElement.remove();
    },
    {
      once: true,
    },
  );
}

function filterOtherDomainIframes(iframe: HTMLIFrameElement): boolean {
  if (!iframe.src) {
    return true;
  }

  const iframeUrl = new URL(iframe.src);
  return window.location.origin === iframeUrl.origin;
}

function onDocumentClick(e: Event): void {
  e.preventDefault();
  e.stopPropagation();

  if (!e.target) {
    return;
  }

  const { tagName, innerText } = e.target as HTMLElement;

  if (!tagName) {
    return;
  }

  chrome.storage.sync.set({
    interceptedElement: {
      tagName,
      innerText,
    },
  });
}
