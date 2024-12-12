import { DisciplineLayout } from "@shared/ranges/discipline/layout";
import Ring from "./ring.tsx";

interface RingsProps {
    layout: DisciplineLayout,
    color: string
}

export default function Rings({ layout, color }: RingsProps): JSX.Element {
    if (!layout) return <></>;
    const layoutCopy = layout.slice().reverse();
    return (
        <g fill={color} stroke="black">
            {layoutCopy.map((ring, index) => (
                <Ring key={ring.value} ring={ring} printText={index < layoutCopy.length - 2} nextDiameter={layoutCopy[index + 1]?.diameter} color={color} />
            ))}
        </g>
    )
}