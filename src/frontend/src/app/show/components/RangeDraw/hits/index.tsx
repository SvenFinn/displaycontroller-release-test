import Hit from "./hit"
import { Range } from "@shared/ranges";

export default function DrawHits({ range }: { range: Range }): React.JSX.Element {
    if (!range.active) return <></>;
    if (!range.discipline) return <></>;
    const round = range.discipline.rounds[range.round];
    if (!round) return <></>;
    const hitsPerView = round.hitsPerView;
    if (!range.hits) return <></>;
    const hits = range.hits[range.round];
    if (!hits) return <></>;
    const startingIndex = Math.floor((hits.length - 1) / hitsPerView) * hitsPerView;
    const hitsCopy = hits.slice(startingIndex)
    const gauge = range.discipline.gauge;
    return (
        <g>
            {hitsCopy.map((hit, index) => (
                <Hit key={index} hit={hit} gauge={gauge} isLatest={index == hitsCopy.length - 1} />
            ))}
        </g>
    )
}    