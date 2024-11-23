// Función 'cn' para combinar clases de manera condicional
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
