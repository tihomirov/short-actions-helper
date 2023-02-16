export enum ActionType {
  DocumentContentAction = 'DocumentContentAction',
  TabAction = 'TabAction',
}

export enum TabEventType {
  Reload = 'Reload',
  Close = 'Close',
  ToggleMute = 'Toggle Mute',
}

export enum ElementEvent {
  Click = 'Click',
  Focus = 'Focus',
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
