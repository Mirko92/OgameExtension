<template>
    <select
        :value="$attrs.modelValue"
        @change="onChange"
    >
        <option :value="1">ATTACCO</option>
        <option :value="3">TRASPORTO</option>
        <option :value="4">SCHIERAMENTO</option>
        <option :value="5">STAZIONAMENTO</option>
        <option :value="6">SPIONAGGIO</option>
        <option :value="7">COLONIZZAZZIONE</option>
        <option :value="8">RICICLAGGIO</option>
        <option :value="15">SPEDIZIONE</option>
    </select>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])

function onChange(e: Event) {
    emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>