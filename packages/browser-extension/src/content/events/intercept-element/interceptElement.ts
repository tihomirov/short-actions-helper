import { isSomething, ResponseFactory } from 'remote-shortcuts-common/src/utils';
import browser from 'webextension-polyfill';

import {
  DocumentContentAction,
  InterceptDocumentElementMessage,
  PendingCommandForm,
  StorageKey,
  TabMessageEvent,
  TabMessageResponse,
} from '../../../common';
import { MessageEvent } from '../event';
import { createBackgroundElement } from './createBackgroundElement';
import { getElementData } from './getElementData';
import { isElementHidden } from './isElementHidden';
import { isIframesSupported } from './isIframesSupported';
import { markIframeAsNotSupported } from './markIframeAsNotSupported';

export class InterceptElementEvent extends MessageEvent<
  InterceptDocumentElementMessage,
  TabMessageResponse[TabMessageEvent.InterceptElement]
> {
  private readonly _notSupportedBackgroundIframes: HTMLDivElement[] = [];
  private readonly _removeEventListeners: Array<() => void> = [];
  private readonly _backgroundElement: HTMLDivElement;

  constructor(protected readonly _message: InterceptDocumentElementMessage) {
    super(_message);
    this._backgroundElement = createBackgroundElement();
  }

  run() {
    try {
      this.runInterceptMode();
      return ResponseFactory.success(undefined);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ResponseFactory.fail({
          message: `Error: ${error.message}`,
        });
      }

      return ResponseFactory.fail({
        message: `Unexpected Error: ${error}`,
      });
    }
  }

  private runInterceptMode(): void {
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

    document.body.appendChild(this._backgroundElement);
  }

  private finishInterceptMode(): void {
    this._backgroundElement.remove();

    this._notSupportedBackgroundIframes.forEach((element) => element.remove());
    this._notSupportedBackgroundIframes.length = 0;

    this._removeEventListeners.forEach((removeEventListener) => removeEventListener());
    this._removeEventListeners.length = 0;
  }

  private eventHandler = async (event: Event): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    const { target } = event;

    if (!target) {
      throw new Error('Target of event is not presented');
    }

    if (target instanceof HTMLIFrameElement && this._notSupportedBackgroundIframes.includes(target)) {
      return;
    }

    const elementData = getElementData(target);

    const actionIndex = this._message.actionIndex;
    const { pendingCommand } = await browser.storage.sync.get(StorageKey.PendingCommand);
    const commandToUpdate = (pendingCommand || { actions: [] }) as PendingCommandForm;

    const documentContentAction: DocumentContentAction = {
      ...(commandToUpdate.actions[actionIndex] as DocumentContentAction),
      elementData,
    };

    commandToUpdate.actions[actionIndex] = documentContentAction;

    await browser.storage.sync.set({ [StorageKey.PendingCommand]: commandToUpdate });

    this.finishInterceptMode();
  };

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
