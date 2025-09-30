<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    color: string,
    range: [number, number],
    value: number,
    previewValue?: number,
    dominantTier?: number
}>()

const shownPreviewVal = ref<number | null>(null);
const shownPreviewTimeout = ref<number | null>(null);
watch(() => props.value, (v) => {
    shownPreviewVal.value = v;
    if (shownPreviewTimeout.value) {
        clearTimeout(shownPreviewTimeout.value);
    }
    shownPreviewTimeout.value = setTimeout(() => {
        shownPreviewVal.value = null;
    }, 200)
})

function normalize(val: number) {
    const [min, max] = props.range;
    let normalizedVal = ((val - min) / (max - min)) * 100;
    normalizedVal = Math.max(0, Math.min(100, normalizedVal));
    if (normalizedVal < 1) {
        return 0
    } else {
        return 7 + normalizedVal * 0.9
    }
}

const normalizedValue = computed(() => {
    return normalize(props.value);
});

const normalizedPreviewValue = computed(() => {
    if (props.previewValue === undefined) return null;
    const actualDisplayedPreviewVal = shownPreviewVal.value ?? props.previewValue;
    return normalize(actualDisplayedPreviewVal);
});

const barOpacity = computed(() => {
    const actualDisplayedPreviewVal = shownPreviewVal.value ?? props.previewValue;
    if (actualDisplayedPreviewVal && actualDisplayedPreviewVal < props.value) return 0.5
    return 1
})

const tickIntervals = [20, 40, 60, 80, 100]
const tickMarks = computed(() => {
    return tickIntervals.map(normalize)
})

</script>

<template>
    <div class="stat-bar">
        <div class="stat-value preview" :style="{ width: `${normalizedPreviewValue}%`, backgroundColor: color }"></div>
        <div class="stat-value" :style="{ width: `${normalizedValue}%`, backgroundColor: color, opacity: barOpacity }">
        </div>
        <div v-for="(value, i) in tickMarks" class="tick-mark"
            :class="{ reached: tickIntervals[i]! <= props.value, dominant: dominantTier === i + 1 }" :key="i"
            :style="{ left: `${value}%` }">
        </div>
    </div>
</template>

<style scoped>
.stat-bar {
    width: 400px;
    height: 20px;
    position: relative;
    overflow: hidden;
}

.tick-mark {
    position: absolute;
    top: 50%;
    translate: -50% -50%;
    width: 5px;
    height: 5px;
    border-radius: 10px;
    background-color: white;
    z-index: 20;

    opacity: 0.15;
    transition: background-color 0.2s ease, opacity 0.2s ease;
}

.tick-mark.dominant {
    /* background-color: red; */

    height: 8px;
    width: 8px;
}

.tick-mark.dominant.reached {
    opacity: 1;
    /* opacity: 1; */
}


.stat-value {
    position: absolute;
    left: 0;
    height: 100%;
    transition: width 0.2s ease, opacity 0.2s ease;
    border-radius: 20px;
}

.stat-value.preview {
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% {
        opacity: 0.8;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 0.8;
    }
}
</style>