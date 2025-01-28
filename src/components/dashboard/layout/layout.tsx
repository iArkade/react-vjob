import * as React from 'react';
import { DynamicLayout } from './dynamic-layout';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedEmpresa } from '@/state/slices/empresaSlice';

export function Layout(): React.JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedEmpresa = localStorage.getItem("selectedEmpresa");
    if (storedEmpresa) {
      const empresa = JSON.parse(storedEmpresa);
      dispatch(setSelectedEmpresa(empresa));
    } else {
      // Redirigir si no hay empresa seleccionada
      navigate("/empresa");
    }
  }, [dispatch, navigate]);

  return (
    <DynamicLayout />
  );
}