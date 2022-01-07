<script lang="ts" setup>
const props = defineProps<{ isActive: boolean }>()

const emit = defineEmits(['update:isActive'])

function toggleMenu() {
  emit("update:isActive", !props.isActive)
}
</script>

<template>
  <div 
    class="menu__toggler" 
    :class="{ 'active': isActive }" 
    @click="toggleMenu"
  >
    <span></span>
  </div>

  <div class="backdrop" 
      :class="{ 'active': isActive }" 
      @click="toggleMenu" />

  <aside 
    class="menu" 
    :class="{ 'active': isActive }"
  >
    <ul class="main_menu">
      <a
        routerLink="fleet-configuration"
        routerLinkActive="menu_item--active"
        @click="toggleMenu"
        class="menu_item"
      >
        <span>Fleet save config.</span>
      </a>

      <a
        routerLink="expedition-configuration"
        routerLinkActive="menu_item--active"
        @click="toggleMenu"
        class="menu_item"
      >
        <span>Expedition config.</span>
      </a>

      <a
        routerLink="about"
        routerLinkActive="menu_item--active"
        @click="toggleMenu"
        class="menu_item"
      >
        <span>About</span>
      </a>
    </ul>
  </aside>
</template>

<style>
.backdrop.active {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(5px);
  z-index: 997;
  overflow: hidden;
}

.menu {
  position: fixed;
  left: -100%;
  z-index: 998;
  color: white;
  background: rgba(14, 17, 22, 0.8);
  clip-path: polygon(0 0, 100% 0, 75% 100%, 0% 100%);
  width: 350px;
  height: 100vh;
  padding: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: 300ms left cubic-bezier(0.77, 0, 0.175, 1);
  font-size: 1.4rem;
}
.menu.active {
  left: 0;
}

.menu_item {
  margin: 15px 0;
  display: block;
  text-decoration: none;
  color: white;
}
.menu_item:hover {
  color: rgba(144, 238, 144, 0.514);
}
.menu_item--active {
  color: lightgreen;
}

.menu__toggler {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 999;
  height: 28px;
  width: 28px;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.menu__toggler span,
.menu__toggler span::before,
.menu__toggler span::after {
  position: absolute;
  content: "";
  width: 28px;
  height: 2.5px;
  background: #fafafa;
  border-radius: 20px;
  transition: 500ms cubic-bezier(0.77, 0, 0.175, 1);
}
.menu__toggler span::before {
  top: -8px;
}
.menu__toggler span::after {
  top: 8px;
}
.menu__toggler.active > span {
  background: transparent;
}
.menu__toggler.active > span::before, .menu__toggler.active > span::after {
  background: #005c9c;
  top: 0px;
}
.menu__toggler.active > span::before {
  transform: rotate(-225deg);
}
.menu__toggler.active > span::after {
  transform: rotate(225deg);
}

</style>