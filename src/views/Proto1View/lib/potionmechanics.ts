import { elementInfo, type Element } from './elements'
import type { Ingredient, IngredientStats } from './ingredients'

export type PotionStats = Record<Element, number>
export type PotionTiers = Record<Element, number>

export type PotionEffect = {
  id: string
  displayName: string
  potionName: string
  img: string
  lore: string
  description: string
  requirements: {
    dominantElements: Element[]
    thresholds: { el: Element; val: number }[]
  }
  calculation: (potTiers: PotionStats, ings: Ingredient[]) => string
}

export function withStatsApplied(potStats: PotionStats, ingStats: IngredientStats): PotionStats {
  return {
    fire: potStats.fire * ingStats.fire[1] + ingStats.fire[0],
    water: potStats.water * ingStats.water[1] + ingStats.water[0],
    ground: potStats.ground * ingStats.ground[1] + ingStats.ground[0],
    ice: potStats.ice * ingStats.ice[1] + ingStats.ice[0],
    electric: potStats.electric * ingStats.electric[1] + ingStats.electric[0],
  }
}

export function withTiers(potStats: PotionStats): PotionTiers {
  function tier(val: number) {
    return Math.max(0, Math.min(5, Math.floor(val / 20)))
  }

  return {
    fire: tier(potStats.fire),
    water: tier(potStats.water),
    ground: tier(potStats.ground),
    ice: tier(potStats.ice),
    electric: tier(potStats.electric),
  }
}

export function dominantElements(potStats: PotionStats): Element[] {
  const tiers = withTiers(potStats)
  const maxTier = Math.max(...Object.values(tiers))
  if (maxTier === 0) return []
  return Object.entries(tiers)
    .filter((entry) => entry[1] == maxTier)
    .map((entry) => entry[0]) as Element[]
}

export function matchEffect(potStats: PotionStats): PotionEffect | undefined {
  const dominantEls = dominantElements(potStats)
  const ans = potionEffects.find(
    (v) =>
      v.requirements.dominantElements.length === dominantEls.length &&
      dominantEls.every((el) => v.requirements.dominantElements.includes(el)),
  )
  return ans
}

// steps - work backwards:
// 1. come up with effect ideas
//    - an effect for all 5 basic types
//    - 10-15 other effects?
// 2. assign them to element combos. determine mechanics
// 3. decide on ingredient stats
//    - some ingrediensts can be really convenient for some effects
//    - "roles" for ingredientss (ex. minor fire boost up to 40)

export const potionEffects: PotionEffect[] = [
  {
    id: 'incendiary',
    displayName: 'Incendiary',
    potionName: 'Incendiary Potion',
    img: '/poke-potions/item_0020.png',
    lore: 'instant damage',
    description:
      'Apply to enemies to deal immediate damage.\n\nElemental damage scales with the <b>strongest non-dominant element.</b>',
    requirements: {
      dominantElements: ['fire'],
      thresholds: [],
    },
    calculation: (potStats) => {
      const tiers = withTiers(potStats)
      const otherElements = ['water', 'ground', 'ice', 'electric'] as Element[]
      const otherElementTiers = otherElements.map((el) => tiers[el])
      const allOtherTiersZero = otherElementTiers.every((tier) => tier === 0)

      let damage: number

      if (allOtherTiersZero) {
        damage = Math.round(potStats.fire * 0.8)
        return `Deal ${damage} Fire DMG`
      } else {
        const highestOtherValue = Math.max(...otherElements.map((el) => potStats[el]))
        const highestEl: Element =
          otherElements.find((el) => potStats[el] == highestOtherValue) ?? 'fire'
        damage = Math.round(highestOtherValue * 1.0)
        return `Deal ${damage} ${elementInfo[highestEl].displayName} DMG`
      }
    },
  },
  {
    id: 'restorative',
    displayName: 'Restorative',
    potionName: 'Restorative Potion',
    img: '/poke-potions/item_0024.png',
    lore: 'HP restoration',
    description: 'Restore health instantly. Healing scales with the sum of all element tiers.\n\n',
    requirements: {
      dominantElements: ['water'],
      thresholds: [],
    },
    calculation: (potStats) => {
      const tiers = withTiers(potStats)
      const totalTiers = tiers.water + tiers.fire + tiers.ground + tiers.ice + tiers.electric
      const healing = Math.round(totalTiers * 25)
      return `Restore ${healing} HP`
    },
  },
  {
    id: 'hardening',
    displayName: 'Hardening',
    potionName: 'Potion of Hardening',
    img: '/poke-potions/item_0040.png',
    lore: 'DEF increase',
    description: '',
    requirements: {
      dominantElements: ['ground'],
      thresholds: [],
    },
    calculation: () => '',
  },
  {
    id: 'slowing',
    displayName: 'Slowing',
    potionName: 'Potion of Slowness',
    img: '/poke-potions/item_0041.png',
    lore: 'SPD reduction',
    description: '',
    requirements: {
      dominantElements: ['ice'],
      thresholds: [],
    },
    calculation: () => '',
  },
  {
    id: 'dexterity',
    displayName: 'Dexterity',
    potionName: 'Potion of Dexterity',
    img: '/poke-potions/item_0018.png',
    lore: 'DEX increase',
    description: '',
    requirements: {
      dominantElements: ['electric'],
      thresholds: [],
    },
    calculation: () => '',
  },

  //

  {
    id: 'poison',
    displayName: 'Poison',
    potionName: 'Poisonous Potion',
    img: '/poke-potions/item_0052.png',
    lore: 'DoT',
    description: '',
    requirements: {
      dominantElements: ['fire', 'water'],
      thresholds: [{ el: 'fire', val: 1 }],
    },
    calculation: () => '',
  },
  {
    id: 'magma',
    displayName: 'Magma',
    potionName: 'Magma Potion',
    img: '/poke-potions/item_0049.png',
    lore: 'AoE DoT',
    description: '',
    requirements: {
      dominantElements: ['fire', 'ground'],
      thresholds: [{ el: 'fire', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'weakness',
    displayName: 'Weakness',
    potionName: 'Potion of Weakness',
    img: '/poke-potions/item_0025.png',
    lore: 'ATK decrease',
    description: '',
    requirements: {
      dominantElements: ['fire', 'ice'],
      thresholds: [{ el: 'fire', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'strength',
    displayName: 'Strength',
    potionName: 'Potion of Strength',
    img: '/poke-potions/item_0040.png',
    lore: 'ATK increase',
    description: '',
    requirements: {
      dominantElements: ['fire', 'electric'],
      thresholds: [],
    },
    calculation: () => '',
  },
  {
    id: 'regeneration',
    displayName: 'Regeneration',
    potionName: 'Potion of Regeneration',
    img: '/poke-potions/item_0048.png',
    lore: 'HP restoration over time',
    description: '',
    requirements: {
      dominantElements: ['water', 'ground'],
      thresholds: [{ el: 'water', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'freezing',
    displayName: 'Freezing',
    potionName: 'Potion of Frost',
    img: '/poke-potions/item_0021.png',
    lore: 'freeze',
    description: '',
    requirements: {
      dominantElements: ['water', 'ice'],
      thresholds: [{ el: 'water', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'shock',
    displayName: 'Shocking',
    potionName: 'Shocking Potion',
    img: '/poke-potions/item_0018.png',
    lore: 'chaining damage',
    description: '',
    requirements: {
      dominantElements: ['water', 'electric'],
      thresholds: [{ el: 'water', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'erosion',
    displayName: 'Erosion',
    potionName: 'Potion of Erosion',
    img: '/poke-potions/item_0048.png',
    lore: 'DEF decrease',
    description: '',
    requirements: {
      dominantElements: ['ground', 'ice'],
      thresholds: [{ el: 'ground', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'deflection',
    displayName: 'Deflection',
    potionName: 'Potion of Deflection',
    img: '/poke-potions/item_0047.png',
    lore: 'damage deflection',
    description: '',
    requirements: {
      dominantElements: ['ground', 'electric'],
      thresholds: [{ el: 'ground', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'speed',
    displayName: 'Speed',
    potionName: 'Potion of Swiftness',
    img: '/poke-potions/item_0041.png',
    lore: 'SPD increase',
    description: '',
    requirements: {
      dominantElements: ['ice', 'electric'],
      thresholds: [{ el: 'ice', val: 2 }],
    },
    calculation: () => '',
  },
  {
    id: 'acid',
    displayName: 'Acid',
    potionName: 'Acid Potion',
    img: '/poke-potions/item_0053.png',
    lore: 'DEF decrease + DoT',
    description: '',
    requirements: {
      dominantElements: ['fire', 'water', 'ground'],
      thresholds: [{ el: 'fire', val: 3 }],
    },
    calculation: () => '',
  },
  {
    id: 'crit',
    displayName: 'Volatility',
    potionName: 'Volatile Potion',
    img: '/poke-potions/item_0026.png',
    lore: 'CRIT RATE increase',
    description: '',
    requirements: {
      dominantElements: ['fire', 'ground', 'electric'],
      thresholds: [{ el: 'fire', val: 3 }],
    },
    calculation: () => '',
  },
  {
    id: 'confusion',
    displayName: 'Confusion',
    potionName: 'Potion of Confusion',
    img: '/poke-potions/item_0039.png',
    lore: 'confusion',
    description: '',
    requirements: {
      dominantElements: ['fire', 'ice', 'electric'],
      thresholds: [{ el: 'fire', val: 3 }],
    },
    calculation: () => '',
  },

  {
    id: 'luck',
    displayName: 'Luck',
    potionName: 'Potion of Luck',
    img: '/poke-potions/item_0038.png',
    lore: 'loot drop increase',
    description: '',
    requirements: {
      dominantElements: ['fire', 'ground', 'ice', 'water'],
      thresholds: [{ el: 'fire', val: 3 }],
    },
    calculation: () => '',
  },
]

//

export const newPotionEffect: PotionEffect = {
  id: 'new',
  displayName: 'New Potion',
  potionName: 'New Potion',
  img: '/poke-potions/item_0393.png',
  lore: '. . .',
  description:
    'Click on ingredients on the right to add them to the potion.' +
    ' \n\n <em>The white dots on the stat bars below are tier thresholds. <b>the' +
    ' elements with the highest tier</b> determine the potion effect.</em>',
  requirements: {
    dominantElements: [],
    thresholds: [],
  },
  calculation: () => '',
}

export const unknownPotionEffect: PotionEffect = {
  id: 'unknown',
  displayName: '. . .',
  potionName: '. . .',
  img: '/poke-potions/item_0393.png',
  lore: '. . .',
  description: 'No known effect',
  requirements: {
    dominantElements: [],
    thresholds: [],
  },
  calculation: () => '',
}

//

// helpers
