<template>
    <div class="d-f-c j-c-c">{{coords}}</div>
    <div class="d-f-c j-c-c" style="height: 24px;">
        {{planet.name}}
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{planet: any}>()

const coords = computed(() => {
    const {galaxy:g, system:s, position:p} = props.planet;
    return `[${g}:${s}:${p}]`
})
</script>