<template>
    <div>
        <!-- <FormComp v-model:form-data="formData" @update:form-data="update" /> -->
        <MyInput v-model="formData.content">
            <template #header>
                <div>
                    {{ 'header-f' }} FormWrapper
                </div>
            </template>
            <template #footer>
                <div>
                    {{ 'footer-f' }} FormWrapper
                </div>
            </template>
        </MyInput>
    </div>
</template>

<script setup lang="ts">
import MyInput from './MyInput.vue';
import FormComp from './icons/FormComp.vue';
import { watch, ref } from 'vue'
const formData = ref({
    age: 18,
    content: 'hello',
})


const update = (data:any) => {
    formData.value = {...data}
}

watch(formData, () => {
    console.log('p', formData.value)
})
</script>

<style scoped>

</style>