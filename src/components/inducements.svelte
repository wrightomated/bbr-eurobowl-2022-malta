<script lang="ts">
    import { inducementData } from '../data/inducements.data';
    import type { Team } from '../models/team.model';
    import { roster } from '../store/teamRoster.store';
    import MaterialButton from './uiComponents/materialButton.svelte';
    import type { Inducement } from '../models/inducement.model';
    import { filterInducement } from '../helpers/inducementFilter';
    import { showAllInducements } from '../store/showAllInducements.store';
    import type { DungeonBowlTeam } from '../models/dungeonBowl.model';

    export let selectedTeam: Team | DungeonBowlTeam;

    $: searchTerm = '';

    // TODO: refactor this, this is too long
    $: filteredInducements =
        $roster.format === 'dungeon bowl'
            ? inducementData.inducements
                  .filter((inducement) => inducement?.dungeonBowlMax > 0)
                  .map((i) => ({ ...i, max: i.dungeonBowlMax }))
            : inducementData.inducements
                  .filter(
                      (inducement) =>
                          ($roster.format === 'elevens' &&
                              inducement.max > 0) ||
                          ($roster.format === 'sevens' &&
                              inducement.sevensMax !== 0)
                  )
                  .filter((inducement) =>
                      filterInducement(inducement, selectedTeam as Team)
                  )
                  .map((inducement: Inducement) => ({
                      ...inducement,
                      cost: (selectedTeam as Team).specialRules.includes(
                          inducement?.reducedCost?.specialRule
                      )
                          ? inducement.reducedCost.cost
                          : $roster.format === 'sevens' && inducement.sevensCost
                          ? inducement.sevensCost
                          : inducement.cost,
                      max:
                          $roster.format === 'elevens' || !inducement.sevensMax
                              ? inducement.max
                              : inducement.sevensMax,
                  }))
                  .filter((i) =>
                      searchTerm
                          ? i.displayName
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          : i
                  )
                  .sort((a, b) => a.displayName.localeCompare(b.displayName));

    const addInducement = (key: string) => {
        roster.addInducement(key);
    };

    const removeInducement = (key: string) => {
        roster.removeInducement(key);
    };

    const toggleShowAllInducements = () => {
        showAllInducements.set(!$showAllInducements);
    };
    const removeAllInducements = () => {
        roster.removeAllInducements();
    };
</script>

<table
    class="inducement-table"
    class:no-print={$roster.inducements?.length < 1}
>
    <thead>
        <tr>
            <td on:click={toggleShowAllInducements}>Inducement</td>
            <td class="inducement__qty" on:click={toggleShowAllInducements}>
                QTY
            </td>
            <td on:click={toggleShowAllInducements}>Cost</td>
            <td class="inducement__toggle" />
        </tr>
    </thead>
    <tbody>
        {#if $roster.mode === 'league' && Object.values($roster.inducements).reduce((p, c) => p + c, 0) > 0}
            <tr class="no-print">
                <td colspan="3">Remove all inducements below (no refund)</td>
                <td>
                    <MaterialButton
                        hoverText="Remove all inducements"
                        symbol="delete_forever"
                        clickFunction={() => removeAllInducements()}
                    /></td
                >
            </tr>
        {/if}
        {#each filteredInducements as ind}
            {#if $roster.inducements?.[ind.id] > 0 || $showAllInducements}
                <tr>
                    <td class="inducement__display-name">{ind.displayName}</td>
                    <td>{$roster.inducements?.[ind.id] || 0} / {ind.max}</td>
                    <td>
                        {ind.cost}{#if typeof ind.cost === 'number'},000{/if}
                    </td>
                    <td class="inducement__control">
                        <div class="flex-container">
                            {#if ($roster.inducements?.[ind.id] || 0) < ind.max}
                                <MaterialButton
                                    hoverText="Add inducement"
                                    symbol="add_circle"
                                    clickFunction={() => addInducement(ind.id)}
                                />
                            {/if}
                            {#if $roster.inducements?.[ind.id] > 0}
                                <MaterialButton
                                    hoverText="Remove inducement"
                                    symbol="remove_circle"
                                    clickFunction={() =>
                                        removeInducement(ind.id)}
                                />
                            {/if}
                        </div>
                    </td>
                </tr>
            {/if}
        {/each}
    </tbody>
</table>

<style lang="scss">
    .inducement {
        &__display-name {
            text-align: left;
        }

        &__search {
            text-align: left;
        }

        &__qty {
            min-width: 44px;
        }
    }
    .flex-container {
        display: flex;
    }

    @media screen and (max-width: 783px) {
        table {
            width: 100%;
        }
    }
    @media print {
        .inducement-table {
            flex-grow: 1;
        }
        .inducement {
            &__control,
            &__toggle {
                display: none;
            }
        }
    }
</style>
