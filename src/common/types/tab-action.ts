export enum ElementEvent {
  Click = 'click',
  Focus = 'focus',
}

export type ElementData = Readonly<{
  tagName: keyof HTMLElementTagNameMap;
  innerText?: string;
}>;

export type TabAction = ElementData &
  Readonly<{
    elementEvent: ElementEvent;
  }>;
