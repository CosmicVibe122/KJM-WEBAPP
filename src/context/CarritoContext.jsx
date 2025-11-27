import { createContext, useState, useContext } from 'react';

// 1. Creamos el contexto
const CarritoContext = createContext();

// 2. Creamos el proveedor (Componente)
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Función para añadir producto
  const agregarAlCarrito = (producto) => {
    const itemEnCarrito = carrito.find((item) => item.id === producto.id);

    if (itemEnCarrito) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Función para eliminar producto
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  // Función para vaciar todo
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Calcular total ($)
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  
  // Calcular cantidad de items (para el icono)
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ 
        carrito, 
        agregarAlCarrito, 
        eliminarDelCarrito, 
        vaciarCarrito, 
        total,
        cantidadTotal
    }}>
      {children}
    </CarritoContext.Provider>
  );
}; 

// 3. Hook personalizado
// La siguiente línea evita que te salga el error rojo de advertencia:
// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);