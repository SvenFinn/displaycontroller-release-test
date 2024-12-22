"use client";

import ServerEvents from "./base";
import Warning from "../Warning";
import { useState } from "react";

export default function ServerState(): React.JSX.Element {
    const host = typeof window !== "undefined" ? window.location.host : "localhost";
    const hostWithoutPort = host.split(":")[0];
    const path = new URL(`http://${hostWithoutPort}:${process.env.NEXT_PUBLIC_APP_PORT}/api/serverState/sse`);
    const [connected, setConnected] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function actionCallback(data: any) {
        if (typeof data !== "boolean") {
            return;
        }
        setConnected(data);
    }
    return (
        <>
            <ServerEvents path={path} canonicalName="Server State" action={actionCallback} />
            {connected ? <></> : <Warning level={900}>Keine Verbindung zum Meyton-Server verfügbar</Warning>}
        </>
    )
}
