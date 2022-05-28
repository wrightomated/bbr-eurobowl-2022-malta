<script lang="ts">
    import type { Team, TeamTier } from '../models/team.model';
    import {
        currentTeam,
        currentTeamIsDungeonBowl,
    } from '../store/currentTeam.store';
    import { roster } from '../store/teamRoster.store';
    import {
        teamSelectionOpen,
        showNewTeamDialogue,
    } from '../store/teamSelectionOpen.store';
    import { savedRosterIndex } from '../store/saveDirectory.store';
    import { teamLoadOpen } from '../store/teamLoadOpen.store';
    import {
        filteredTiers,
        teamTiers,
        toggledTiers,
    } from '../store/filterTier.store';
    import {
        showAvailablePlayers,
        showAvailableStarPlayers,
    } from '../store/showPlayerList.store';
    import MaterialButton from './uiComponents/materialButton.svelte';
    import { rosterMode } from '../store/rosterMode.store';
    import ToggleButton from './uiComponents/toggleButton.svelte';
    import { teamFormat } from '../store/teamFormat.store';
    import type { RosterMode } from '../store/rosterMode.store';
    import { blurOnEscapeOrEnter } from '../helpers/blurOnEscapeOrEnter';
    import { sendEventToAnalytics } from '../analytics/plausible';
    import Button from './uiComponents/button.svelte';
    import { flip } from 'svelte/animate';
    import { scale } from 'svelte/transition';
    import { showDungeonBowl } from '../store/showDungeonBowl.store';
    import type { TeamFormat } from '../types/teamFormat';
    import { getSavedRosterFromLocalStorage } from '../helpers/localStorageHelper';

    export let teamList: Team[];

    let rosterCode: string;

    $: searchTerm = '';

    $: sortedTeam = sortTeam()
        .filter((x) => $filteredTiers.includes(x.tier))
        .filter((x) =>
            searchTerm
                ? x.name.toLowerCase().includes(searchTerm.toLowerCase())
                : x
        );

    const sortTeam = () => {
        return teamList.sort((a, b) => a.name.localeCompare(b.name));
    };

    const newTeam = (index: number) => {
        currentTeam.setCurrentTeamWithId(index);
    };

    const toggleLoad = () => {
        teamLoadOpen.set(!$teamLoadOpen);
    };

    const createTeam = () => {
        savedRosterIndex.newId();
        roster.reset({
            teamId: $currentTeam.id,
            teamType: $currentTeam.name,
            mode: 'exhibition',
            fans: 0,
            format: 'elevens',
        });

        teamSelectionOpen.set(false);
        showAvailablePlayers.set(false);
        showAvailableStarPlayers.set(false);
        showNewTeamDialogue.set(false);

        sendEventToAnalytics('new-team-created', {
            teamType: $currentTeam.name,
            rosterMode: $rosterMode,
            format: $teamFormat,
        });
    };

    const loadTeam = (savedRoster: { id: number; name?: string }) => {
        savedRosterIndex.updateCurrentIndex(savedRoster.id);

        // TODO: change this for database
        roster.loadRoster(getSavedRosterFromLocalStorage(savedRoster.id));
        teamSelectionOpen.set(false);
        showAvailablePlayers.set(false);
        showAvailableStarPlayers.set(false);
        showNewTeamDialogue.set(false);
        teamLoadOpen.set(false);
    };

    const tierToNumeral = (tier: TeamTier) => {
        const tierMap = {
            1: 'I',
            2: 'II',
            3: 'III',
            4: 'IV',
            5: 'V',
        };
        return tierMap[tier];
    };

    const inputCode = () => {
        roster.codeToRoster(rosterCode);
        toggleLoad();
    };

    const toggleDungeonBowl = (show: boolean) => {
        teamLoadOpen.set(false);
        teamSelectionOpen.set(!show);
        showDungeonBowl.set(show);
    };

    function changeFormat(format: any) {
        teamFormat.set(format);
        toggleDungeonBowl(format === 'dungeon bowl');
    }
</script>

{#if !$teamLoadOpen && $showNewTeamDialogue}
    <h2 class="page-title">Create EuroBowl 2022 Malta Team</h2>

    {#if $teamSelectionOpen}
        <div class="button-container">
            <div class="filter__tier">
                Filter:
                {#each teamTiers as tier}
                    <button
                        on:click={() => toggledTiers.toggleTier(tier)}
                        class:selected={$filteredTiers.includes(tier)}
                        class="filter__button">{tierToNumeral(tier)}</button
                    >{' '}
                {/each}
            </div>
            <label class="filter__search">
                Search: <input
                    bind:value={searchTerm}
                    placeholder="Team type"
                />
            </label>
            <br />
            <div>
                {#each sortedTeam as team (team.id)}
                    <button
                        class="team-buton"
                        animate:flip={{ duration: 200 }}
                        transition:scale|local={{ duration: 200 }}
                        class:selected={$currentTeam.id === team.id}
                        on:click={() => newTeam(team.id)}
                        >{team.name}
                        <span class="display-font"
                            >{tierToNumeral(team.tier)}</span
                        ></button
                    >
                {/each}
                {#if sortedTeam.length === 0}
                    <p class="no-matches">No matches</p>
                {/if}
            </div>
        </div>
        <Button
            clickFunction={createTeam}
            cyData="create-team"
            disabled={!$currentTeam || $currentTeamIsDungeonBowl}>Create</Button
        >
    {/if}
{/if}

{#if $teamLoadOpen}
    <h2 class="page-title">Load Team</h2>
    <div class="button-container" data-cy="load-team-box">
        <div class="code-box">
            <input
                aria-label="Input code"
                id="code-input"
                placeholder="Input Code"
                bind:value={rosterCode}
                use:blurOnEscapeOrEnter
            />
            <MaterialButton
                hoverText="Enter code"
                symbol="input"
                clickFunction={inputCode}
            />
        </div>

        <h3>Locally stored teams</h3>
        {#each $savedRosterIndex.index as savedRoster, i}
            <Button clickFunction={() => loadTeam(savedRoster)}
                >{savedRoster.name || 'Saved Roster ' + (i + 1)}</Button
            >
        {/each}
    </div>
    <!-- Refactor to it's own component -->
{/if}

<style lang="scss">
    @use '../styles/mixins/roundedButton';
    @import '../styles/font';

    .page-title {
        color: var(--main-colour);
        text-align: center;
        font-size: 32px;
        margin-block-start: 16px;
        margin-block-end: 24px;
    }

    .button-container {
        margin-top: 8px;
        margin-bottom: 8px;
        border-radius: 10px;
        background: var(--secondary-background-colour);
        padding: 8px;
    }
    .display-font {
        font-family: $display-font;
    }
    .no-matches {
        margin-left: 4px;
    }

    .filter {
        &__tier {
            display: inline-block;
            margin: 1em 4px 1em 4px;
        }
        &__button {
            font-family: $display-font;
            border-radius: 50%;
            font-size: 0.75em;
            background-color: white;
            color: var(--secondary-colour);
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 0px;
            text-align: center;
            margin: 0 auto;
            border: 2px solid var(--secondary-colour);

            &:hover {
                border-color: var(--secondary-background-colour);
            }
            &.selected {
                background-color: var(--secondary-colour);
                color: white;
                border-color: var(--secondary-colour);
            }
        }
        &__search {
            display: inline-block;
            margin: 0 4px 1rem 4px;
        }
    }

    .code-box {
        display: flex;
        padding: 10px;
        align-items: center;

        input {
            margin-right: 8px;
            font-size: 16px;
        }
    }
    .pill-box {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-block-end: 32px;
    }
    .team-buton {
        @include roundedButton.rounded-button;
    }
    .team-previews {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
        margin: 16px 8px;
    }
    .signed-in-heading {
        text-align: center;
    }
</style>
