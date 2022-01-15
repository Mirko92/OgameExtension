<script lang="ts" setup>
const emit = defineEmits([
  'update:galaxy',
  'update:system',
  'update:position',
])

const props = defineProps<{
  galaxy?:   number;
  system?:   number;
  position?: number;
}>()

const textCoords = computed(
  () => {
    const { galaxy:g, system:s, position:p} = props;

    if (g && s && p) {
      return `[${g}:${s}:${p}]`
    } else {
      return '[-:-:-]'
    }
  }
)

const inpCoords = computed({
  get() {
    const { galaxy:g, system:s, position:p} = props;

    if (g && s && p) {
      return `${g},${s},${p}`
    } else {
      return ''
    }
  },

  set(value: string) {
    if (value?.match(/\d\,\d{1,3}\,\d{1,2}/)){
      const [g,s,p] = value.split(',')

      emit('update:galaxy',   g)
      emit('update:system',   s)
      emit('update:position', p)
    }
  }
})

const isEdit = ref(false)
const inputRef = ref<HTMLElement>()

function toggleEdit() {
  isEdit.value = !isEdit.value

  if(isEdit.value) {
    nextTick(() => inputRef.value?.focus())
  }
}

function onBlur() {
  if(isEdit.value) {
    isEdit.value = false
  }
}
</script>

<template>
  <div class="d-f-r j-c-c">
    <template v-if="!isEdit">
      <div @click="toggleEdit" class="pointer">
        {{textCoords}}
      </div>
    </template>
    
    <template v-else>
      <input 
        ref="inputRef"
        type="text" 
        class="text-center"
        v-model="inpCoords"
        style="width: 4rem;"
        @blur="onBlur"
        @keyup.enter="toggleEdit"
      >
    </template>
  </div>
</template>

