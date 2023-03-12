import { assertUnreachable } from 'remote-shortcuts-common/src/utils';

import { ActionType, SupportedAction, truncate } from '../../../../common';

export function getPredefinedName(
  name?: string,
  actions?: ReadonlyArray<SupportedAction | Partial<SupportedAction>>,
): string | undefined {
  if (name || !actions || actions.length !== 1) {
    return undefined;
  }

  const [action] = actions;

  if (action.type === undefined) {
    return undefined;
  }

  switch (action.type) {
    case ActionType.DocumentContentAction: {
      const { elementEvent, elementData } = action;
      if (!elementData || !elementEvent) {
        return undefined;
      }

      const { tagName, innerText, title, src, href, innerHTML } = elementData;
      const elementSelector = truncate(innerText || title || src || href || innerHTML || '');

      return `${elementEvent}: <${tagName}> ${elementSelector}`;
    }
    case ActionType.TabAction: {
      const { tabEvent } = action;
      return tabEvent !== undefined ? `${tabEvent} Tab` : undefined;
    }
    default:
      assertUnreachable(action.type);
  }
}
