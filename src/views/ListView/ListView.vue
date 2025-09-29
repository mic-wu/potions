<script setup lang="ts">
const protoList = [
    {
        name: "proto1",
        description: "add ingredients to tune five element stats (fire, water, earth, air, lightning). dominant stat decides primary effect. skibidi toilet"
    },
    {
        name: "proto2",
        description: "first iteration"
    },
    {
        name: "proto3",
        description: "first iteration"
    },
]
</script>

<template>
    <div class="center">
        <div class="protolist">
            <template v-for="entry in protoList" :key="entry.name">
                <RouterLink class="itemname" :to="`/${entry.name}`">{{ entry.name }}</RouterLink>
                <div class="itemdesc">{{ entry.description }}</div>
            </template>
        </div>
    </div>
</template>

<style>
.center {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    place-items: center;
}

.protolist {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 16px;
    max-width: 50rem;
    ;
}

.itemname {
    font-weight: bold;
}

.itemdesc {
    min-width: 0;
    white-space: pre-wrap;
}
</style>