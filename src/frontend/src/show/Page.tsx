import ServerState from "../components/serverEvents/serverState"
import DrawTarget from "./components/drawTarget/drawTarget"
import Clock from "./components/time"

export default function Show(): JSX.Element {
    return (
        <>
            <Clock locale="de-DE" />
            <ServerState />
            <DrawTarget options={{
                ranges: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                highlightAssign: false
            }} />
        </>
    )
}