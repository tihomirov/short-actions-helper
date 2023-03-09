import { arrayTypeguard, isEnum, isString, typeguard } from 'remote-shortcuts-common/src/utils';

import {
  ActionType,
  DocumentContentAction,
  ElementEvent,
  SupportedAction,
  TabAction,
  TabEventType,
} from '../../../common';
import { Command, Commands, CurrentUser } from '../types';

const documentContentActionTypeguard = typeguard<DocumentContentAction>(
  ['type', (value) => value === ActionType.DocumentContentAction],
  ['elementEvent', isEnum(ElementEvent)],
  ['tagName', isString],
  ['innerText', isString, true],
);

const tabActionTypeguard = typeguard<TabAction>(
  ['type', (value) => value === ActionType.TabAction],
  ['tabEvent', isEnum(TabEventType)],
);

const actionTypeguard = (action: unknown): action is SupportedAction =>
  documentContentActionTypeguard(action) || tabActionTypeguard(action);

const commandTypeguard = typeguard<Command>(
  ['_id', isString],
  ['name', isString],
  ['hostname', isString, true],
  ['actions', arrayTypeguard(actionTypeguard)],
);

export const commandResponseTypeguard = typeguard<{ command: Command }>(['command', commandTypeguard]);

export const commandsResponseTypeguard = typeguard<{ commands: Commands }>([
  'commands',
  arrayTypeguard(commandTypeguard),
]);

export const currentUserResponseTypeguard = typeguard<{ user: CurrentUser }>([
  'user',
  typeguard(['_id', isString], ['email', isString]),
]);
