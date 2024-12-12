import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import ServerEvents from "./base";
import { isScreen, Screen } from "@shared/screens";

interface ScreenEventsProps {
    action: ActionCreatorWithPayload<Screen>;
}

export default function ScreenEvents({ action }: ScreenEventsProps) {
    const path = new URL("http://localhost:80/api/screens/sse");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function screensAction(data: any) {
        if (!isScreen(data)) {
            return;
        }
        action(data);
    }

    return (
        <ServerEvents path={path} canonicalName="Screens" action={screensAction} />
    )
}