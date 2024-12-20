import styles from './logo.module.css';

export default function Logo(): JSX.Element {
    const host = window.location.host;
    const hostWithoutPort = host.split(":")[0];
    return (
        <img src={`http://${hostWithoutPort}:80/api/images/icon.png`} alt="Logo" className={styles.logo} />
    );
}