import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { EmpresaResponseType } from "@/api/empresas/empresa-types";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";


interface Empresa {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
}

export function GestionEmpresas(): React.JSX.Element {
    const [empresas, setEmpresas] = React.useState<Empresa[]>([
        { id: 1, nombre: 'Empresa A', direccion: 'Calle 1 # 1-1', telefono: '1234567890' },
        { id: 2, nombre: 'Empresa B', direccion: 'Calle 2 # 2-2', telefono: '0987654321' },
    ]);

    const [nuevaEmpresa, setNuevaEmpresa] = React.useState<Omit<Empresa, 'id'>>({
        nombre: '',
        direccion: '',
        telefono: '',
    });

    const [editandoEmpresa, setEditandoEmpresa] = React.useState<Empresa | null>(null);

    const agregarEmpresa = () => {
        const nuevaEmpresaConId = {
            id: empresas.length + 1,
            ...nuevaEmpresa,
        };
        setEmpresas([...empresas, nuevaEmpresaConId]);
        setNuevaEmpresa({ nombre: '', direccion: '', telefono: '' });
    };

    const eliminarEmpresa = (id: number) => {
        setEmpresas(empresas.filter((empresa) => empresa.id !== id));
    };

    const editarEmpresa = (empresa: Empresa) => {
        setEditandoEmpresa(empresa);
    };

    const guardarCambios = () => {
        if (editandoEmpresa) {
            const nuevasEmpresas = empresas.map((empresa) =>
                empresa.id === editandoEmpresa.id ? editandoEmpresa : empresa
            );
            setEmpresas(nuevasEmpresas);
            setEditandoEmpresa(null);
        }
    };

    return (
        <div>
            <h2>Gestión de Empresas</h2>

            <h3>Lista de Empresas</h3>
            <ul>
                {empresas.map((empresa) => (
                    <li key={empresa.id}>
                        {empresa.nombre} - {empresa.direccion} - {empresa.telefono}
                        <button onClick={() => editarEmpresa(empresa)}>Editar</button>
                        <button onClick={() => eliminarEmpresa(empresa.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>

            <h3>Agregar Empresa</h3>
            <input
                type="text"
                placeholder="Nombre"
                value={nuevaEmpresa.nombre}
                onChange={(e) =>
                    setNuevaEmpresa({ ...nuevaEmpresa, nombre: e.target.value })
                }
            />
            <input
                type="text"
                placeholder="Dirección"
                value={nuevaEmpresa.direccion}
                onChange={(e) =>
                    setNuevaEmpresa({ ...nuevaEmpresa, direccion: e.target.value })
                }
            />
            <input
                type="text"
                placeholder="Teléfono"
                value={nuevaEmpresa.telefono}
                onChange={(e) =>
                    setNuevaEmpresa({ ...nuevaEmpresa, telefono: e.target.value })
                }
            />
            <button onClick={agregarEmpresa}>Agregar</button>

            {editandoEmpresa && (
                <div>
                    <h3>Editar Empresa</h3>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={editandoEmpresa.nombre}
                        onChange={(e) =>
                            setEditandoEmpresa({ ...editandoEmpresa, nombre: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Dirección"
                        value={editandoEmpresa.direccion}
                        onChange={(e) =>
                            setEditandoEmpresa({
                                ...editandoEmpresa,
                                direccion: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Teléfono"
                        value={editandoEmpresa.telefono}
                        onChange={(e) =>
                            setEditandoEmpresa({
                                ...editandoEmpresa,
                                telefono: e.target.value,
                            })
                        }
                    />
                    <button onClick={guardarCambios}>Guardar Cambios</button>
                </div>
            )}
        </div>
    );
};
