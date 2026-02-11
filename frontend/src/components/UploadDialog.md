# UploadDialog 组件

一个基于 Element Plus 的文件上传对话框组件，支持拖拽上传、文件验证和上传状态展示。

## 功能特性

- ✅ 拖拽上传和点击上传
- ✅ 文件类型验证
- ✅ 文件大小验证
- ✅ 上传状态展示（就绪、上传中、成功、失败）
- ✅ 错误提示
- ✅ 文件预览和删除

## 组件状态

组件支持三种主要状态：

1. **初始状态**：显示上传区域，等待用户选择文件
2. **文件选择后**：显示文件信息，可以删除或重新选择
3. **上传成功**：显示成功图标，文件信息保持显示

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 对话框显示状态 | boolean | - |
| acceptTypes | 接受的文件类型 | string | '.xlsx,.xls' |
| maxSize | 最大文件大小（MB） | number | 10 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 对话框显示状态变化 | (value: boolean) |
| success | 上传成功 | (file: File) |
| error | 上传失败 | (error: string) |

## 基础用法

```vue
<template>
  <div>
    <el-button @click="dialogVisible = true">打开上传对话框</el-button>

    <UploadDialog
      v-model="dialogVisible"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UploadDialog from '@/components/UploadDialog.vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)

const handleSuccess = (file: File) => {
  ElMessage.success(`文件 ${file.name} 上传成功`)
  // 处理上传成功后的逻辑
}

const handleError = (error: string) => {
  ElMessage.error(error)
}
</script>
```

## 自定义文件类型和大小

```vue
<UploadDialog
  v-model="dialogVisible"
  accept-types=".pdf,.doc,.docx"
  :max-size="20"
  @success="handleSuccess"
/>
```

## 样式定制

组件使用了 scoped 样式，如果需要自定义样式，可以通过以下方式：

```vue
<style>
/* 修改上传区域背景色 */
.upload-area :deep(.el-upload-dragger) {
  background-color: #f0f9ff;
}

/* 修改按钮样式 */
.dialog-footer .el-button {
  min-width: 120px;
}
</style>
```

## 注意事项

1. 组件内部使用了 Element Plus 的 Upload 和 Dialog 组件，确保项目已安装 Element Plus
2. 文件验证在客户端进行，服务端也应该进行相应的验证
3. 上传逻辑需要根据实际后端接口进行调整
4. 组件默认限制只能上传一个文件

## 开发计划

- [ ] 支持多文件上传
- [ ] 支持上传进度显示
- [ ] 支持断点续传
- [ ] 支持文件预览（图片、PDF等）
