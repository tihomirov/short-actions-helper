export enum ActionType {
  DocumentContentAction = 'DocumentContentAction',
  TabAction = 'TabAction',
}

export enum TabEventType {
  Reload = 'reload',
  Close = 'focus',
}

export enum ElementEvent {
  Click = 'click',
  Focus = 'focus',
}

export type ElementData = Readonly<{
  tagName: keyof HTMLElementTagNameMap;
  innerText?: string;
}>;

export type DocumentContentAction = ElementData &
  Readonly<{
    type: ActionType.DocumentContentAction;
    elementEvent: ElementEvent;
  }>;

export type TabAction = Readonly<{
  type: ActionType.TabAction;
  tabEvent: TabEventType;
}>;

export type SupportedAction = DocumentContentAction | TabAction;
