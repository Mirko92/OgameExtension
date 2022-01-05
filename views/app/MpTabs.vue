<script lang="ts" setup>
defineProps<{modelValue: string}>()
</script>
<template>
    <div class="tabs">
        <section 
            class="tab" 
            :class="{'tab--active': modelValue === 'FLEET_FORM'}"
            title="INVIO FLOTTA" 
            @click="$emit('update:modelValue', 'FLEET_FORM')">
            <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M15.73 12.81c-.97.52-1.81 1.26-2.44 2.15l-1.74-3.33l-3.89 3.87L8 18l-1.05 1.06l-1.77-3.19L2 14.11l1.06-1.06l2.48.35l3.89-3.9L2 5.62l1.41-1.41l9.2 2.12l3.89-3.89a1.49 1.49 0 0 1 2.12 0c.58.59.58 1.56 0 2.12l-3.89 3.89l1 4.36m8.07 7.59c.1 0 .1.1 0 .2l-1 1.7c-.1.1-.2.1-.3.1l-1.2-.4c-.3.2-.5.3-.8.5l-.2 1.3c0 .1-.1.2-.2.2h-2c-.1 0-.2-.1-.3-.2l-.2-1.3c-.3-.1-.6-.3-.8-.5l-1.2.5c-.1 0-.2 0-.3-.1l-1-1.7c-.1-.1 0-.2.1-.3l1.1-.8v-1l-1.1-.8c-.1-.1-.1-.2-.1-.3l1-1.7c.1-.1.2-.1.3-.1l1.2.5c.3-.2.5-.3.8-.5l.2-1.3c0-.1.1-.2.3-.2h2c.1 0 .2.1.2.2l.2 1.3c.3.1.6.3.9.5l1.2-.5c.1 0 .3 0 .3.1l1 1.7c.1.1 0 .2-.1.3l-1.1.8v1l1.1.8M20.5 19c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5s.7 1.5 1.5 1.5s1.5-.7 1.5-1.5z" fill="currentColor"></path></svg>
        </section>
        <section 
            class="tab" 
            :class="{'tab--active': modelValue === 'TRADER'}"
            title="BATTITORE" 
            @click="$emit('update:modelValue', 'TRADER')">
            <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M14 20v2H2v-2h12zM14.586.686l7.778 7.778L20.95 9.88l-1.06-.354L17.413 12l5.657 5.657l-1.414 1.414L16 13.414l-2.404 2.404l.283 1.132l-1.415 1.414l-7.778-7.778l1.415-1.414l1.13.282l6.294-6.293l-.353-1.06L14.586.686zm.707 3.536l-7.071 7.07l3.535 3.536l7.071-7.07l-3.535-3.536z" fill="currentColor"></path></svg>
        </section>
        <section 
            class="tab" 
            :class="{'tab--active': modelValue === 'MISSIONS'}"
            title="SHORTCUT" 
            @click="$emit('update:modelValue', 'MISSIONS')">
            <svg class="tab__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1025 1025"><path d="M910 386l-12 12q-27 51-46.5 122.5T832 673v224q0 26-50.5 77t-77.5 51L473 823l-58 58q-11 11-23.5 14.5t-27.5-2t-27.5-12t-33-24.5t-32.5-30l-36.5-36.5L198 754l-30-32.5l-24.5-33l-12-27.5l-2-27.5L144 610l58-58L0 321q0-27 51-77.5t77-50.5h224q81 0 152.5-19.5T627 127l12-12q26-26 97-60T883 5t117 20q36 41 20 117t-50 147t-60 97zM768 129q-15 0-36 29.5T704 193q48 24 76 52t52 76q5-7 34.5-28t29.5-36q0-53-37.5-90.5T768 129zM160 801q44-1 54.5 9.5T224 865q-1 47-62.5 103.5T32 1025H0v-32q0-68 56.5-129.5T160 801z" fill="currentColor"></path></svg>
        </section>
    </div>
</template>

<style scoped>
.tabs {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
}
.tab {
    display: grid;
    place-items: center;

    flex: 1;
}
.tab__icon {
    color: white;
}
.tab:hover {
    background-color: white !important;
    cursor: pointer;
}
.tab:hover .tab__icon {
    color: #c199f3;
}
.tab--active{
    cursor: default;
    background-color: white !important;
}
.tab--active .tab__icon {
    color: #c199f3 !important;
}

</style>