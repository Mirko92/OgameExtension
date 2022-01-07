<template>
<div class="d-f-c j-c-c">
    <section class="preconfigured_mission">
        <h4 class="preconfigured_mission__name">Fleet-Save</h4>
        <button class="mp_button" title="Run" @click="fleetSave">
            <span>▶</span>
        </button>
    </section>

    <section class="preconfigured_mission">
        <h4 class="preconfigured_mission__name">Send Expedition</h4>
        <button class="mp_button" title="Run" @click="sendExpedition">
            <span>▶</span>
        </button>
    </section>

    <section class="preconfigured_mission">
        <h4 class="preconfigured_mission__name">Move all cargo to Planet</h4>
        <button class="mp_button" title="Run" @click="moveCargoToPlanet">
            <span>▶</span>
        </button>
    </section>

    <section class="preconfigured_mission">
        <h4 class="preconfigured_mission__name">Move all cargo to Moon</h4>
        <button class="mp_button" title="Run" @click="moveCargoToMoon">
            <span>▶</span>
        </button>
    </section>

    <section class="collect_mission">
        <h4 class="text-white">Collect To: </h4>

        <input 
            type="text" 
            placeholder="g,s,p,t"
            title="galaxy, system, planet, type"
            v-model="destination"
        >

        <button class="mp_button" title="Run" @click="collectTo">
            <span>▶</span>
        </button>
    </section>
</div>
</template>

<style scoped>
.collect_mission,
.preconfigured_mission{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}
.preconfigured_mission__name{
    color: white;
}

.collect_mission input{
    width: 5rem;
    text-align: center;
    padding: 0.5rem 1rem;
    border-radius: 35px;
    color: white;
    font-size: 1rem;
    outline: none !important;
    background: none !important;
    box-shadow: none !important;
    border: 2px solid white !important;

}
.collect_mission input::placeholder {
    color: white;
    opacity: .8;
}
</style>

<script lang="ts" setup>

// async function sendMessage(message: string) {
//     return new Promise((resolve) => {
//         chrome.runtime.sendMessage(
//             window.mp.extensionId,
//             { method: "SEND_MESSAGE" },
//             resolve
//         )
//     })
// }

// async function prova() {
//     console.log("[MpOgame] - Pre-Invio messaggio", window.mp.extensionId)

//     const response = await sendMessage("prova")

//     console.log("[MpOgame] - prova response", response)
// }

function fleetSave() {
    console.log("[MpOgame] - FleetSave")
    window.mp.automaticFleetSave()
}

function sendExpedition() {
    console.log("[MpOgame] - SendExpedition")
    window.mp.fleetDispatcher.sendExpedition(null, false)
}

function moveCargoToPlanet() {
    console.log("[MpOgame] - MoveCargoToPlanet")
    window.mp.moveToPlanet()
}

function moveCargoToMoon() {
    console.log("[MpOgame] - MoveCargoToMoon")
    window.mp.moveToMoon()
}

const destination = ref("")
function collectTo() {
    console.log("[MpOgame] - CollectTo")
    window.mp.collectToMain(undefined, destination.value)
}
</script>