import { derived, writable } from 'svelte/store';
import { teamData } from '../data/teams.data';
import type { Writable } from 'svelte/store';
import type { Team } from '../models/team.model';
import { dbCollegeToTeam, DungeonBowlTeam } from '../models/dungeonBowl.model';
import { dungeonBowlColleges } from '../data/dungeonBowlColleges.data';

const currentTeamStore = () => {
    const { subscribe, update, set }: Writable<Team | DungeonBowlTeam> =
        writable<Team | DungeonBowlTeam>(getTeam());
    return {
        subscribe,
        set,
        setCurrentTeamWithCode: (code: string) => {
            update((store) => {
                return getTeamFromCode(code) || store;
            });
        },
        setCurrentTeamWithId: (id: number) => {
            update((store) => {
                return getTeamFromId(id) || store;
            });
        },
    };
};

const getTeamFromQuery = () => {
    const code = window.location.search.substring(1).split('=')[1];
    return getTeamFromCode(code);
};

const getTeamFromCode = (code: string) => {
    if (code) {
        const id = parseInt(code.split('t')[1], 10);
        return getTeamFromId(id);
    }
    return null;
};

const getTeamFromId = (id: number) => {
    if (id < 100) {
        return teamData.teams.find((x) => x.id === id);
    }
    return dbCollegeToTeam(
        dungeonBowlColleges.colleges.find((x) => x.id === id)
    );
};

const getTeamFromStorage = () => {
    const team = localStorage.getItem('selectedTeam');
    return team ? JSON.parse(team) : '';
};

const getTeam = () => {
    return getTeamFromQuery() || getTeamFromStorage();
};

export const currentTeam = currentTeamStore();
export const currentTeamIsDungeonBowl = derived(
    currentTeam,
    ($currentTeam) => $currentTeam.id >= 100
);
