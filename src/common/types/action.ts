export enum ElementEvent {
  Click = 'click',
  Focus = 'focus',
}

export type ElementData = Readonly<{
  tagName: keyof HTMLElementTagNameMap;
  innerText?: string;
  // there will be other selector creteria
}>;
  
export type Action = Readonly<{
  event: ElementEvent,
  element: ElementData
}>;
  