import { useDispatch } from "react-redux";
import ServerEvents from "./base";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { isRange, Range } from "@shared/ranges";

interface RangeEventsProps {
    ranges: Array<number>;
    action: ActionCreatorWithPayload<Range>;
}

export default function RangeEvents({ action, ranges }: RangeEventsProps): JSX.Element {
    const dispatch = useDispatch();
    const path = new URL("http://localhost:80/api/ranges/sse");
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