import { writable } from 'svelte/store';
import type { SkillPackLabel } from '../data/eurobowlSkillPack.data';

export const selectedSkillPack = writable<SkillPackLabel>('A');
