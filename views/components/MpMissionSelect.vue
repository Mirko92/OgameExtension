<template>
    <select
        :value="$attrs.modelValue"
        @change="onChange"
    >
        <option :value="1" v-t="'mission_order.attacking'" />
        <option :value="3" v-t="'mission_order.transport'">TRANSPORT</option>
        <option :value="4" v-t="'mission_order.deployment'">DEPLOYMENT</option>
        <option :value="5" v-t="'mission_order.holding'">HOLDING</option>
        <option :value="6" v-t="'mission_order.espionage'">ESPIONAGE</option>
        <option :value="7" v-t="'mission_order.colonization'">COLONIZATION</option>
        <option :value="8" v-t="'mission_order.harvesting'">HARVESTING</option>
        <option :value="15" v-t="'mission_order.expedition'">EXPEDITION</option>
    </select>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])

function onChange(e: Event) {
    emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>