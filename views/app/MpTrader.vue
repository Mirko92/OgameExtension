<template>
  <div class="trader">

    <section class="trader__form">
      <div class="form_group">
        <div>
          <h3 class="text-white" for="max-bet">Max bet (k)</h3>
        </div>
        <input
          id="max-bet"
          type="number"
          v-model="maxBet"
        />
      </div>

      <div class="actions">
        <button class="mp_button" @click="runBot()">RUN</button>

        <button class="mp_button" @click="stop()">STOP</button>

        <button class="mp_button" @click="bet()">BET</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.form_group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

input {
  padding: 0.5rem 1rem;
  width: 5rem;
  margin: 0 auto;
}
.trader__form {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  min-height: 0;
  flex: 1;
  margin: 0 auto;
}
.trader__form input {
  text-align: center;
}
.trader .actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
}

button {
  background-color: none !important;
}
</style>

<script lang="ts" setup>
const maxBet = ref(2);
function runBot(){
  // TODO:
  // executeScript(`bot(${maxBet.value * 1000});`)
}

function stop(){
  // TODO:
  // executeScript(`stop();`)
}

function bet(){
  // TODO:
  // executeScript('betMetal();')
}
</script>