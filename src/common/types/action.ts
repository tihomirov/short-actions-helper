export const enum ElementAction {
  Click = 'click',
}
  
export type Action = Readonly<{
  elementAction: ElementAction,
  elementTagName: keyof HTMLElementTagNameMap;
  elementInnerText?: string;
}>;
  