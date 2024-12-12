import ServerEvents from "./base";
import Warning from "../warning";
import { useState } from "react";

export default function ServerState(): JSX.Element {
    const path = new URL("http://localhost:80/api/serverState/sse");
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
