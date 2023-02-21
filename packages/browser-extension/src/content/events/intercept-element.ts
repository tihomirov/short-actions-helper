import { Response, ResponseFactory, InterceptDocumentElementMessage, isSomething } from '../../common';
import { MessageEvent } from './event';

const EVENT_LISTENER_OPTIONS: AddEventListenerOptions = {
  once: true,
};

export class InterceptElementEvent extends MessageEvent<InterceptDocumentElementMessage> {
  private readonly _backgroundElement: HTMLDivElement;
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

    iframesDocuments.forEach((iframeDocument) => {
      iframeDocument.addEventListener('click', this.eventHandler, EVENT_LISTENER_OPTIONS);
      this._removeEventListeners.push(() => iframeDocument.removeEventListener('click', this.eventHandler));
    });

    document.addEventListener('click', this.eventHandler, EVENT_LISTENER_OPTIONS);
    this._removeEventListeners.push(() => document.removeEventListener('click', this.eventHandler));
  }

  private finishInterceptMode(): void {
    this._backgroundElement.remove();
    this._removeEventListeners.forEach((removeEventListener) => removeEventListener());
    this._removeEventListeners.length = 0;
  }

  private eventHandler = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();

    if (!event.target) {
      throw new Error('Target of event is not presented');
    }

    const { tagName, innerText } = event.target as HTMLElement;

    if (!tagName) {
      throw new Error('Target can not be parsed. "tagName" is not defined');
    }

    chrome.storage.sync.set({
      interceptedElement: {
        tagName,
        innerText,
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
      .filter(filterOtherDomainIframes)
      .map((iframe) => iframe.contentWindow || iframe.contentDocument)
      .filter(isSomething);
  }
}

function filterOtherDomainIframes(iframe: HTMLIFrameElement): boolean {
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
