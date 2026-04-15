export const desktopLeftNav = ['Inicio', 'Servicios'] as const;
export const desktopRightNav = ['Galería', 'Contacto'] as const;
export const mobileNav = ['Inicio', 'Servicios', 'Galería', 'Contacto'] as const;
export const footerNav = ['Inicio', 'Servicios', 'Membresías', 'Galería'] as const;

export const getSectionId = (label: string) =>
  label === 'Contacto' ? 'ubicación' : label.toLowerCase();
