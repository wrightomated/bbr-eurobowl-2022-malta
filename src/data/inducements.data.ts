import type { Inducement } from '../models/inducement.model';

export const inducementData: { inducements: Inducement[] } = {
    inducements: [
        { id: 'i4', displayName: 'Bloodweiser Keg', cost: 50, max: 2 },
        {
            id: 'i7',
            displayName: 'Bribe',
            cost: 100,
            reducedCost: { specialRule: 'Bribery and Corruption', cost: 50 },
            max: 3,
            dungeonBowlMax: 3,
        },
        {
            id: 'i8',
            displayName: 'Wandering Apothecary',
            cost: 100,
            max: 2,
            requiresApothecary: true,
        },
        {
            id: 'i9',
            displayName: 'Mortuary Assistant',
            cost: 100,
            max: 1,
            requiresSpecialRule: 'Sylvanian Spotlight',
        },
        {
            id: 'i10',
            displayName: 'Plague Doctor',
            cost: 100,
            max: 1,
            requiresSpecialRule: 'Favoured of Nurgle',
        },
        {
            id: 'i12',
            displayName: 'Halfling Master Chef',
            cost: 300,
            reducedCost: { specialRule: 'Halfling Thimble Cup', cost: 100 },
            max: 1,
        },
    ],
};
