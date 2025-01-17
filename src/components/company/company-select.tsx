import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { EmpresaRequestType } from '@/api/empresas/empresa-types';

interface CompanySelectProps {
     selectedCompany: string;
     companies: EmpresaRequestType[] | undefined;
     onChange: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

export const CompanySelect: React.FC<CompanySelectProps> = ({ selectedCompany, companies, onChange }) => (
     <FormControl fullWidth>
          <Select value={selectedCompany} onChange={onChange} displayEmpty size="small">
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
