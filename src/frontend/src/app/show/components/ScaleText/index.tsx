"use client";

import styles from "./scaleText.module.css";
import { useState, useRef, useEffect } from "react";

interface ScaleTextProps {
    text: string;
}

export default function ScaleText({ text, }: ScaleTextProps): React.JSX.Element {
    const [fontSize, setFontSize] = useState<number>(100);
    const ref = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        applyFontSize();

        function applyFontSize() {
            if (!ref.current) return;
            if (!ref.current.parentElement) return;
            setFontSize(Math.min(100, Math.floor(100 * (ref.current.parentElement.clientWidth * 0.99) / ref.current.clientWidth)));
        }
        window.addEventListener("resize", applyFontSize);
        return () => {
            window.removeEventListener("resize", applyFontSize);
        }
    }, [text]);

    return (
        <>
            <span ref={ref} className={styles.measure}>{text}</span>
            <span className={styles.scaleText} style={{ fontSize: `${fontSize}%` }}>{text}</span>
        </>
    )

}