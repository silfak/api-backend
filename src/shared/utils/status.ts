export const STATUS = {
    REPORTED: 'REPORTED',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
} as const;

export type StatusName = typeof STATUS[keyof typeof STATUS];