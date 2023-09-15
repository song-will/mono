<script lang="ts" setup>
import { computed } from 'vue'
import TestSlot from './TestSlot.vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const slots = ['header', 'footer']
</script>

<template>
  <input v-model="value" />
  <TestSlot>
    <template #header>
      <div>
        <slot name="header"></slot>
        <!-- {{ 'header-m' }} MyInput -->
      </div>
    </template>
    <template #footer>
      <div>
        <!-- {{ 'footer-m' }} MyInput -->
        <slot name="footer"></slot>
      </div>
    </template>
    <!-- <template v-for="slotName in slots" #[slotName] :key="slotName">
      <slot :name="slotName"></slot>
    </template> -->
  </TestSlot>

  <!-- <slot name="footer"></slot> -->
</template>