<template>
    <el-form
      ref="formRef"
      :model="numberValidateForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="age"
        prop="age"
        :rules="[
          { required: true, message: 'age is required' },
          { type: 'number', message: 'age must be a number' },
        ]"
      >
        <el-input
          v-model.number="numberValidateForm.age"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
        <el-button @click="resetForm(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue'
  import type { FormInstance } from 'element-plus'

  const emit = defineEmits(['update:formData'])

  const formRef = ref<FormInstance>()
  
  const numberValidateForm = reactive({
    age: null
  })

  watch(numberValidateForm, () => {
    console.log('watch', numberValidateForm.age)
    emit('update:formData', numberValidateForm)
  })
  
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('submit!', numberValidateForm.age)
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
  
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  </script>
  