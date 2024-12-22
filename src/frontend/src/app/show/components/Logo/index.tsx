"use client";

import styles from './logo.module.css';

export default function Logo(): React.JSX.Element {
    const host = typeof window !== "undefined" ? window.location.host : "localhost";
    const hostWithoutPort = host.split(":")[0];
    return (
        <img src={`http://${hostWithoutPort}:${process.env.NEXT_PUBLIC_APP_PORT}/api/images/icon.png`} alt="Logo" className={styles.logo} />
    );
}