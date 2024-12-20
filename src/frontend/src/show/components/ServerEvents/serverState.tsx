import ServerEvents from "./base";
import Warning from "../Warning";
import { useState } from "react";

export default function ServerState(): JSX.Element {
    const host = window.location.host;
    const hostWithoutPort = host.split(":")[0];
    const path = new URL(`http://${hostWithoutPort}:80/api/serverState/sse`);
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
