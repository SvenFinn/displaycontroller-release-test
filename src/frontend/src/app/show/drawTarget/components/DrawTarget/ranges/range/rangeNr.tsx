import styles from "./range.module.css"

export default function RangeNr({ id }: { id: number }): React.JSX.Element {
    return (
        <div className={styles.rangeNumber}>
            {id}
        </div>
    )
}