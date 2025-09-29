<script setup lang="ts">
import { potionEffects } from '../lib/potionmechanics';
import { elementInfo } from '../lib/elements';

defineProps<{
    shown: boolean
}>()

defineEmits<{
    close: []
}>()

const sets = [1, 2, 3, 4, 5].map((n) => potionEffects.filter((e) => e.requirements.dominantElements.length === n))

</script>

<template>
    <div class="modal-bg" v-if="shown" @click="$emit('close')">
        <div class="modal-panel">
            <div class="title">(click anywhere to close)</div>
            <div class="effect-list" v-for="set in sets">
                <div class="panel" v-for="effect in set">
                    <div class="left">
                        <img class="effect-thumb" :src="effect.img" />
                    </div>
                    <div class="right">
                        <div class="header">
                            <span class="effect-name">{{ effect.displayName }}</span>
                            <div class="dominant-els">
                                <div v-for="el in effect.requirements.dominantElements" :key="el" class="dominant-els">
                                    <img :src="elementInfo[el].image" :alt="elementInfo[el].displayName" />
                                </div>
                            </div>
                        </div>
                        <div class="lore">
                            {{ effect.lore }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-bg {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 400;

    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-panel {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    padding: 16px;

    background-color: #202020;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    overflow-y: auto;
}

.title {
    font-size: 12px;
    text-align: center;
    opacity: 0.5;
    padding-top: 32px;
    padding-bottom: 28px;
}

.effect-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    max-width: 1200px;
    gap: 16px;
    margin: 0 auto;
}

/*  */

.panel {
    width: 240px;
    display: flex;
    gap: 8px;
    user-select: none;
}

.left {
    display: flex;
    flex-flow: column;
    justify-content: start;
}

.effect-thumb {
    height: 48px;
    margin-bottom: auto;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px;
}

.effect-name {
    font-size: 16px;
}

.dominant-els {
    margin-top: 2px;
    display: inline-flex;
    flex-flow: row-reverse;
}

.dominant-els>img {
    height: 24px;
    margin: 0px -5px;
}

.lore {
    margin-top: -4px;
    font-style: italic;
    opacity: 0.7;
    font-size: 12px;
}
</style>