export const enum ElementEvent {
  Click = 'click',
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
  