<script setup lang="ts">
import type { Ingredient } from '../lib/ingredients';

defineProps<{
  usedIngredients: Ingredient[]
}>()

defineEmits<{
  ingredientHover: [ingredient: Ingredient | null]
}>()
</script>

<template>
  <div class="used-ingredients-list">
    <div v-for="ing in usedIngredients" :key="ing.id" class="used-ingredient-item"
      @mouseenter="$emit('ingredientHover', ing)" @mouseleave="$emit('ingredientHover', null)">
      <img :src="ing.src" :alt="ing.name" />
    </div>
  </div>
</template>

<style scoped>
.used-ingredients-list {
  margin-top: 16px;
  display: flex;
  flex-flow: row wrap;
  min-height: 40px;
}

.used-ingredient-item {
  width: 40px;
  height: 40px;
  margin-right: -16px;
  user-select: none;
  animation: fadeInAnimation ease 0.5s;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>