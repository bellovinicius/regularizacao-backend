import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [empresaId, setEmpresaId] = useState<string | null>(
    localStorage.getItem('empresaId')
  );
  const [usuarioId, setUsuarioId] = useState<string | null>(
    localStorage.getItem('usuarioId')
  );

  const login = (token: string, empresaId: string, usuarioId: string) => {
    setToken(token);
    setEmpresaId(empresaId);
    setUsuarioId(usuarioId);
    localStorage.setItem('token', token);
    localStorage.setItem('empresaId', empresaId);
    localStorage.setItem('usuarioId', usuarioId);
  };

  const logout = () => {
    setToken(null);
    setEmpresaId(null);
    setUsuarioId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('empresaId');
    localStorage.removeItem('usuarioId');
  };

  return {
    token,
    empresaId,
    usuarioId,
    isAuthenticated: !!token,
    login,
    logout,
  };
};
