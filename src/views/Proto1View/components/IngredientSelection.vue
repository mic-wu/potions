<script setup lang="ts">
import { ingredients, type Ingredient } from '../lib/ingredients';

defineProps<{
  hoveredIngredient: Ingredient | null
}>()

defineEmits<{
  ingredientHover: [ingredient: Ingredient | null]
  ingredientClick: [ingredient: Ingredient]
}>()
</script>

<template>
  <div class="ingredients-section">
    <div class="ingredients-list">
      <div v-for="ing in ingredients" :key="ing.id" class="ingredient-item" @mouseenter="$emit('ingredientHover', ing)"
        @mouseleave="$emit('ingredientHover', null)" @click="$emit('ingredientClick', ing)">
        <img :src="ing.src" :alt="ing.name" />
      </div>
    </div>
    <div class="ingredient-preview" v-if="hoveredIngredient">
      <img :src="hoveredIngredient.src" :alt="hoveredIngredient.name" class="preview-image" />
      <div>
        <div>{{ hoveredIngredient.name }}</div>
        <p>{{ hoveredIngredient.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ingredients-section {
  flex: 1;
  width: 352px;
}

.ingredients-list {
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  gap: 8px;
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
  background-color: rgba(255, 255, 255, 0.12);
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
  width: 68px;
  height: 68px;
  user-select: none;
}

.ingredient-preview>div {
  flex-shrink: 1;
  flex-grow: 1;
  min-width: 0;
}

.ingredient-preview>div>p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  min-width: 0;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
</style>