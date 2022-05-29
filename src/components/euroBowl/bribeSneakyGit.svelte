<script lang="ts">
    import { roster } from '../../store/teamRoster.store';

    $: validationError =
        $roster.players.filter(
            (p) =>
                p.player.skills?.includes(10) ||
                p.alterations?.extraSkills?.includes(10)
        ).length > 0 &&
        'i7' in $roster.inducements &&
        $roster.inducements['i7'] > 0;
</script>

{#if validationError}
    <p>
        Can not induce Bribe if a player in the team has the Sneaky Git skill.
    </p>
{/if}

<style>
    p {
        color: var(--main-colour);
        font-family: var(--display-font);
    }
</style>
