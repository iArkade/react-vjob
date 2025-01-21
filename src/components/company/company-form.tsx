import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { UseFormReturn, Controller } from "react-hook-form";
import { EmpresaRequestType } from '@/api/empresas/empresa-types';

interface EmpresaFormProps {
     form: UseFormReturn<EmpresaRequestType>;
     preview: string | null;
     onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
     onSubmit: (data: EmpresaRequestType) => Promise<void>;
}

export const EmpresaForm: React.FC<EmpresaFormProps> = ({
     form,
     preview,
     onFileChange,
     onSubmit,
}) => {
     const {
          register,
          handleSubmit,
          control,
          formState: { errors },
          watch,
     } = form;

     const rucValue = watch("ruc");
     const telefonoValue = watch("telefono");

     return (
          <form onSubmit={handleSubmit(onSubmit)}>
               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                         label="Codigo"
                         {...register("codigo")}
                         fullWidth
                         size="small"
                         error={!!errors.codigo}
                         helperText={errors.codigo?.message}
                    />
                    <TextField
                         label="RUC"
                         {...register("ruc", {
                              validate: {
                                   isNotEmpty: (value) =>
                                        value.trim() !== "" ||
                                        "El RUC es obligatorio y solo puede contener números!",
                                   isExactLength: (value) =>
                                        value.length === 13 ||
                                        "El RUC debe tener exactamente 13 dígitos",
                              },
                         })}
                         value={rucValue}
                         onChange={(e) => {
                              const value = e.target.value
                                   .replace(/[^0-9]/g, "")
                                   .slice(0, 13);
                              form.setValue("ruc", value, { shouldValidate: true });
                         }}
                         fullWidth
                         size="small"
                         error={!!errors.ruc}
                         helperText={errors.ruc?.message}
                    />
                    <TextField
                         label="Nombre"
                         {...register("nombre", {
                              required: "El nombre es obligatorio.",
                         })}
                         fullWidth
                         size="small"
                         error={!!errors.nombre}
                         helperText={errors.nombre?.message}
                    />
                    <TextField
                         label="Correo"
                         {...register("correo", {
                              pattern: {
                                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                   message: "El correo no tiene un formato válido",
                              },
                         })}
                         fullWidth
                         size="small"
                         error={!!errors.correo}
                         helperText={errors.correo?.message}
                    />
                    <TextField
                         label="Teléfono"
                         {...register("telefono", {
                              validate: {
                                   isNotEmpty: (value) =>
                                        value.trim() !== "" ||
                                        "El teléfono solo puede contener números!",
                                   isExactLength: (value) =>
                                        value.length === 10 ||
                                        "El teléfono solo puede tener 10 dígitos",
                              },
                         })}
                         value={telefonoValue}
                         onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                              form.setValue("telefono", value, { shouldValidate: true });
                         }}
                         fullWidth
                         size="small"
                         error={!!errors.telefono}
                         helperText={errors.telefono?.message}
                    />
                    <TextField
                         label="Direccion"
                         {...register("direccion")}
                         fullWidth
                         size="small"
                    />
                    <Controller
                         name="logo"
                         control={control}
                         render={({ field }) => (
                              <div>
                                   <label htmlFor="logo-upload">Logo</label>
                                   <br />
                                   <input
                                        type="file"
                                        accept="image/*"
                                        id="logo-upload"
                                        onChange={onFileChange}
                                   />
                                   {preview && (
                                        <img
                                             src={preview}
                                             alt="Vista previa del logo"
                                             style={{ maxWidth: "100%", marginTop: "10px" }}
                                        />
                                   )}
                              </div>
                         )}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                         <Button variant="contained" color="primary" type="submit">
                              Guardar
                         </Button>
                    </Box>
               </Box>
          </form>
     );
};
