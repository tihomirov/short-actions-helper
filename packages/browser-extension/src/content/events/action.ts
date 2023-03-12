import { Response, ResponseFactory } from 'remote-shortcuts-common/src/utils';

import { ElementEvent, RunDocumentContentActionMessage } from '../../common';
import { MessageEvent } from './event';

const elementActionsMethods: Record<ElementEvent, (element: HTMLElement) => void> = {
  [ElementEvent.Click]: (element) => element.click(),
  [ElementEvent.Focus]: (element) => element.focus(),
};

export class ActionEvent extends MessageEvent<RunDocumentContentActionMessage> {
  run(): Response<undefined> {
    const { elementEvent } = this._message.action;
    const element = this.queryElement();

    if (element) {
      elementActionsMethods[elementEvent](element);
      return ResponseFactory.success(undefined);
    } else {
      return ResponseFactory.fail({
        message: 'Element is not found',
      });
    }
  }

  private queryElement(): HTMLElement | undefined {
    const { tagName, innerText, innerHTML, href, title, src } = this._message.action.elementData;

    const elementsByTagName = document.getElementsByTagName(tagName as keyof HTMLElementTagNameMap);
    let elementsArray = Array.from(elementsByTagName);

    if (innerText) {
      elementsArray = elementsArray.filter((e) => e.innerText.toLowerCase() === innerText.toLowerCase());
    }

    if (innerHTML) {
      elementsArray = elementsArray.filter((e) => e.innerHTML === innerHTML);
    }

    if (title) {
      elementsArray = elementsArray.filter((e) => e.title === title);
    }

    if (href) {
      elementsArray = elementsArray.filter((e) => e instanceof HTMLAnchorElement && e.href === href);
    }

    if (src) {
      elementsArray = elementsArray.filter((e) => e instanceof HTMLImageElement && e.src === src);
    }

    // just get first element for now
    return elementsArray[0];
  }
}
