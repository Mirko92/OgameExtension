<template>
<h1>Missions works</h1>

<button @click="prova">prova</button>
</template>

<script lang="ts" setup>

async function sendMessage(message: string) {
    chrome.runtime.sendMessage(
        window.mp.extensionId,
        'get-user-data', 
        (response) => console.log('received user data', response)
    );

    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            window.mp.extensionId,
            { method: "SEND_MESSAGE" },
            resolve
        )
    })
}

async function prova() {
    console.log("[MpOgame] - Pre-Invio messaggio", window.mp.extensionId)

    const response = await sendMessage("prova")

    console.log("[MpOgame] - prova response", response)
}
</script>