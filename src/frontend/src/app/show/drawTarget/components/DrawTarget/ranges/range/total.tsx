import { getTotal } from "../../../../../lib/ranges";
import { useAppSelector } from "../../ranges-store/store";
import styles from "./range.module.css"

export default function Total({ id }: { id: number }): React.JSX.Element {
    const range = useAppSelector((state) => state.ranges[id]);
    if (!range) return <></>
    if (!range.active) return <></>
    const total = getTotal(range);
    return (
        <div className={styles.total}>
            {total}
        </div>
    )
}