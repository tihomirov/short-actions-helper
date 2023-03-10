import { isSomething, Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { InterceptDocumentElementMessage } from '../../common';
import { MessageEvent } from './event';

const MAX_SAVED_INNER_HTML_LENGTH = 2000;

export class InterceptElementEvent extends MessageEvent<InterceptDocumentElementMessage> {
  private readonly _backgroundElement: HTMLDivElement;
  private readonly _notSupportedBackgroundIframes: HTMLDivElement[] = [];
  private readonly _removeEventListeners: Array<() => void>;

  constructor(protected readonly _message: InterceptDocumentElementMessage) {
    super(_message);
    this._backgroundElement = getBackgroundElement();
    this._removeEventListeners = [];
  }

  run(): Response<undefined, string> {
    try {
      this.runInterceptMode();
      return ResponseFactory.success(undefined);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseFactory.fail(`Error: ${error.message}`);
      }

      return ResponseFactory.fail(`Unexpected Error: ${error}`);
    }
  }

  private runInterceptMode(): void {
    this.appendBackgroundElement();
    const iframesDocuments = this.querySupportedIframeDocuments();
    const linkElements = document.querySelectorAll('a');

    iframesDocuments.forEach((iframeDocument) => {
      iframeDocument.addEventListener('click', this.eventHandler);
      this._removeEventListeners.push(() => iframeDocument.removeEventListener('click', this.eventHandler));
    });

    linkElements.forEach((linkElement) => {
      linkElement.addEventListener('click', this.eventHandler);
      this._removeEventListeners.push(() => linkElement.removeEventListener('click', this.eventHandler));
    });

    document.addEventListener('click', this.eventHandler);
    this._removeEventListeners.push(() => document.removeEventListener('click', this.eventHandler));
  }

  private finishInterceptMode(): void {
    this._backgroundElement.remove();

    this._notSupportedBackgroundIframes.forEach((element) => element.remove());
    this._notSupportedBackgroundIframes.length = 0;

    this._removeEventListeners.forEach((removeEventListener) => removeEventListener());
    this._removeEventListeners.length = 0;
  }

  private eventHandler = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    const { target } = event;

    if (!target) {
      throw new Error('Target of event is not presented');
    }

    if (target instanceof HTMLIFrameElement && this._notSupportedBackgroundIframes.includes(target)) {
      return;
    }

    let tagName: string | undefined;
    let innerHTML: string | undefined;
    let innerText: string | undefined;
    let href: string | undefined;
    let title: string | undefined;
    let src: string | undefined;

    if (target instanceof HTMLElement) {
      tagName = target.tagName;
      innerHTML = target.innerHTML.length < MAX_SAVED_INNER_HTML_LENGTH ? target.innerHTML.trim() : '';
      innerText = target.innerText?.trim();
      title = target.title?.trim();
    }

    if (target instanceof HTMLAnchorElement) {
      href = target.href;
    }

    if (target instanceof HTMLImageElement) {
      src = target.src;
    }

    if (!tagName) {
      throw new Error('Target can not be parsed. "tagName" is not defined');
    }

    chrome.storage.sync.set({
      interceptedElement: {
        tagName,
        innerText,
        innerHTML,
        title,
        href,
        src,
      },
    });

    this.finishInterceptMode();
  };

  private appendBackgroundElement(): void {
    document.body.appendChild(this._backgroundElement);
  }

  private querySupportedIframeDocuments(): ReadonlyArray<Window | Document> {
    const iframes = document.getElementsByTagName('iframe');

    return Array.from(iframes)
      .filter((iframe) => !isElementHidden(iframe))
      .filter((iframe: HTMLIFrameElement) => {
        const isSupported = isIframesSupported(iframe);

        if (!isSupported) {
          const backgroundElement = markIframeAsNotSupported(iframe);
          this._notSupportedBackgroundIframes.push(backgroundElement);
        }

        return isSupported;
      })
      .map((iframe) => iframe.contentWindow || iframe.contentDocument)
      .filter(isSomething);
  }
}

function isIframesSupported(iframe: HTMLIFrameElement): boolean {
  if (!iframe.src) {
    return true;
  }

  const iframeUrl = new URL(iframe.src);
  return window.location.origin === iframeUrl.origin;
}

function getBackgroundElement(): HTMLDivElement {
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

function markIframeAsNotSupported(iframe: HTMLIFrameElement): HTMLDivElement {
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

function isElementHidden(element: HTMLElement) {
  return element.offsetParent === null;
}
