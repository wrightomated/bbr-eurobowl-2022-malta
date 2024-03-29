<script lang="ts">
    import { currentTeam } from '../../store/currentTeam.store';
    import { modalState } from '../../store/modal.store';
    import { showSkillButtons } from '../../store/showSkillButtons.store';

    import { roster } from '../../store/teamRoster.store';
    import EuroBowlAddSkill from '../euroBowl/euroBowlAddSkill.svelte';
    import MaterialButton from '../uiComponents/materialButton.svelte';

    export let index: number;
    $: rosterPlayer = $roster.players[index];

    $: numberOfPlayerType = $roster.players.filter(
        (x) => x.player.id === rosterPlayer.player.id
    ).length;
    $: maxOfPlayerType =
        $currentTeam.players.find((x) => x.id === rosterPlayer.player.id)
            ?.max || 0;
    $: danger = numberOfPlayerType > maxOfPlayerType;
    $: tooManyBigGuys =
        rosterPlayer.player.bigGuy &&
        $currentTeam.maxBigGuys <
            $roster.players.filter((x) => x.player.bigGuy).length;
    $: nonLinemen = $currentTeam.players
        .filter((p) => p.max < 12)
        .map((x) => x.id);
    $: sevensSpecialistsAmount =
        $roster.format === 'sevens' &&
        nonLinemen.includes(rosterPlayer.player.id) &&
        $roster.players.filter((p) => nonLinemen.includes(p.player.id)).length;

    const buyJourneyman = () => {
        const extraSkills = rosterPlayer.alterations.extraSkills.filter(
            (id) => id !== 71 && id !== 710
        );
        roster.updatePlayer(
            {
                ...rosterPlayer,
                alterations: {
                    ...rosterPlayer.alterations,
                    extraSkills,
                    journeyman: false,
                },
            },
            index
        );
        roster.updateTreasury(-rosterPlayer.player.cost);
    };

    function toggleShowSkills() {
        modalState.set({
            ...$modalState,
            isOpen: true,
            component: EuroBowlAddSkill,
            componentProps: { index },
        });
    }
</script>

{#if rosterPlayer.starPlayer}
    Star Player
{:else if rosterPlayer?.alterations?.journeyman}
    Journeyman
    <span class="add-skill">
        <MaterialButton
            hoverText="Purchase journeyman"
            symbol="paid"
            clickFunction={buyJourneyman}
        />
    </span>
{:else}
    {rosterPlayer.player.position}
    {#if danger}
        <span class="danger">
            <i class="material-icons">warning</i>
            {numberOfPlayerType}/{maxOfPlayerType}
        </span>
    {/if}
    <span class="add-skill">
        <MaterialButton
            hoverText="Player advancement"
            symbol="elevator"
            clickFunction={toggleShowSkills}
            cyData={`player-${index}-advancement`}
        />
    </span>
{/if}
{#if tooManyBigGuys}
    <br />
    <span class="danger">
        {$roster.players.filter((x) => x.player.bigGuy)
            .length}/{$currentTeam.maxBigGuys} Big Guys
    </span>
{/if}
{#if sevensSpecialistsAmount > 4}
    <br />
    <span class="danger">{sevensSpecialistsAmount}/4 Specialists</span>
{/if}

<style lang="scss">
    td {
        input {
            margin-bottom: 0;
        }
    }
    .add-skill {
        vertical-align: middle;
        display: inline-block;
        margin-top: -1px;
    }
    .danger {
        color: var(--main-colour);
        i {
            vertical-align: text-bottom;
        }
    }
</style>
