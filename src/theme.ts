/**
 * Zentrales Design-System für sa'ns.
 * Dunkles "Nacht/Party"-Theme mit lila→pink Akzenten.
 */

export const colors = {
  bg: '#0E0B1F',
  bgElevated: '#16122B',
  surface: '#1E1838',
  surfaceAlt: '#272046',
  border: '#332B52',

  primary: '#7C5CFC',
  primaryDark: '#5B3FD6',
  pink: '#FF5CA8',
  accent: '#36D6C3',

  text: '#F4F2FF',
  textMuted: '#A79FC9',
  textFaint: '#6F6792',

  success: '#3DDC97',
  warning: '#FFB454',
  danger: '#FF5C7A',

  white: '#FFFFFF',
  black: '#000000',
};

export const gradients = {
  brand: ['#7C5CFC', '#FF5CA8'] as const,
  brandSoft: ['#5B3FD6', '#C44CD9'] as const,
  card: ['#211B3D', '#16122B'] as const,
  accent: ['#36D6C3', '#7C5CFC'] as const,
};

/** Statusfarben für Aufpass-Aufträge. */
export const statusColors = {
  pending: colors.warning,
  accepted: colors.success,
  declined: colors.danger,
  completed: colors.accent,
};

export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 };

/** 4px-Raster: spacing(2) = 8px usw. */
export const spacing = (n: number) => n * 4;

export const font = {
  h1: 30,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
};
