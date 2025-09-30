<script setup lang="ts">
import { ingredients, type Ingredient } from '../lib/ingredients';

defineProps<{
  hoveredIngredient: Ingredient | null
}>()

defineEmits<{
  ingredientHover: [ingredient: Ingredient | null]
  ingredientClick: [ingredient: Ingredient]
}>()

function color(tier: number) {
  if (tier == 1) {
    return "rgba(255, 255, 255, 0.08)"
  } if (tier == 2) {
    return "rgba(0, 255, 0, 0.12)"
  } if (tier == 3) {
    return "rgba(0, 255, 255, 0.12)"
  } if (tier == 4) {
    return "rgba(255, 60, 255, 0.12)"
  } if (tier == 5) {
    return "rgba(255, 255, 0, 0.12)"
  }
}

const sets = [
  ingredients.slice(0, 15),
  ingredients.slice(15, 25),
  ingredients.slice(25)
]

</script>

<template>
  <div class="ingredients-section">
    <div class="ingredients-list" v-for="(set, i) in sets" :key="i">
      <div v-for="ing in set" :key="ing.id" class="ingredient-item" @mouseenter="$emit('ingredientHover', ing)"
        :style="{ backgroundColor: color(ing.rarity) }" @mouseleave="$emit('ingredientHover', null)"
        @click="$emit('ingredientClick', ing)">
        <img :src="ing.src" :alt="ing.name" />
      </div>
    </div>
    <div class="ingredient-preview" v-if="hoveredIngredient">
      <img :src="hoveredIngredient.src" :alt="hoveredIngredient.name" class="preview-image" />
      <div>
        <div>{{ hoveredIngredient.name }}</div>
        <p>{{ hoveredIngredient.description }}</p>
        <p> <em>{{ hoveredIngredient.context }}</em></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ingredients-section {
  flex: 1;
  width: 292px;
}

.ingredients-list {
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  gap: 8px;

  margin-bottom: 18px;
}

.ingredient-item {
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.08);
  border: 2px solid transparent;
}

.ingredient-item:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ingredient-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
}

.ingredient-preview {
  margin-top: 16px;
  min-width: 0;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  display: flex;
  gap: 10px;
  box-sizing: border-box;
}

.preview-image {
  width: 42px;
  height: 42px;
  user-select: none;
}

.ingredient-preview>div {
  flex-shrink: 1;
  flex-grow: 1;
  min-width: 0;
}

.ingredient-preview>div>p {
  margin: 0 0 0 0;
  opacity: 0.8;
  font-size: 12px;
  min-width: 0;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  padding-right: 4px;
}

em {
  opacity: 0.5;
}
</style>