"use client";


import { Provider } from "react-redux";
import ScreenEvents from "../ServerEvents/screens";
import ShowScreen from "./ShowScreen";
import { nextScreen } from "./store/screensReducer";
import { store } from "./store/store";


export default function ShowScreens(): React.JSX.Element {
    return (
        <Provider store={store}>
            <ShowScreen id={0} />
            <ShowScreen id={1} />
            <ScreenEvents action={nextScreen} />
        </Provider>
    )
}