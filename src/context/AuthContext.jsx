import { createContext, useState, useContext } from 'react';

// 1. Crear el contexto
const AuthContext = createContext();

// 2. El Proveedor que envuelve a la app
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  const login = (datosUsuario) => {
    setUsuario(datosUsuario);
  };

  const logout = () => {
    setUsuario(null);
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