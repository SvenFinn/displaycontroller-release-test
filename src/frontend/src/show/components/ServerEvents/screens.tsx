import { useDispatch } from "react-redux";
import ServerEvents from "./base";
import { isScreen, Screen } from "@shared/screens";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

interface ScreenEventsProps {
    action: ActionCreatorWithPayload<Screen>;
}

export default function ScreenEvents({ action }: ScreenEventsProps) {
    const dispatch = useDispatch();
    const host = window.location.host;
    const hostWithoutPort = host.split(":")[0];
    const path = new URL(`http://${hostWithoutPort}:80/api/screens/current/sse`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function screensAction(data: any) {
        if (!isScreen(data)) {
            return;
        }
        console.log(data);
        dispatch(action(data));
    }

    return (
        <ServerEvents path={path} canonicalName="Screens" action={screensAction} />
    )
}