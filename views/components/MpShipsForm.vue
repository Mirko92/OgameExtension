<template>
  <section>
    <header>
      <h5>
        Navi
      </h5>
    </header>

    <div class="ship"
        v-for="ship in shipsOptions"
        :key="ship.id">
        <span class="ship__name">{{ship.name}}</span>
        <span class="ship__number">
            <input type="number"
                placeholder="0" 
                min="0"
                v-model="modelValue[`am${ship.id}`]"/>
        </span>
    </div>
  </section>
</template>


<script lang="ts" setup>
import { shipsOptions } from "../logic/shipsOptions"

defineProps<{ modelValue?: any }>()
defineEmits<{ (e: 'update:modelValue', x: any): void }>()
</script>

<style scoped>
.ship {
  display: flex;
  flex-flow: row nowrap;
  gap: 1rem;
}

input[type="number"] {
  border: 0;
  border-radius: 4px;
  padding: 3px 5px;
  transition: transform .1s ease-in;
}
input[type="number"]:focus {
  transform: scale(1.3);
  box-shadow: 0px 2px 10px 0px black;
}

.ship .ship__number,
.ship .ship__number input {
  width: 50px;
}

.ship .ship__number {
  padding: 1px;
}

.ship .ship__number:focus-within {
  z-index: 2;
}

.ship .ship__name {
  flex: 1;
}

section {
  background: rgb(125 92 162 / 60%);
  /* background: #00000073; */
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  margin: 0.25rem 0;
}
section:focus-within {
  background: rgb(125 92 162 / 75%);
}

section.center {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

h5 {
  font-size: 1.1rem;
  margin: 0;
  margin-bottom: 0.2rem;
}
</style>