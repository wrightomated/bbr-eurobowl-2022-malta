<script lang="ts">
    import { skillCatalogue } from '../data/skills.data';

    export let playerSkillIds: number[];
    export let extraSkillIds: number[] = [];
    export let cyData: string = undefined;

    const getSkill = (id: number) => {
        return skillCatalogue.find((s) => s.id === id).name;
    };
</script>

<span class="skills" data-cy={cyData}>
    {#each playerSkillIds as skillId}<span>{getSkill(skillId)}</span>{/each}
    {#each extraSkillIds as skillId}<span class="extra"
            >{getSkill(skillId)}</span
        >{/each}
</span>

<style lang="scss">
    .skills {
        span {
            &:nth-child(even) {
                color: var(--main-colour);
            }
            &::after {
                content: ', ';
                color: black;
            }
            &:last-child::after {
                content: '';
            }
            &.extra {
                color: green;
                @media print {
                    font-weight: bold;
                }
            }
            @media print {
                color: black !important;
            }
        }
    }
</style>
