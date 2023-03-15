import { array, discriminatedUnion, literal, nativeEnum, object, string, TypeOf } from 'zod';

import { ActionType, ElementEvent, TabEventType } from '../../../../common';

const tabActionSchema = object({
  type: literal(ActionType.TabAction),
  tabEvent: nativeEnum(TabEventType, {
    required_error: 'Tab Event is required',
  }),
  value: string().optional(),
});

const documentContentActionSchema = object({
  type: literal(ActionType.DocumentContentAction),
  elementEvent: nativeEnum(ElementEvent, {
    required_error: 'Element Event is required',
  }),
  elementData: object({
    tagName: string({
      required_error: 'Tag Name is required',
    }),
    innerText: string().optional(),
    innerHTML: string().optional(),
    title: string().optional(),
    href: string().optional(),
    src: string().optional(),
  }),
});

export const commandSchema = object({
  _id: string().optional(),
  hostname: string().optional(),
  name: string().min(1, 'Name is required').max(140, 'Name must be less than 140 characters'),
  actions: array(
    discriminatedUnion('type', [tabActionSchema, documentContentActionSchema], {
      required_error: 'Action Type is required',
    }).refine(
      (data) => {
        if (data.type === ActionType.TabAction) {
          return data.tabEvent === TabEventType.SetZoom ? data.value : true;
        }
        return true;
      },
      {
        path: ['value'],
        message: 'Value is required for SetZoom action',
      },
    ),
  ).min(1, 'Command should have at least one action'),
});

export type CommandForm = TypeOf<typeof commandSchema>;
