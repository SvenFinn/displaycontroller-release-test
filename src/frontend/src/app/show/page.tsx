"use client";
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
import styles from "./show.module.css";

export default function Show(): React.JSX.Element {
    return (
        <div className={styles.show}>

            <Provider store={store}>
                <ShowScreen id={0} />
                <ShowScreen id={1} />
                <Background />
                <ScreenEvents action={nextScreen} />
            </Provider>
            <FullscreenButton />
            <Clock />
            <Logo />
            <ServerState />
        </div >
    )
}