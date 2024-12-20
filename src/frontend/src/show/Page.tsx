import { Provider } from "react-redux";
import ScreenEvents from "./components/ServerEvents/screens";
import ServerState from "./components/ServerEvents/serverState"
import { Background } from "./components/Background"
import Clock from "./components/Clock"
import Logo from "./components/Logo"
import ShowScreen from "./components/ShowScreen";
import { nextScreen } from "./store/screensReducer";
import { store } from "./store/store";
import FullscreenButton from "./components/Fullscreen";

export default function Show(): JSX.Element {
    return (
        <Provider store={store}>
            <ShowScreen id={0} />
            <ShowScreen id={1} />
            <FullscreenButton />
            <Clock />
            <Logo />
            <ScreenEvents action={nextScreen} />
            <ServerState />
            <Background />
        </Provider>
    )
}