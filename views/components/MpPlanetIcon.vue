<template>
    <div 
        class="planet_icon" 
        title="Planet" 
        v-if="$attrs.type === 1" 
    />
    <div 
        class="moon_icon" 
        title="Moon" 
        v-if="$attrs.type === 3" 
    />
</template>