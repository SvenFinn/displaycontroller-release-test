import { isShooterById, isShooterByName, Shooter, ShooterById, ShooterByName } from "@shared/ranges/internal";
import { LocalClient } from "dc-db-local";
import { isShooter as isShooterTypeCheck } from "@shared/ranges/shooter";

export const shooterMap = new Map<ShooterById, ShooterByName>();

export async function updateShooters(client: LocalClient) {
    const shooters = await client.cache.findMany({
        where: {
            type: "shooter"
        }
    });
    shooterMap.clear();
    for (const shooter of shooters) {
        if (!isShooterTypeCheck(shooter.value)) {
            continue;
        }
        if (shooter.value.id === null) {
            continue;
        }
        shooterMap.set(shooter.value.id, { firstName: shooter.value.firstName, lastName: shooter.value.lastName });
    }
}

export function isSameShooter(shooterOne: Shooter, shooterTwo: Shooter): boolean {
    const isShooterOneById = isShooterById(shooterOne);
    const isShooterTwoById = isShooterById(shooterTwo);
    if (isShooterOneById && isShooterTwoById) {
        return shooterOne === shooterTwo;
    } else if (isShooterByName(shooterOne) && isShooterByName(shooterTwo)) {
        return shooterOne.firstName === shooterTwo.firstName && shooterOne.lastName === shooterTwo.lastName;
    } else if (isShooterOneById && isShooterByName(shooterTwo)) {
        const shooter = shooterMap.get(shooterOne);
        if (!shooter) {
            return false;
        }
        return shooter.firstName === shooterTwo.firstName && shooter.lastName === shooterTwo.lastName;
    } else if (isShooterTwoById && isShooterByName(shooterOne)) {
        const shooter = shooterMap.get(shooterTwo);
        if (!shooter) {
            return false;
        }
        return shooter.firstName === shooterOne.firstName && shooter.lastName === shooterOne.lastName;
    }
    return false;
}