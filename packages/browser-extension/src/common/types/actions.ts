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
  tagName: string;
  innerText?: string;
  innerHTML?: string;
  href?: string;
  title?: string;
  src?: string;
}>;

export type DocumentContentAction = Readonly<{
  type: ActionType.DocumentContentAction;
  elementEvent: ElementEvent;
  elementData: ElementData;
}>;

export type TabAction = Readonly<{
  type: ActionType.TabAction;
  tabEvent: TabEventType;
}>;

export type SupportedAction = DocumentContentAction | TabAction;
