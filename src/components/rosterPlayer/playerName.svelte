<script lang="ts">
    import { blurOnEscapeOrEnter } from '../../helpers/blurOnEscapeOrEnter';
    import { roster } from '../../store/teamRoster.store';

    export let index: number;
    $: rosterPlayer = $roster.players[index];
</script>

{#if rosterPlayer.starPlayer}
    <span data-cy={`player-${index}-name`}>{rosterPlayer.player.position}</span>
{:else}
    <input
        data-cy={`player-${index}-name`}
        aria-labelledby="name-header"
        placeholder="Player Name"
        bind:value={$roster.players[index].playerName}
        use:blurOnEscapeOrEnter
    />
{/if}

<style lang="scss">
    input {
        border: 0;
        border-radius: 0;
        background: none;
        width: 100%;

        @media screen and (max-width: 450px) {
            font-size: 16px;
        }
    }
    td {
        input {
            margin-bottom: 0;
        }
    }
</style>
