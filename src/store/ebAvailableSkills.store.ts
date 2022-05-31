import { derived } from 'svelte/store';
import { skillCatalogue } from '../data/skills.data';
import type { StarPlayer } from '../models/player.model';
import type { RosterPlayerRecord } from '../models/roster.model';
import type { Readable } from 'svelte/store';
import { roster } from './teamRoster.store';
import type { SkillPackLabel } from '../data/eurobowlSkillPack.data';

export const ebAvailableSkills: Readable<SkillPackUsage> = derived(
    roster,
    ($roster) => {
        const players = $roster.players;
        const starPlayers = players.filter((x) => x.starPlayer);
        const starPlayerPoints = starPlayers
            .map((p) => p.player)
            .filter((p: StarPlayer) => p.extraSkillCost)
            .map((p: StarPlayer) => p.extraSkillCost)
            .reduce((a, b) => a + b, 0);
        const playersWithSkills = players.filter(
            (x) => x.alterations?.extraSkills
        );
        const skillCount = playersWithSkills.map((x) => getSkillCount(x));
        const doubleSkills = playersWithSkills.filter(
            (x) => x?.alterations?.extraSkills.length > 1
        );

        const skillAllotment = {
            label: $roster.skillPack?.label || 'A',
            primary: {
                max: $roster.skillPack?.primarySkills || 0,
                used:
                    skillCount
                        .map((x) => x.primary)
                        .reduce((a, b) => a + b, 0) +
                    starPlayerPoints -
                    doubleSkills.length,
            },
            secondary: {
                max: $roster.skillPack?.secondarySkills || 0,
                used:
                    skillCount
                        .map((x) => x.secondary)
                        .reduce((a, b) => a + b, 0) + doubleSkills.length,
            },
            star: {
                max: $roster.skillPack?.starPlayers || 0,
                used: starPlayers.length,
            },
            doubleSkills,
        };
        if (
            skillAllotment.primary.used > skillAllotment.primary.max &&
            skillAllotment.secondary.used < skillAllotment.secondary.max
        ) {
            while (
                skillAllotment.primary.used > skillAllotment.primary.max &&
                skillAllotment.secondary.used < skillAllotment.secondary.max
            ) {
                skillAllotment.primary.used--;
                skillAllotment.secondary.used++;
            }
        }
        return {
            ...skillAllotment,
        };
    }
);

export function getSkillCount(rosterPlayer: RosterPlayerRecord): {
    primary: number;
    secondary: number;
} {
    const extraSkills = rosterPlayer?.alterations?.extraSkills || [];
    if (extraSkills.length === 0) {
        return {
            primary: 0,
            secondary: 0,
        };
    }
    const categories = extraSkills.map(
        (skillId) =>
            skillCatalogue.find((skill) => skill.id === skillId).category
    );

    return {
        primary: categories.filter((c) =>
            rosterPlayer.player.primary.includes(c)
        ).length,
        secondary: categories.filter((c) =>
            rosterPlayer.player.secondary.includes(c)
        ).length,
    };
}

export type SkillPackUsage = {
    label: SkillPackLabel;
    primary?: { max: number; used: number };
    secondary?: { max: number; used: number };
    star?: { max: number; used: number };
    doubleSkills?: RosterPlayerRecord[];
};
