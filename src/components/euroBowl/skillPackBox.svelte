<script lang="ts">
    import { each } from 'svelte/internal';

    import {
        skillPackData,
        SkillPackLabel,
    } from '../../data/eurobowlSkillPack.data';
    import { currentTeam } from '../../store/currentTeam.store';
    import { selectedSkillPack } from '../../store/skillPack.store';

    import ToggleButton from '../uiComponents/toggleButton.svelte';

    $: selectedSkillPackData =
        skillPackData[$currentTeam.tier][$selectedSkillPack];
    const skillPackLabels: SkillPackLabel[] = ['A', 'B', 'C', 'D'];
</script>

<ToggleButton
    options={skillPackLabels}
    selectedIndex={skillPackLabels.indexOf($selectedSkillPack)}
    selected={(skillPackLabel) => {
        selectedSkillPack.set(skillPackLabel);
    }}
/>
<ul>
    {#if selectedSkillPackData?.primarySkills}
        <li>Primary Skills: {selectedSkillPackData.primarySkills}</li>
    {/if}
    {#if selectedSkillPackData?.secondarySkills}
        <li>Secondary Skills: {selectedSkillPackData.secondarySkills}</li>
    {/if}
    {#if selectedSkillPackData?.starPlayers}
        <li>Star Players: {selectedSkillPackData.starPlayers}</li>
    {/if}
</ul>

<style>
    ul {
        list-style-type: square;
    }
</style>
