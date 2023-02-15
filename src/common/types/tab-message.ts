import { DocumentContentAction } from './actions';

export enum TabEvent {
  Debbug = 'SAH_Debbug',
  RunAction = 'SAH_RunAction',
  InterceptElement = 'SAH_InterceptElement',
}

export type RunDocumentContentActionMessage = Readonly<{
  event: TabEvent.RunAction;
  action: DocumentContentAction;
}>;

export type InterceptDocumentElementMessage = Readonly<{
  event: TabEvent.InterceptElement;
}>;

export type DebbugMessage = Readonly<{
  event: TabEvent.Debbug;
}>;

export type TabMessage = RunDocumentContentActionMessage | InterceptDocumentElementMessage | DebbugMessage;

export type TabMessageResponse = {
  [TabEvent.Debbug]: undefined;
  [TabEvent.RunAction]: undefined;
  [TabEvent.InterceptElement]: undefined;
};
