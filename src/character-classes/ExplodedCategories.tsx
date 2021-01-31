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
    static GetAllStatsInCategory(category: string) {
        return exploded.powers[category] || exploded.qualities[category] || [];
    }
    static GetReadableCategoryName(category: string) {
        let statType = exploded.powers[category] ? ' Powers' : ' Qualities';
        return category.substring(8) + statType
    }
    static ReturnStatsWithExplodedCategories(stats: string[]) {
        let fullstatsArray = [];
        ExplodedCategories.PushAndExplode(fullstatsArray, stats);
        return fullstatsArray;
    }
}
