"use client";

import { ScreenAvailable } from "@shared/screens";
import DrawTarget from "../../drawTarget/components/DrawTarget/drawTarget";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../Screens/store/store";
import { screenReady } from "../Screens/store/screensReducer";
import styles from "./showScreen.module.css";
import ImageViewer from "../../imageViewer/components/ImageViewer/imageViewer";
import Evaluation from "../../evaluation/components/Evaluation";

interface ShowScreenProps {
    id: number
}

export default function ShowScreen({ id }: ShowScreenProps): React.JSX.Element {
    const [visible, setVisible] = useState<boolean>(false);
    const screen = useAppSelector((state) => state.screens[id]);
    const dispatch = useAppDispatch();

    if (!screen) {
        return <></>;
    }

    function handleReady() {
        setVisible(true);
        dispatch(screenReady(id));
    }

    return (
        <div className={styles.showScreen} style={{ visibility: visible ? "visible" : "hidden" }}>
            {getScreenComponent(screen, handleReady)}
        </div>
    );

}


function getScreenComponent(screen: ScreenAvailable, setIsReady: () => void): React.JSX.Element {
    switch (screen.preset) {
        case "drawTarget":
            return <DrawTarget options={screen.options} onReady={setIsReady} />;
        case "imageViewer":
            return <ImageViewer options={screen.options} onReady={setIsReady} />;
        case "evaluation":
            return <Evaluation options={screen.options} onReady={setIsReady} />;
        default:
            setTimeout(setIsReady, 500);
            return <h1>Unknown preset: {screen.preset}</h1>;
    }
}