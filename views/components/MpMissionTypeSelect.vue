<template>
    <div class="small planet_icon"      v-if="$attrs.modelValue === 1" />
    <div class="small moon_icon"        v-else-if="$attrs.modelValue === 3" />
    <div class="small debris_icon"      v-else-if="$attrs.modelValue === 2" />
    <div class="icon_placeholder small" v-else />

    <select :value="$attrs.modelValue" @change="onChange">
        <option :value="1" v-t="'mission_type.planet'" />
        <option :value="2" v-t="'mission_type.debris'" />
        <option :value="3" v-t="'mission_type.moon'" />
    </select>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])

function onChange(e: Event) {
    emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>