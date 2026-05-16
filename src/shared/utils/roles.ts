export const ROLES = {
  ADMIN: 'ADMIN',
  MAHASISWA: 'MAHASISWA',
  OB: 'OB',
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];
