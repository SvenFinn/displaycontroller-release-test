export type Shooter = {
    id: number | null; // Null = Can't be determined uniquely
    firstName: string;
    lastName: string;
}

export function isShooter(shooter: any): shooter is Shooter {
    if (!shooter.id && !shooter.id === null) return false;
    if (!shooter.firstName) return false;
    if (!shooter.lastName) return false;
    return true;
}