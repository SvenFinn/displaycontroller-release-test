import { EvaluationScreen } from "@shared/screens/evaluation";
import styles from "./evaluation.module.css";

interface EvaluationProps {
    options: EvaluationScreen["options"],
    onReady: () => void;
}

export default function Evaluation({ options, onReady }: EvaluationProps) {
    const host = window.location.host;
    const hostWithoutPort = host.split(":")[0];
    const evaluationUrl = `http://${hostWithoutPort}:80/api/evaluations/${options.file}`;
    return (
        <div className={styles.evaluation}>
            <iframe src={evaluationUrl} onLoad={onReady} className={styles.evaluation} />
        </div>
    )
}