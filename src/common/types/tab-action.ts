export enum ElementEvent {
  Click = 'click',
  Focus = 'focus',
}

export type TabAction = Readonly<{
  elementEvent: ElementEvent;
  tagName: keyof HTMLElementTagNameMap;
  innerText?: string;
}>;
