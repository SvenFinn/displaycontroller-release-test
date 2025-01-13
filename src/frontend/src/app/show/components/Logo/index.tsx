"use client";

import { useEffect, useState } from 'react';
import styles from './logo.module.css';

export default function Logo(): React.JSX.Element {
    const [host, setHost] = useState<string>("");
    const [cacheBlock, setCacheBlock] = useState<number>((new Date().getTime()));

    useEffect(() => {
        setHost(window.location.host.split(":")[0]);
    }, []);

    if (host === "") {
        return <></>;
    }

    const logo = `http://${host}:${process.env.NEXT_PUBLIC_APP_PORT}/api/images/icon.png?cache=${cacheBlock}`;

    function onImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
        if (event.currentTarget.naturalHeight === 0 && event.currentTarget.naturalWidth === 0) {
            setTimeout(() => setCacheBlock((new Date()).getTime()), 1000);
        }
    }

    return (
        <img src={`http://${host}:${process.env.NEXT_PUBLIC_APP_PORT}/api/images/icon.png`} alt="Logo" className={styles.logo} onError={onImageError} />
    );
}