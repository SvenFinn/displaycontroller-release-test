import { LocalClient } from "dc-db-local";
import { isShooter } from "@shared/ranges/shooter"
import { Shooter } from "@shared/ranges/internal"

const matchShooter = new Map<string, Shooter>();

export async function updateShooters(client: LocalClient) {
    const shooters = await client.cache.findMany({
        where: {
            type: "shooter"
        }
    });
    matchShooter.clear();
    for (const shooter of shooters) {
        if (!isShooter(shooter.value)) {
            continue;
        }
        if (!shooter.value.id) {
            continue;
        }
        if (matchShooter.has(`${shooter.value.lastName}, ${shooter.value.firstName}`)) {
            matchShooter.set(`${shooter.value.lastName}, ${shooter.value.firstName}`, {
                firstName: shooter.value.firstName,
                lastName: shooter.value.lastName
            });
        } else {
            matchShooter.set(`${shooter.value.lastName}, ${shooter.value.firstName}`, Number(shooter.value.id));
        }
    }
}

export function getShooters(message: string): Shooter | null {
    let currentShooter: Shooter | null = null;
    let currentShooterName = "";
    for (const [name, key] of matchShooter) {
        if (currentShooterName.length < name.length && message.includes(name)) {
            currentShooter = key;
            currentShooterName = name;
        }
    }
    return currentShooter;
}

