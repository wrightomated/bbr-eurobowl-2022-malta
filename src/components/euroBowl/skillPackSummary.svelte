<script lang="ts">
    import { ebAvailableSkills } from '../../store/ebAvailableSkills.store';
    import { roster } from '../../store/teamRoster.store';
    import BribeSneakyGit from './bribeSneakyGit.svelte';

    $: playerCount = $roster.players.filter(
        (x) => !x.starPlayer && !x.deleted
    ).length;

    const summaryItems = ['primary', 'secondary', 'star'];
    const itemTitleMap = {
        primary: 'Primary Skills',
        secondary: 'Secondary Skills',
        star: 'Star Players',
    };
</script>

<BribeSneakyGit />
<div class="summary">
    <p>Skill Pack {$ebAvailableSkills.label}</p>
    {#each summaryItems as summaryItem}
        <p
            class:danger={$ebAvailableSkills[summaryItem].used >
                $ebAvailableSkills[summaryItem].max}
        >
            {itemTitleMap[summaryItem]}: {$ebAvailableSkills[summaryItem].used} /
            {$ebAvailableSkills[summaryItem].max}
        </p>
    {/each}
    <p class:danger={playerCount < 11}>
        Min players: {playerCount} / 11
    </p>
</div>

<style lang="scss">
    .danger {
        color: var(--main-colour);
    }
    .summary {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        font-family: var(--display-font);
        p {
            margin-right: 20px;
        }
    }
</style>
