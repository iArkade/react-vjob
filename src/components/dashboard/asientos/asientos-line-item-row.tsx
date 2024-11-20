// LineItemRow.tsx
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { OutlinedInput, TableCell, TableRow, IconButton, Select } from '@mui/material';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Option } from '@/components/core/option';
import { DatCentro } from '@/api/asientos/asientos-types';
import { useGetCentroCosto } from '@/api/centro_costo/centro-costo-request';


interface LineItemRowProps {
     item: any;
     index: number;
     onRemove: (id: string) => void;
     handleOpenModal: (index: number) => void;
     handleCentroChange: (centro:string) => void;
}

const LineItemRow: React.FC<LineItemRowProps> = ({ item, index, onRemove, handleOpenModal, handleCentroChange }) => {
     const { control, setValue, getValues } = useFormContext();
     const { data: centros = [], isLoading: isLoadingCentros, isError: isErrorCentros } = useGetCentroCosto();

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
                         render={({ field }) => 
                              <Select 
                                   {...field} 
                                   label="Centro"
                                   disabled={isLoadingCentros || isErrorCentros}
                                   value={field.value || ''}     
                                   onChange={(e) => {
                                        field.onChange(e);
                                        handleCentroChange(e.target.value);
                                   }} 
                              >
                                   {isErrorCentros && <Option value=""><em>Error cargando centros</em></Option>}
                                                                      
                                   {isLoadingCentros ? (
                                        <Option value=""><em>Cargando centros...</em></Option>
                                   ) : (
                                        centros?.map((centro: DatCentro) => (
                                             <Option key={centro.id}  value={centro.codigo}>
                                                  {centro.nombre}
                                             </Option>
                                        ))
                                   )}
                              </Select>
                         }
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
                                   //onChange={(e) => handleDebeChange(parseFloat(e.target.value) || 0)}
                                   onChange={(e) => {
                                        const value = e.target.value;
                                        const parsedValue = value === '' ? '' : parseFloat(value);
                                        field.onChange(parsedValue);
                                   }}
                                   onBlur={(e) => {
                                        const value = e.target.value;
                                        const parsedValue = value === '' ? 0 : parseFloat(value);
                                        field.onChange(parsedValue);
                                        handleDebeChange(parsedValue);
                                   }}
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
                                   onChange={(e) => {
                                        const value = e.target.value;
                                        const parsedValue = value === '' ? '' : parseFloat(value);
                                        field.onChange(parsedValue);
                                   }}
                                   onBlur={(e) => {
                                        const value = e.target.value;
                                        const parsedValue = value === '' ? 0 : parseFloat(value);
                                        field.onChange(parsedValue);
                                        handleHaberChange(parsedValue);
                                   }}                                   
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
