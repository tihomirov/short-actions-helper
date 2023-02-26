import React, { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { CommandForm } from './command-schema';
import { CommandFormAction } from './CommandFormAction';

export const CommandFormActions: FC = () => {
  const { control } = useFormContext<CommandForm>();
  const { fields } = useFieldArray({
    control,
    name: 'actions',
  });

  return (
    <>
      {fields.map((field, index) => (
        <CommandFormAction key={field.id} index={index} />
      ))}
    </>
  );
};
