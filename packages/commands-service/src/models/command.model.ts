import { InferSchemaType, model, Schema } from 'mongoose';

const ActionSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  tabEvent: String,
  elementEvent: String,
  tagName: String,
  innerText: String,
  innerHTML: String,
  title: String,
  href: String,
  src: String,
});

const commandSchema = new Schema(
  {
    hostname: String,
    name: {
      type: String,
      required: true,
    },
    createdUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    actions: [ActionSchema],
  },
  { timestamps: true },
);

export type Command = InferSchemaType<typeof commandSchema>;
export const CommandModel = model<Command>('Command', commandSchema);
