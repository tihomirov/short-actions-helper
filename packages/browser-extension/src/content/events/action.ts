import { ElementEvent, Response, ResponseFactory, RunDocumentContentActionMessage } from '../../common';
import { MessageEvent } from './event';

const elementActionsMethods: Record<ElementEvent, (element: HTMLElement) => void> = {
  [ElementEvent.Click]: (element) => element.click(),
  [ElementEvent.Focus]: (element) => element.focus(),
};

export class ActionEvent extends MessageEvent<RunDocumentContentActionMessage> {
  run(): Response<undefined, string> {
    const { elementEvent } = this._message.action;
    const element = this.queryElement();

    if (element) {
      elementActionsMethods[elementEvent](element);
      return ResponseFactory.success(undefined);
    } else {
      return ResponseFactory.fail('Element is not found');
    }
  }

  private queryElement(): HTMLElement | undefined {
    const { tagName, innerText } = this._message.action;

    const elementsByTagName = document.getElementsByTagName(tagName as keyof HTMLElementTagNameMap);
    let elementsArray = Array.from(elementsByTagName);

    if (innerText) {
      elementsArray = elementsArray.filter((e) => e.innerText.toLowerCase() === innerText.toLowerCase());
    }

    // just get first element for now
    return elementsArray[0];
  }
}
