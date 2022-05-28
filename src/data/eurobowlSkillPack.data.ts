import type { TeamTier } from '../models/team.model';

export const skillPackData: SkillPackMap = {
    '1': {
        A: {
            primarySkills: 6,
        },
        B: {
            primarySkills: 4,
            secondarySkills: 1,
        },
        C: {
            primarySkills: 3,
            starPlayers: 1,
        },
        D: {
            starPlayers: 2,
        },
    },
    '2': {
        A: {
            primarySkills: 7,
        },
        B: {
            primarySkills: 5,
            secondarySkills: 1,
        },
        C: {
            primarySkills: 4,
            starPlayers: 1,
        },
        D: {
            primarySkills: 1,
            starPlayers: 2,
        },
    },
    '3': {
        A: {
            primarySkills: 7,
            secondarySkills: 1,
        },
        B: {
            primarySkills: 5,
            secondarySkills: 2,
        },
        C: {
            primarySkills: 5,
            starPlayers: 1,
        },
        D: {
            primarySkills: 2,
            starPlayers: 2,
        },
    },
    '4': {
        A: {
            primarySkills: 8,
            secondarySkills: 1,
        },
        B: {
            primarySkills: 6,
            secondarySkills: 2,
        },
        C: {
            primarySkills: 6,
            starPlayers: 1,
        },
        D: {
            primarySkills: 3,
            starPlayers: 2,
        },
    },
    '5': {
        A: {
            primarySkills: 8,
            secondarySkills: 2,
        },
        B: {
            primarySkills: 6,
            secondarySkills: 3,
        },
        C: {
            primarySkills: 6,
            starPlayers: 1,
        },
        D: {
            primarySkills: 3,
            starPlayers: 2,
        },
    },
};

export type SkillPackMap = {
    [key in TeamTier]: TierSkillPacks;
};

type TierSkillPacks = {
    [key in SkillPackLabel]: SkillPack;
};

export type SkillPackLabel = 'A' | 'B' | 'C' | 'D';

export type SkillPack = {
    primarySkills?: number;
    secondarySkills?: number;
    starPlayers?: number;
};
