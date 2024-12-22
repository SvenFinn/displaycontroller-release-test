"use client";

import { ViewerScreen } from "@shared/screens/imageViewer";
import styles from "./imageViewer.module.css"

interface ImageViewerProps {
    options: ViewerScreen["options"],
    onReady: () => void;
}

export default function ImageViewer({ options, onReady }: ImageViewerProps) {
    const host = typeof window !== "undefined" ? window.location.host : "localhost";
    const hostWithoutPort = host.split(":")[0];
    const imageUrl = `http://${hostWithoutPort}:${process.env.NEXT_PUBLIC_APP_PORT}/api/images/${options.file}`;
    return (
        <div className={styles.imageViewer}>
            <img src={imageUrl} alt="image" onLoad={onReady} className={styles.imageViewer} />
        </div>
    )
}

