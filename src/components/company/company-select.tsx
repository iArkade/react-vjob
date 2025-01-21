import React from 'react';
import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { EmpresaResponseType } from '@/api/empresas/empresa-types';

interface EmpresaSelectProps {
     selectedCompany: string;
     companies?: EmpresaResponseType[];
     onSelectChange: (event: SelectChangeEvent<string>) => void;
}

export const EmpresaSelect: React.FC<EmpresaSelectProps> = ({
     selectedCompany,
     companies,
     onSelectChange,
}) => {
     return (
          <FormControl fullWidth sx={{ flex: 1, mr: 2 }}>
               <Select
                    value={selectedCompany}
                    onChange={onSelectChange}
                    displayEmpty
                    size="small"
               >
                    <MenuItem value="">
                         <em>Selecciona una empresa</em>
                    </MenuItem>
                    {companies?.map((company) => (
                         <MenuItem key={company.codigo} value={company.codigo}>
                              {company.nombre}
                         </MenuItem>
                    ))}
               </Select>
          </FormControl>
     );
};


