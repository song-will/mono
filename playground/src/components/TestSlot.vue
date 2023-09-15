<template>
    <div>
        flsjfsdj;
        <slot name="header"></slot>
        <slot name="footer"></slot>
    </div>
</template>

<script setup lang="ts">
const slotName = 'testSlot'

</script>

<style scoped>
div {
    border: 1px solid red;
}
</style>