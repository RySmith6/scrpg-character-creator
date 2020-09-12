import exploded from '../rulebook-data/exploded-categories.json';


export class ExplodedCategories {
    static PushUniqueStatsFromCategory(statArray: string[], category: string) {
        let explodedCategory = exploded.powers[category] || exploded.qualities[category] || [];
        explodedCategory.forEach(s => {
            if (!statArray.includes(s))
                statArray.push(s);
        });
    }
    static PushAndExplode(statArray: string[], newStats: string[]) {
        newStats.forEach(s => {
            if (typeof (s) === "string")
                !s.startsWith('category') ? statArray.push(s) : ExplodedCategories.PushUniqueStatsFromCategory(statArray, s);
        });
    }
}
