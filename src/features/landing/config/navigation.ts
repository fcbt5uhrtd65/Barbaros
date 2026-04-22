export const desktopLeftNav = ['Inicio', 'Servicios', 'Infantil'] as const;
export const desktopRightNav = ['Galería', 'Contacto'] as const;
export const mobileNav = ['Inicio', 'Servicios', 'Infantil', 'Galería', 'Contacto'] as const;
export const footerNav = ['Inicio', 'Servicios', 'Infantil', 'Membresías', 'Galería'] as const;

export const getSectionId = (label: string) =>
  label === 'Contacto' ? 'ubicación' : label.toLowerCase();
