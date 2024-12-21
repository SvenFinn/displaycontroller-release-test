import { getSeries } from "../../../../../lib/ranges";
import { useAppSelector } from "../../ranges-store/store"
import styles from "./range.module.css"

export default function SeriesList({ id }: { id: number }): React.JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    if (!range) return <></>;
    if (!range.active) return <></>;
    const series = getSeries(range);
    const rows = Math.ceil(series.length / 4);
    return (
        <table className={styles.seriesList}>
            <tbody>
                {Array.from({ length: rows }, (_, i) => (
                    <tr key={i}>
                        {Array.from({ length: 4 }, (_, j) => {
                            const index = i * 4 + j;
                            if (index >= series.length) return (<td key={j} className={styles.empty} />)
                            const value = series[index];
                            return (
                                <td key={j}>
                                    {value}
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
