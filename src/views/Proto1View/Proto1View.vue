<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Ingredient } from './lib/ingredients';
import StatBar from './components/StatBar.vue';
import UsedIngredientsList from './components/UsedIngredientsList.vue';
import IngredientSelection from './components/IngredientSelection.vue';
import { elementInfo, type Element } from './lib/elements';
import { dominantElements, matchEffect, newPotionEffect, unknownPotionEffect, withStatsApplied, withTiers } from './lib/potionmechanics';
import PotionDisplay from './components/PotionDisplay.vue';
import BookModal from './components/BookModal.vue';

type PotionStats = Record<Element, number>;

const potionStats = ref<PotionStats>({
    fire: 0,
    water: 0,
    ground: 0,
    electric: 0,
    ice: 0
});
const usedIngredients = ref<Ingredient[]>([]); // should not be storing all the data LOL

const hoveredIngredient = ref<Ingredient | null>(null);

const previewStats = computed(() => {
    if (!hoveredIngredient.value) return potionStats.value;
    return withStatsApplied(potionStats.value, hoveredIngredient.value.stats)
});

const tiers = computed(() => withTiers(potionStats.value))
const dominantEls = computed(() => dominantElements(potionStats.value))
const dominantTier = computed(() => Math.max(...Object.values(tiers.value)))
const matchedEffect = computed(() => {
    const eff = matchEffect(potionStats.value)
    if (eff) return eff;
    return usedIngredients.value.length === 0 ? newPotionEffect : unknownPotionEffect;
})

// 

function addIngredient(ingredient: Ingredient) {
    potionStats.value = withStatsApplied(potionStats.value, ingredient.stats)
    usedIngredients.value.push(ingredient)
}

function resetIngredients() {
    potionStats.value = { fire: 0, water: 0, ground: 0, electric: 0, ice: 0 }
    usedIngredients.value = []
}

// 

const modalShown = ref<boolean>(false);
function showModal() {
    modalShown.value = true
}
function hideModal() {
    modalShown.value = false
}

</script>

<template>
    <div class="center">
        <div class="brewing-container">
            <div class="potion-stats">
                <div class="potion-display" style="height: 200px">
                    <PotionDisplay :effect="matchedEffect" :potion-data="{
                        potionStats: potionStats, ingredients: usedIngredients
                    }" />
                </div>
                <div class="stat-list">
                    <div class="stat-entry" :class="{ dominant: dominantEls.includes(elname) }"
                        v-for="(elinfo, elname) in elementInfo" :key="elname">
                        <div class="img-container">
                            <img class="el-icon" :src="elinfo.image" />
                        </div>
                        <stat-bar :color="elinfo.color" :range="[0, 100]" :value="potionStats[elname]"
                            :preview-value="previewStats[elname]" :dominant-tier="dominantTier" />
                    </div>
                </div>
                <UsedIngredientsList :used-ingredients="usedIngredients"
                    @ingredient-hover="hoveredIngredient = $event" />
                <div class="buttons">
                    <button class="button" @click="resetIngredients">Clear Ingredients</button>
                    <button class="button book-button" @click="showModal">Open Recipe Book</button>
                </div>
            </div>

            <IngredientSelection :hovered-ingredient="hoveredIngredient" @ingredient-hover="hoveredIngredient = $event"
                @ingredient-click="addIngredient" />
        </div>
    </div>
    <BookModal @close="hideModal" :shown="modalShown" />
</template>

<style>
.center {
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 10rem;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.brewing-container {
    display: flex;
    gap: 64px;
    padding: 20px;
    box-sizing: border-box;
}

.potion-stats {
    flex: 1;
    max-width: 400px;
}

.stat-list {
    margin-left: -8px;
    user-select: none;
}

.stat-entry {
    display: flex;
    align-items: center;
    margin-bottom: -8px;
    overflow: hidden;
}

.stat-entry>.img-container {
    z-index: 12;
    margin-right: -16px;
    border: 8px solid #242424;
    border-radius: 100%;
    box-sizing: border-box;
    padding: 0;
    width: 45px;
    height: 46px;
}

.stat-entry>img {
    line-height: 1;
}

.el-icon {
    height: 30px;
}


.buttons {
    display: flex;
    margin-top: 16px;
    justify-content: stretch;
    gap: 8px;
}

.button {
    height: 52px;
    flex-grow: 1;
    padding: auto 4rem;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    background-color: rgba(255, 255, 255, 0.08);
    border: 2px solid transparent;
    color: white;
    font-size: 16px;
    font-family: inherit;
}

.button:hover {
    background-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>