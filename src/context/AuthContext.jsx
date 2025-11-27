import { createContext, useState, useContext, useEffect } from 'react';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. El Proveedor que envuelve a la app
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('usuario');
      if (saved) {
        setUsuario(JSON.parse(saved));
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    }
  }, []);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
    try { localStorage.setItem('usuario', JSON.stringify(datosUsuario)); } catch { }
  };

  const logout = () => {
    setUsuario(null);
    try { localStorage.removeItem('usuario'); } catch { }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. EL GANCHO (HOOK) QUE FALTABA
// Esta es la línea clave que arregla el error "does not provide an export named useAuth"
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);