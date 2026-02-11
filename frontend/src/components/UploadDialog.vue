<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入模板"
    width="450px"
    :before-close="handleClose"
    align-center
  >
    <div class="upload-content">
      <!-- 上传区域 -->
      <el-upload
        ref="uploadRef"
        class="upload-area"
        drag
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :limit="1"
        :accept="acceptTypes"
        :show-file-list="false"
      >
        <div class="upload-dragger">
          <el-icon class="upload-icon">
            <Upload />
          </el-icon>
          <div class="upload-text">点击或拖拽文件到此处上传</div>
          <div class="upload-hint">只能上传excel、***文件格式，且文件最大不超过**M</div>
        </div>
      </el-upload>

      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="file-list">
        <div
          v-for="file in fileList"
          :key="file.uid"
          class="file-item"
          :class="{ 'file-error': file.status === 'fail' }"
        >
          <div class="file-info">
            <el-icon class="file-icon">
              <Document />
            </el-icon>
            <span class="file-name">{{ file.name }}</span>
          </div>
          <div class="file-actions">
            <el-icon
              v-if="file.status === 'success'"
              class="action-icon success-icon"
            >
              <CircleCheck />
            </el-icon>
            <el-icon
              class="action-icon delete-icon"
              @click="handleRemove(file)"
            >
              <Delete />
            </el-icon>
          </div>
        </div>
        <div v-if="uploadError" class="error-message">
          <span>{{ uploadError }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          :loading="uploading"
          @click="handleConfirm"
        >
          确定
        </el-button>
        <el-button @click="handleClose">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Document, CircleCheck, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadInstance, UploadUserFile } from 'element-plus'

interface Props {
  modelValue: boolean
  acceptTypes?: string
  maxSize?: number // MB
}

const props = withDefaults(defineProps<Props>(), {
  acceptTypes: '.xlsx,.xls',
  maxSize: 10
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': [file: File]
  'error': [error: string]
}>()

const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const uploading = ref(false)
const uploadError = ref('')

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 处理文件选择
const handleFileChange = (uploadFile: UploadFile) => {
  uploadError.value = ''

  // 验证文件大小
  if (uploadFile.size && uploadFile.size > props.maxSize * 1024 * 1024) {
    uploadError.value = `文件大小不能超过 ${props.maxSize}M`
    uploadFile.status = 'fail'
    fileList.value = [uploadFile as UploadUserFile]
    return
  }

  // 验证文件类型
  const fileName = uploadFile.name.toLowerCase()
  const acceptedExtensions = props.acceptTypes.split(',').map(ext => ext.trim())
  const isValidType = acceptedExtensions.some(ext => fileName.endsWith(ext))

  if (!isValidType) {
    uploadError.value = '上传失败，请检查文件是否符合要求'
    uploadFile.status = 'fail'
    fileList.value = [uploadFile as UploadUserFile]
    return
  }

  uploadFile.status = 'ready'
  fileList.value = [uploadFile as UploadUserFile]
}

// 移除文件
const handleRemove = (file: UploadUserFile) => {
  fileList.value = fileList.value.filter(f => f.uid !== file.uid)
  uploadError.value = ''
}

// 确认上传
const handleConfirm = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择文件')
    return
  }

  const file = fileList.value[0]
  if (!file) {
    return
  }

  if (file.status === 'fail') {
    ElMessage.error(uploadError.value || '文件验证失败')
    return
  }

  uploading.value = true

  try {
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 标记为成功
    file.status = 'success'

    ElMessage.success('上传成功')

    // 确保 raw 存在
    if (file.raw) {
      emit('success', file.raw)
    }

    // 延迟关闭对话框，让用户看到成功状态
    setTimeout(() => {
      handleClose()
    }, 500)
  } catch (error) {
    file.status = 'fail'
    uploadError.value = '上传失败，请重试'
    emit('error', uploadError.value)
    ElMessage.error(uploadError.value)
  } finally {
    uploading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  if (uploading.value) {
    return
  }
  fileList.value = []
  uploadError.value = ''
  dialogVisible.value = false
}
</script>

<script lang="ts">
export default {
  name: 'UploadDialog'
}
</script>

<style scoped>
.upload-content {
  padding: 24px 0;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload) {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 24px 106px;
  border-radius: 8px;
  background-color: #ebf1fa;
  border: 1px dashed #d9d9d9;
}

.upload-area :deep(.el-upload-dragger:hover) {
  border-color: #409eff;
}

.upload-dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.upload-icon {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
}

.upload-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.8);
  text-align: center;
}

.upload-hint {
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
}

.file-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.file-item.file-error .file-name {
  color: rgba(0, 0, 0, 0.4);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.file-name {
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.action-icon {
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s;
}

.success-icon {
  color: #67c23a;
}

.delete-icon {
  color: rgba(0, 0, 0, 0.4);
}

.delete-icon:hover {
  color: #f56c6c;
}

.error-message {
  font-size: 12px;
  line-height: 18px;
  color: #eb232d;
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.dialog-footer .el-button {
  width: 96px;
  height: 40px;
  border-radius: 100px;
  font-size: 16px;
  line-height: 24px;
}
</style>
