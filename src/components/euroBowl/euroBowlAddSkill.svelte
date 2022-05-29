<script lang="ts">
    import { skillCatalogue } from '../../data/skills.data';
    import type { RosterPlayerRecord } from '../../models/roster.model';
    import { categoryToName } from '../../models/skill.model';
    import {
        ebAvailableSkills,
        getSkillCount,
    } from '../../store/ebAvailableSkills.store';

    import { rosterViewMode } from '../../store/rosterDisplayMode.store';
    import { roster } from '../../store/teamRoster.store';
    import ToggleButton from '../uiComponents/toggleButton.svelte';

    export let index: number;

    $: rosterPlayer = $roster.players[index];

    $: availableSkills = skillCatalogue.filter(
        (x) =>
            !rosterPlayer.alterations?.extraSkills?.includes(x.id) &&
            !rosterPlayer.player.skills.includes(x.id)
    );

    $: allowPrimary =
        ($ebAvailableSkills.primary.used < $ebAvailableSkills.primary.max &&
            (rosterPlayer.alterations?.extraSkills?.length || 0) < 1) ||
        ($ebAvailableSkills.secondary.used < $ebAvailableSkills.secondary.max &&
            (rosterPlayer.alterations?.extraSkills?.length || 0) < 1) ||
        ($ebAvailableSkills.doubleSkills?.length === 0 &&
            $ebAvailableSkills.primary.used < $ebAvailableSkills.primary.max &&
            $ebAvailableSkills.secondary.used <
                $ebAvailableSkills.secondary.max &&
            getSkillCount(rosterPlayer).secondary === 0);

    $: allowSecondary =
        $ebAvailableSkills.secondary.used < $ebAvailableSkills.secondary.max &&
        (rosterPlayer.alterations?.extraSkills?.length || 0) < 1;

    $: primarySkills = availableSkills.filter((s) =>
        rosterPlayer.player.primary.includes(s.category)
    );
    $: secondarySkills = availableSkills.filter((s) =>
        rosterPlayer.player.secondary.includes(s.category)
    );
    $: selectedPrimary = rosterPlayer.player.primary[0];
    $: selectedSecondary = rosterPlayer.player.secondary[0];

    function addSkill(skillId: number) {
        const extraSkills = (
            rosterPlayer.alterations?.extraSkills || []
        ).concat([skillId]);
        const newPlayer: RosterPlayerRecord = {
            ...rosterPlayer,
            alterations: {
                ...rosterPlayer.alterations,
                extraSkills,
                advancements: (rosterPlayer.alterations?.advancements || 0) + 1,
            },
        };
        roster.updatePlayer(newPlayer, index);
    }
    function removeSkill(skillId: number) {
        const extraSkills = (
            rosterPlayer.alterations?.extraSkills || []
        ).filter((x) => x !== skillId);
        const newPlayer: RosterPlayerRecord = {
            ...rosterPlayer,
            alterations: {
                ...rosterPlayer.alterations,
                extraSkills,
                advancements: (rosterPlayer.alterations?.advancements || 0) - 1,
            },
        };
        roster.updatePlayer(newPlayer, index);
    }
</script>

<div class="container" class:grid-view={$rosterViewMode === 'grid'}>
    <h2>
        Manage skills for {rosterPlayer?.playerName ||
            rosterPlayer.player.position}
    </h2>
    {#each rosterPlayer?.alterations?.extraSkills || [] as skillId}
        <button on:click={() => removeSkill(skillId)} class="delete-skill"
            >Remove {skillCatalogue.find((x) => x.id === skillId).name}</button
        >
    {/each}

    {#if allowPrimary}
        <h3>Add Primary Skill:</h3>
        <ToggleButton
            options={rosterPlayer.player.primary}
            selectedIndex={selectedPrimary
                ? rosterPlayer.player.primary.indexOf(selectedPrimary)
                : 0}
            selected={(cat) => (selectedPrimary = cat)}
        />

        <p class="category-label">
            {categoryToName.get(selectedPrimary)}
        </p>
        {#each primarySkills.filter((s) => s.category === selectedPrimary) as s}
            <button on:click={() => addSkill(s.id)}>{s.name}</button>
        {/each}
    {/if}
    {#if allowSecondary}
        <h3>Add Secondary Skill:</h3>
        <ToggleButton
            options={rosterPlayer.player.secondary}
            selectedIndex={selectedSecondary
                ? rosterPlayer.player.secondary.indexOf(selectedSecondary)
                : 0}
            selected={(cat) => (selectedSecondary = cat)}
        />

        <p class="category-label">
            {categoryToName.get(selectedSecondary)}
        </p>
        {#each secondarySkills.filter((s) => s.category === selectedSecondary) as s}
            <button on:click={() => addSkill(s.id)}>{s.name}</button>
        {/each}
    {/if}
    {#if !allowPrimary && !allowSecondary}
        <p>No skills left to allocate.</p>
    {/if}
</div>

<style lang="scss">
    .container {
        padding: 8px;
        text-align: left;
        position: sticky;
        left: 0;
        top: 0;
        min-width: 50vw;
    }
    .category-label {
        font-family: var(--display-font);
        color: var(--secondary-colour);
        margin-left: 8px;
    }

    button {
        border-radius: 8px;
        background-color: white;
        color: var(--secondary-colour);
        padding: 10px;
        margin: 2px;
        border: 2px solid var(--secondary-colour);

        &:hover {
            background-color: var(--secondary-colour);
            color: white;
            border-color: var(--secondary-colour);

            &:disabled {
                background-color: white;
                color: grey;
                border: none;
            }
        }
    }
    .delete-skill {
        color: var(--main-colour);
        border-color: var(--main-colour);
        &:hover {
            background-color: var(--main-colour);
            border-color: var(--main-colour);
        }
    }
</style>
