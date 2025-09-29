import { elementInfo, type Element } from './elements'
import type { Ingredient, IngredientStats } from './ingredients'

export type PotionStats = Record<Element, number>
export type PotionTiers = Record<Element, number>

export type PotionEffect = {
  id: string
  displayName: string
  img: string
  lore: string
  description: string
  requirements: {
    dominantElements: Element[]
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
    return Math.max(0, Math.min(5, Math.floor((val + 1) / 20)))
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
    img: '/poke-potions/item_0020.png',
    lore: 'instant damage',
    description:
      'Apply to enemies to deal immediate damage.\n\nElemental damage scales with the <b>strongest non-dominant element.</b>',
    requirements: {
      dominantElements: ['fire'],
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
    img: '/poke-potions/item_0024.png',
    lore: 'HP restoration',
    description: 'Restore health instantly. Healing scales with the sum of all element tiers.\n\n',
    requirements: {
      dominantElements: ['water'],
    },
    calculation: (potStats) => {
      const tiers = withTiers(potStats)
      const totalTiers = tiers.water + tiers.fire + tiers.ground + tiers.ice + tiers.electric
      const healing = Math.round(totalTiers * 25)
      return `Restore ${healing} HP`
    },
  },
]

export const newPotionEffect: PotionEffect = {
  id: 'new',
  displayName: 'New Potion',
  img: '/poke-potions/item_0393.png',
  lore: '. . .',
  description:
    'Click on ingredients on the right to add them to the potion.' +
    ' \n\n <em>The white dots on the stat bars below are tier thresholds. <b>the' +
    ' elements with the highest tier</b> determine the potion effect.</em>',
  requirements: {
    dominantElements: [],
  },
  calculation: () => '',
}

export const unknownPotionEffect: PotionEffect = {
  id: 'unknown',
  displayName: '. . .',
  img: '/poke-potions/item_0393.png',
  lore: '. . .',
  description: 'No known effect',
  requirements: {
    dominantElements: [],
  },
  calculation: () => '',
}
