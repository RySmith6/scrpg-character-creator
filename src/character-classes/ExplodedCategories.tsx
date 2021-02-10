import exploded from '../rulebook-data/exploded-categories.json';
import StatIndex from '../rulebook-data/stats-index.json';


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
    static GetCategoryForStat(stat: string): string {
        return StatIndex[stat] ? StatIndex[stat].category : 'Hallmark';
    }
    static GetTypeofStat(stat: string) {
        return StatIndex[stat] ? StatIndex[stat].statType : 'Unique';
    }
    static GetSortedExplodedCategories(stats: string[]): { stat: string, category: string, type: string }[] {
        let explodedStats = ExplodedCategories.ReturnStatsWithExplodedCategories(stats);
        let statsWithCategory = explodedStats.map(s => { return { stat: s, category: this.GetCategoryForStat(s), type: this.GetTypeofStat(s) } });
        let sorted = statsWithCategory.sort((a, b) => { return a.type != b.type ? (a.type == 'power' ? -1 : 1) : a.category != b.category ? (a.category.localeCompare(b.category)) : a.stat.localeCompare(b.stat) });
        return sorted;
    }
    static FilterCategories
}
