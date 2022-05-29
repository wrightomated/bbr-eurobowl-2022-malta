<script lang="ts">
    import { ebAvailableSkills } from '../../store/ebAvailableSkills.store';
    const summaryItems = ['primary', 'secondary', 'star'];
    const itemTitleMap = {
        primary: 'Primary Skills',
        secondary: 'Secondary Skills',
        star: 'Star Players',
    };
</script>

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
</div>

<style>
    .danger {
        color: var(--main-colour);
    }
    .summary {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        column-gap: 20px;
        font-family: var(--display-font);
    }
</style>
