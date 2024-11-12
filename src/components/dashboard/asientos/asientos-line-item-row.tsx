// LineItemRow.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { OutlinedInput, TableCell, TableRow, IconButton } from '@mui/material';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

interface LineItemRowProps {
     item: any;
     index: number;
     onRemove: (id: string) => void;
     handleOpenModal: (index: number) => void;
}

const LineItemRow: React.FC<LineItemRowProps> = ({ item, index, onRemove, handleOpenModal }) => {
     const { control, setValue, getValues } = useFormContext();

     const handleDebeChange = (value: number) => {

          const updatedItems = [...getValues('lineItems')];
          updatedItems[index].debe = value;
          setValue('lineItems', updatedItems);
          if (value !== 0) setValue(`lineItems.${index}.haber`, 0);
     };

     const handleHaberChange = (value: number) => {
          const updatedItems = [...getValues('lineItems')];
          updatedItems[index].haber = value;
          setValue('lineItems', updatedItems);
          if (value !== 0) setValue(`lineItems.${index}.debe`, 0);
     };

     return (
          <TableRow key={item.id_asiento_item}>
               <TableCell>
                    <IconButton 
                         onClick={() => onRemove(item.id_asiento_item)}
                         sx={{ alignSelf: 'flex-end' }}
                    >
                         <TrashIcon />
                    </IconButton>
               </TableCell>
               <TableCell>
                    <Controller
                         control={control}
                         name={`lineItems.${index}.codigo_centro`}
                         render={({ field }) => <OutlinedInput {...field} fullWidth />}
                    />
               </TableCell>
               <TableCell>
                    <Controller
                         control={control}
                         name={`lineItems.${index}.cta`}
                         render={({ field }) => (
                              <OutlinedInput {...field} fullWidth onClick={() => handleOpenModal(index)} />
                         )}
                    />
               </TableCell>
               <TableCell>
                    <Controller
                         control={control}
                         name={`lineItems.${index}.cta_nombre`}
                         render={({ field }) => <OutlinedInput {...field} fullWidth />}
                    />
               </TableCell>
               <TableCell>
                    <Controller
                         control={control}
                         name={`lineItems.${index}.debe`}
                         render={({ field }) => (
                              <OutlinedInput
                                   {...field}
                                   type="number"
                                   inputProps={{ min: 0, step: 0.01 }}
                                   onChange={(e) => handleDebeChange(parseFloat(e.target.value) || 0)}
                                   fullWidth
                              />
                         )}
                    />
               </TableCell>
               <TableCell>
                    <Controller
                         control={control}
                         name={`lineItems.${index}.haber`}
                         render={({ field }) => (
                              <OutlinedInput
                                   {...field}
                                   type="number"
                                   inputProps={{ min: 0, step: 0.01 }}
                                   onChange={(e) => handleHaberChange(parseFloat(e.target.value) || 0)}
                                   fullWidth
                              />
                         )}
                    />
               </TableCell>
               <TableCell>
                    <Controller
                         control={control}
                         name={`lineItems.${index}.nota`}
                         render={({ field }) => <OutlinedInput {...field} fullWidth />}
                    />
               </TableCell>
          </TableRow>
     );
};

export default LineItemRow;
