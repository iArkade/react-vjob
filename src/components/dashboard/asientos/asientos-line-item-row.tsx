// LineItemRow.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  OutlinedInput,
  TableCell,
  TableRow,
  IconButton,
  Select,
  FormHelperText,
} from "@mui/material";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Option } from "@/components/core/option";
import { AsientoItem, DatCentro } from "@/api/asientos/asientos-types";
import { useGetCentroCosto } from "@/api/centro_costo/centro-costo-request";

interface LineItemRowProps {
  item: any;
  index: number;
  onRemove: (id: number) => void;
  handleOpenModal: (index: number) => void;
  handleCentroChange: (centro: string) => void;
}

const LineItemRow: React.FC<LineItemRowProps> = ({
  item,
  index,
  onRemove,
  handleOpenModal,
  handleCentroChange,
}) => {
  const {
    control,
    setValue,
    getValues,
    register,
    formState: { errors },
    clearErrors
  } = useFormContext<{ lineItems: AsientoItem[] }>();

  React.useEffect(() => {
    if (item?.id !== undefined) {
      setValue(`lineItems.${index}.id`, item.id);
    }
  }, [item?.id, index, setValue]);

  const {
    data: centros = [],
    isLoading: isLoadingCentros,
    isError: isErrorCentros,
  } = useGetCentroCosto();

  const handleDebeChange = (value: number) => {
    const updatedItems = [...getValues("lineItems")];
    updatedItems[index].debe = value;
    setValue("lineItems", updatedItems);

    if (value !== 0) setValue(`lineItems.${index}.haber`, 0);
  };

  const handleHaberChange = (value: number) => {
    const updatedItems = [...getValues("lineItems")];
    updatedItems[index].haber = value;
    setValue("lineItems", updatedItems);

    if (value !== 0) setValue(`lineItems.${index}.debe`, 0);
  };

  const lineItemErrors = errors.lineItems?.[index];

  return (
    <TableRow key={item.index}>
      <TableCell>
        <IconButton
          onClick={() => onRemove(index)}
          sx={{ alignSelf: "flex-end" }}
        >
          <TrashIcon />
        </IconButton>
      </TableCell>
      {item?.id !== undefined && (
        <input type="hidden" {...register(`lineItems.${index}.id`)} />
      )}
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.codigo_centro`}
          render={({ field }) => (
            <>
              <Select
                {...field}
                label="Centro"
                disabled={isLoadingCentros || isErrorCentros}
                value={field.value || ""}
                onChange={(e) => {
                  field.onChange(e);
                  handleCentroChange(e.target.value);
                }}
                error={!!lineItemErrors?.codigo_centro}
              >
                {isErrorCentros && (
                  <Option value="">
                    <em>Error cargando centros</em>
                  </Option>
                )}

                {isLoadingCentros ? (
                  <Option value="">
                    <em>Cargando centros...</em>
                  </Option>
                ) : (
                  centros?.map((centro: DatCentro) => (
                    <Option key={centro.id} value={centro.codigo}>
                      {centro.nombre}
                    </Option>
                  ))
                )}
              </Select>
              {lineItemErrors?.codigo_centro && (
                <FormHelperText error>
                  {lineItemErrors.codigo_centro.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.cta`}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                fullWidth
                error={!!lineItemErrors?.cta}
                onClick={() => {
                  handleOpenModal(index)

                  if (lineItemErrors?.cta) {
                    clearErrors(`lineItems.${index}.cta`);
                  }
                }}
              />
              {lineItemErrors?.cta && (
                <FormHelperText error>
                  {lineItemErrors.cta.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.cta_nombre`}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                //error={!!lineItemErrors?.cta_nombre}
                fullWidth
              />
              {/* {lineItemErrors?.cta_nombre && (
                <FormHelperText error>
                  {lineItemErrors.cta_nombre.message}
                </FormHelperText>
              )} */}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.debe`}
          defaultValue={item?.debe || 0}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                error={!!lineItemErrors?.debe}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === "" ? 0 : parseFloat(value);
                  field.onChange(parsedValue); // Update the field value
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === "" ? 0 : parseFloat(value);
                  field.onChange(parsedValue); // Ensure the field value is updated on blur
                  handleDebeChange(parsedValue);
                }}
                value={field.value ?? ""}
                fullWidth
              />
              {lineItemErrors?.debe && (
                <FormHelperText error>
                  {lineItemErrors.debe.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.haber`}
          defaultValue={item?.debe || 0}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                error={!!lineItemErrors?.haber}
                onChange={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === "" ? 0 : parseFloat(value);
                  field.onChange(parsedValue);
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  const parsedValue = value === "" ? 0 : parseFloat(value);
                  field.onChange(parsedValue);
                  handleHaberChange(parsedValue);
                }}
                fullWidth
              />
              {lineItemErrors?.haber && (
                <FormHelperText error>
                  {lineItemErrors.haber.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
      <TableCell>
        <Controller
          control={control}
          name={`lineItems.${index}.nota`}
          render={({ field }) => (
            <>
              <OutlinedInput
                {...field}
                fullWidth
                error={!!lineItemErrors?.nota}
              />
              {lineItemErrors?.nota && (
                <FormHelperText error>
                  {lineItemErrors.nota.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </TableCell>
    </TableRow>
  );
};

export default LineItemRow;
