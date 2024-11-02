import { LocalClient } from "dc-db-local";
import { Shooter, isShooter } from "@shared/ranges/shooter";
import { InternalShooter, isInternalShooterById } from "@shared/ranges/internal";

export const shooters = new Map<number, Shooter>();

export async function updateShooters(localClient: LocalClient) {
    const newShooters = await localClient.cache.findMany({
        where: {
            type: "shooter",
        },
    });
    shooters.clear();
    for (const shooterDb of newShooters) {
        const shooter = shooterDb.value;
        if (!isShooter(shooter)) {
            continue;
        }
        if (shooter.id == null) {
            continue;
        }
        shooters.set(shooter.id, shooter);
    }
}

export function getShooter(shooter: InternalShooter | null): Shooter | null {
    if (shooter == null) { // Range is free
        return null;
    }
    if (isInternalShooterById(shooter)) {
        return shooters.get(shooter) ?? null;
    }
    return {
        id: null,
        firstName: shooter.firstName,
        lastName: shooter.lastName,
    }
}
