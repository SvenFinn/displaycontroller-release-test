"use client";

import ServerEvents from "./base";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { isRange, Range } from "@shared/ranges";
import { useAppDispatch } from "../../drawTarget/components/DrawTarget/ranges-store/store";

interface RangeEventsProps {
    ranges: Array<number>;
    action: ActionCreatorWithPayload<Range>;
}

export default function RangeEvents({ action, ranges }: RangeEventsProps): React.JSX.Element {
    const dispatch = useAppDispatch();
    const host = typeof window !== "undefined" ? window.location.host : "localhost";
    const hostWithoutPort = host.split(":")[0];
    const path = new URL(`http://${hostWithoutPort}:80/api/ranges/sse`);
    path.searchParams.append("ranges", JSON.stringify(ranges));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function actionCallback(data: any) {
        if (!isRange(data)) {
            return;
        }
        dispatch(action(data));
    }

    return (
        <ServerEvents path={path} canonicalName="Ranges" action={actionCallback} />
    )
}