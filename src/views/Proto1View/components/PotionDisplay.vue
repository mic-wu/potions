<script setup lang="ts">
import { withTiers, type PotionEffect, type PotionStats } from '../lib/potionmechanics';
import { elementInfo } from '../lib/elements';
import { type Ingredient } from '../lib/ingredients';
import { computed } from 'vue';

const props = defineProps<{
    effect: PotionEffect,
    potionData?: {
        potionStats: PotionStats
        ingredients: Ingredient[]
    }
}>()

const tier = computed(() => {
    if (!props.potionData) {
        return undefined
    }

    // const minTier = props.effect.requirements.thresholds.length === 0 ? 1 : props.effect.requirements.thresholds[0]!.val
    const tiers = withTiers(props.potionData.potionStats)
    const maxTier = Math.max(...Object.values(tiers), 0)
    return Math.max(maxTier, 0)
})

</script>

<template>
    <div>
        <div class="panel">
            <div class="left">
                <img class="effect-thumb" :src="effect.img" />
            </div>
            <div class="right">
                <div class="header">
                    <span class="effect-name">{{ effect.displayName }}</span>
                    <div class="dominant-els">
                        <div v-if="tier" class="tier-num">
                            T{{ tier }}
                        </div>
                        <div v-for="el in effect.requirements.dominantElements" :key="el" class="dominant-els">
                            <img :src="elementInfo[el].image" :alt="elementInfo[el].displayName" />
                        </div>

                    </div>
                </div>
                <div class="lore">
                    {{ effect.lore }}
                </div>
                <div class="desc" v-html="effect.description">
                </div>
                <div class="desc outcome" v-if="potionData">
                    {{ effect.calculation(potionData.potionStats, potionData.ingredients) }}
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.panel {
    display: flex;
    gap: 16px;
    user-select: none;
}

.left {
    display: flex;
    flex-flow: column;
    justify-content: start;
}

.effect-thumb {
    height: 100px;
    margin-bottom: auto;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px;
}

.effect-name {
    font-size: 32px;
    font-weight: bold;
}

.dominant-els {
    margin-top: 2px;
    display: inline-flex;
    flex-flow: row-reverse;
}

.tier-num {
    margin-left: 12px;
    font-weight: bold;
    margin-top: 2px;
}

.dominant-els>img {
    height: 24px;
    margin: 0px -5px;
    /* filter: saturate(0) */
}

.lore {
    margin-top: -4px;
    font-style: italic;
    opacity: 0.7;
}

.desc {
    text-wrap: balance;
    margin-top: 12px;
    font-size: 12px;
}

.desc em {
    opacity: 0.3;
}

.desc b {
    opacity: 1;
}

.outcome {
    color: lime;
}
</style>