import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import { nanoid } from 'nanoid';

import type {
    LeagueRosterStatus,
    Roster,
    RosterPlayerRecord,
} from '../models/roster.model';
import type { TeamName } from '../models/team.model';
import { deletedPlayer, stringToRoster } from '../helpers/stringToRoster';
import { currentTeam } from './currentTeam.store';
import { inducementCost } from '../helpers/totalInducementAmount';
import type { RosterMode } from './rosterMode.store';
import { savedRosterIndex } from './saveDirectory.store';
import { getGameTypeSettings, getMaxPlayers } from '../data/gameType.data';
import type { CollegeName } from '../models/dungeonBowl.model';
import type { TeamFormat } from '../types/teamFormat';
import type {
    RosterSkillPack,
    SkillPack,
    SkillPackLabel,
} from '../data/eurobowlSkillPack.data';

export const maxPlayerNumber = 16;

function createRoster() {
    const { subscribe, set, update }: Writable<Roster> = writable(
        getDefaultRoster()
    );

    return {
        subscribe,
        addPlayer: (player: RosterPlayerRecord, index?: number) =>
            update((store) => {
                if (
                    store.players.filter((p) => !p.deleted).length >=
                    getMaxPlayers(store?.format)
                ) {
                    return store;
                }
                return {
                    ...store,
                    players: addPlayerToPlayers(
                        store.players,
                        player,
                        maxPlayerNumber,
                        index
                    ),
                    treasury:
                        store.treasury -
                        (player?.alterations?.journeyman
                            ? 0
                            : player.player.cost),
                };
            }),
        removePlayer: (indices: number[], firePlayer: boolean) =>
            update((store) => {
                return {
                    ...store,
                    treasury: !firePlayer
                        ? store.treasury +
                          store.players
                              .filter((_, i) => indices.includes(i))
                              .map((p) => p.player.cost)
                              .reduce((a, b) => a + b, 0)
                        : store.treasury,
                    players: deletePlayersFromPlayers(store.players, indices),
                };
            }),
        updatePlayer: (player: RosterPlayerRecord, index: number) =>
            update((store) => {
                const updatedPlayers = [...store.players];
                updatedPlayers[index] = player;
                return { ...store, players: updatedPlayers };
            }),
        movePlayerUp: (index: number) =>
            update((store) => {
                return {
                    ...store,
                    players: switchTwoElements(store.players, index, index - 1),
                };
            }),
        movePlayerDown: (index: number) =>
            update((store) => {
                return {
                    ...store,
                    players: switchTwoElements(store.players, index, index + 1),
                };
            }),
        addInducement: (inducementKey: string) =>
            update((store) => {
                return {
                    ...store,
                    treasury:
                        store.treasury -
                        inducementCost(
                            store.format,
                            inducementKey,
                            store.teamId
                        ),
                    inducements: {
                        ...store.inducements,
                        [inducementKey]: store?.inducements?.[inducementKey]
                            ? store.inducements[inducementKey] + 1
                            : 1,
                    },
                };
            }),
        removeInducement: (inducementKey: string) =>
            update((store) => {
                return {
                    ...store,
                    treasury:
                        store.treasury +
                        inducementCost(
                            store.format,
                            inducementKey,
                            store.teamId
                        ),
                    inducements: {
                        ...store.inducements,
                        [inducementKey]: store?.inducements?.[inducementKey]
                            ? store.inducements[inducementKey] - 1
                            : 0,
                    },
                };
            }),
        removeAllInducements: () =>
            update((store) => {
                return { ...store, inducements: {} };
            }),
        addExtra: (extraKey: string, extraCost: number) =>
            update((store) => {
                return {
                    ...store,
                    treasury: store.treasury - extraCost,
                    extra: {
                        ...store.extra,
                        [extraKey]: store?.extra?.[extraKey]
                            ? store.extra[extraKey] + 1
                            : 1,
                    },
                };
            }),
        removeExtra: (extraKey: string, extraCost: number) =>
            update((store) => {
                return {
                    ...store,
                    treasury: store.treasury + extraCost,
                    extra: {
                        ...store.extra,
                        [extraKey]: store?.extra?.[extraKey]
                            ? store.extra[extraKey] - 1
                            : 0,
                    },
                };
            }),
        loadRoster: (rosterToLoad: Roster) =>
            update((_store) => {
                currentTeam.setCurrentTeamWithId(rosterToLoad.teamId);
                return rosterToLoad;
            }),
        codeToRoster: (rosterCode: string) =>
            update((_store) => {
                const loadedRoster =
                    rosterFromCode(rosterCode) || getEmptyRoster();
                currentTeam.setCurrentTeamWithCode(rosterCode);
                savedRosterIndex.newId();
                return { ...loadedRoster };
            }),
        changeRosterMode: (mode: RosterMode) =>
            update((store) => {
                return { ...store, mode };
            }),
        changeLeagueRosterStatus: (leagueRosterStatus: LeagueRosterStatus) =>
            update((store) => {
                return { ...store, leagueRosterStatus };
            }),
        updatePlayerNumber: (currentIndex: number, desired: number) => {
            update((store) => {
                if (
                    !Number.isInteger(desired) ||
                    desired > maxPlayerNumber ||
                    desired < 1
                ) {
                    return store;
                }

                const desiredIndex = desired - 1;
                const numberOfPlayers = store.players.length;
                let updatedPlayers: RosterPlayerRecord[] = store.players;
                if (desiredIndex >= store.players.length) {
                    updatedPlayers = Array(desired)
                        .fill({
                            deleted: true,
                            playerName: '',
                            alterations: { spp: 0, ni: 0 },
                            player: deletedPlayer(),
                        })
                        .map((p, i) =>
                            i < numberOfPlayers ? store.players[i] : p
                        );
                }
                const players = switchTwoElements(
                    updatedPlayers,
                    currentIndex,
                    desiredIndex
                );
                return { ...store, players };
            });
        },
        reset: (options?: {
            teamId: number;
            teamType: TeamName | CollegeName;
            mode: RosterMode;
            format: TeamFormat;
            fans: number;
            skillPack?: RosterSkillPack;
        }) => set(getEmptyRoster(options)),
        updateTreasury: (change: number) =>
            update((store) => {
                return { ...store, treasury: store.treasury + change };
            }),
        set,
    };
}

const getEmptyRoster: (options?: {
    teamId: number;
    teamType: TeamName | CollegeName;
    fans: number;
    mode: RosterMode;
    format: TeamFormat;
    skillPack?: RosterSkillPack;
}) => Roster = (options) => {
    const gameSettings = getGameTypeSettings(options?.format);
    return {
        rosterId: nanoid(),
        teamId: options?.teamId || 0,
        players: [],
        teamName: '',
        teamType: options?.teamType || ('' as TeamName),
        extra: { dedicated_fans: options?.fans || 0 },
        inducements: {},
        treasury: gameSettings?.startingTreasury || 1000,
        mode: options?.mode,
        format: options?.format || 'elevens',
        leagueRosterStatus: options?.mode === 'league' ? 'draft' : undefined,
        skillPack: options?.skillPack || {},
    };
};

const switchTwoElements = (arr: any[], index1: number, index2: number) => {
    if (
        typeof arr[index1] === 'undefined' ||
        typeof arr[index2] === 'undefined'
    ) {
        return arr;
    }
    return arr.map((x, i, a) =>
        i === index1 ? a[index2] : i === index2 ? a[index1] : x
    );
};

const rosterFromQueryString = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (urlParams.get('coach') && urlParams.get('email')) {
        localStorage.setItem('coach', urlParams.get('coach'));
        localStorage.setItem('email', urlParams.get('email'));
    }
    window.history.replaceState({}, '', '/');
    return rosterFromCode(code);
};

const rosterFromCode = (code: string) => {
    try {
        return stringToRoster(code);
    } catch (error) {
        return null;
    }
};

const getDefaultRoster: () => Roster = () => {
    const defaultRoster: Roster =
        rosterFromQueryString() ||
        JSON.parse(localStorage.getItem('roster')) ||
        getEmptyRoster();
    if (!defaultRoster.rosterId) {
        defaultRoster.rosterId = nanoid();
    }
    if (defaultRoster.mode === 'league' && !defaultRoster.leagueRosterStatus) {
        defaultRoster.leagueRosterStatus = 'draft';
    }
    currentTeam.setCurrentTeamWithId(defaultRoster.teamId);
    return {
        ...defaultRoster,
        format: defaultRoster?.format || 'elevens',
    };
};

const addPlayerToPlayers: (
    players: RosterPlayerRecord[],
    newPlayer: RosterPlayerRecord,
    maxPlayers: number,
    index?: number
) => RosterPlayerRecord[] = (players, newPlayer, maxPlayers, index) => {
    const indexToAdd =
        index < maxPlayers ? index : players.findIndex((p) => p.deleted);

    return indexToAdd >= 0 && indexToAdd < players.length
        ? players.map((p, i) => (i === indexToAdd ? newPlayer : p))
        : players.concat([newPlayer]);
};

const deletePlayersFromPlayers: (
    players: RosterPlayerRecord[],
    playerIndicesToRemove: number[]
) => RosterPlayerRecord[] = (players, playerIndicesToRemove) => {
    const newPlayers = players.map((p, i) =>
        playerIndicesToRemove.includes(i)
            ? {
                  ...p,
                  deleted: true,
                  alterations: { spp: 0, ni: 0 },
                  player: deletedPlayer(),
              }
            : p
    );
    while (newPlayers[newPlayers.length - 1]?.deleted) {
        newPlayers.pop();
    }

    return newPlayers;
};

export const roster = createRoster();
