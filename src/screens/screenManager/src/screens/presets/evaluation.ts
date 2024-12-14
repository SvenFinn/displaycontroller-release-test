import { Screens } from ".";
import { EvaluationDbScreen } from "@shared/screens/evaluation";
import { isEvaluationListing } from "@shared/evaluations";

export default async function evaluation(screen: EvaluationDbScreen): Promise<Screens> {
    const fileExists = (await fetch(`http://evaluations/api/evaluations/${screen.options.file}`)).ok;
    if (!fileExists) return [{
        available: false
    }]
    if (isEvaluationListing(fileExists)) return [{
        available: false
    }];
    return [
        {
            available: true,
            id: screen.id,
            subId: 0,
            preset: "evaluation",
            options: screen.options,
            duration: screen.duration
        }
    ];
}


