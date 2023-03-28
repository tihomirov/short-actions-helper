export enum ActionType {
  DocumentContentAction = 'DocumentContentAction',
  TabAction = 'TabAction',
}

export enum TabEventType {
  Reload = 'Reload',
  Close = 'Close',
  ToggleMute = 'Toggle Mute',
  IncreaseZoom = 'Increase Zoom',
  DecreaseZoom = 'Decrease Zoom',
  SetZoom = 'Set Zoom',
  Create = 'Create',
}

export enum ElementEvent {
  Click = 'Click',
  Focus = 'Focus',
}

export type ElementData = Readonly<{
  tagName: string;
  id?: string;
  innerText?: string;
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

export type SetZoomTabAction = Readonly<{
  type: ActionType.TabAction;
  tabEvent: TabEventType.SetZoom;
  value: string;
}>;

export type CreateTabAction = Readonly<{
  type: ActionType.TabAction;
  tabEvent: TabEventType.Create;
  value: string;
}>;

export type SupportedAction = DocumentContentAction | TabAction;
