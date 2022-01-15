<template>
    <div>{{ modelValue || ' - ' }}%</div>
    <input
        type="range"
        :value="modelValue"
        @input="onInput"
        max="100"
        :min="isWarrior ? 5 : 10"
        :step="isWarrior? 5 : 10"
    />
</template>

<script lang="ts" setup>
defineProps<{
    modelValue?: number|string,
    isWarrior: boolean
}>()

const emit = defineEmits(['update:modelValue'])

function onInput(e: Event) {
    console.debug("event", e);
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>