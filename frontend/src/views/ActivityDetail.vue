<template>
  <div class="activity-detail">
    <!-- Breadcrumb -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/activity-management' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Main Card -->
    <el-card class="detail-card" shadow="never">
      <!-- Activity Name Title -->
      <template #header>
        <div class="card-header">
          <span class="activity-name">{{ activityData.name }}</span>
        </div>
      </template>

      <!-- Section 1: Basic Information -->
      <div class="section">
        <div class="section-header">
          <h3 class="section-title">基础信息</h3>
          <el-icon v-if="!isEditing" class="edit-icon" @click="startEdit">
            <Edit />
          </el-icon>
        </div>
        <div class="info-content">
          <!-- Display Mode -->
          <el-form v-if="!isEditing" label-width="120px" class="info-form">
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="举办社区">
                  <span>{{ activityData.community }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动时间">
                  <span>{{ activityData.time }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动地址">
                  <span>{{ activityData.location }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合作企业">
                  <span>{{ activityData.partners }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动预算">
                  <span>{{ activityData.budget }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动支撑">
                  <span>{{ activityData.support }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动类型">
                  <span>{{ activityData.type }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动方式">
                  <span>{{ activityData.format }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="报名人数">
                  <span>{{ activityData.registrationCount }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签到人数">
                  <span>{{ activityData.checkinCount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="直播观看">
                  <span>{{ activityData.liveViews }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!-- Edit Mode -->
          <el-form
            v-else
            ref="formRef"
            :model="editForm"
            :rules="formRules"
            label-width="120px"
            class="info-form"
          >
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="举办社区" prop="community">
                  <el-select v-model="editForm.community" placeholder="请选择举办社区">
                    <el-option label="openEuler" value="openEuler" />
                    <el-option label="openGauss" value="openGauss" />
                    <el-option label="MindSpore" value="MindSpore" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动时间" prop="timeRange">
                  <el-date-picker
                    v-model="editForm.timeRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动地址" prop="location">
                  <el-input v-model="editForm.location" placeholder="请输入活动地址" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合作企业">
                  <el-input v-model="editForm.partners" placeholder="请输入合作企业" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动预算">
                  <el-input v-model="editForm.budget" placeholder="请输入活动预算" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动支撑">
                  <el-select v-model="editForm.support" placeholder="请选择活动支撑">
                    <el-option label="华为技术支持" value="华为技术支持" />
                    <el-option label="MindSpore社区" value="MindSpore社区" />
                    <el-option label="openGauss社区" value="openGauss社区" />
                    <el-option label="openEuler社区" value="openEuler社区" />
                    <el-option label="MindSpore技术团队" value="MindSpore技术团队" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动类型" prop="type">
                  <el-select v-model="editForm.type" placeholder="请选择活动类型">
                    <el-option label="技术峰会" value="技术峰会" />
                    <el-option label="开发者大会" value="开发者大会" />
                    <el-option label="技术交流会" value="技术交流会" />
                    <el-option label="研讨会" value="研讨会" />
                    <el-option label="工作坊" value="工作坊" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动方式" prop="format">
                  <el-select v-model="editForm.format" placeholder="请选择活动方式">
                    <el-option label="线下" value="线下" />
                    <el-option label="线上" value="线上" />
                    <el-option label="线下+线上" value="线下+线上" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="报名人数">
                  <el-input v-model.number="editForm.registrationCount" placeholder="请输入报名人数" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签到人数">
                  <el-input v-model.number="editForm.checkinCount" placeholder="请输入签到人数" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="直播观看">
                  <el-input v-model.number="editForm.liveViews" placeholder="请输入直播观看人数" />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Action Buttons -->
            <el-row>
              <el-col :span="24">
                <div class="form-actions">
                  <el-button @click="cancelEdit">取消</el-button>
                  <el-button type="primary" @click="saveEdit">保存</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- Section 2: Participants -->
      <div class="section">
        <h3 class="section-title">活动参与者</h3>
        <CommonTable
          :columns="participantColumns"
          :data="participantData"
          :expandable="true"
        >
          <!-- Operations Column -->
          <template #operations="{ row }">
            <span class="operation-link" @click="handleEdit(row)">编辑</span>
            <span class="operation-link" @click="handleDelete(row)">删除</span>
          </template>

          <!-- Expandable Content -->
          <template #expand="{ row }">
            <div class="expand-content">
              <el-form label-width="120px" class="expand-form">
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item label="活动满意度">
                      <span>{{ row.satisfaction }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="感兴趣议题">
                      <span>{{ row.interestedTopics }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item label="意见和建议">
                      <span>{{ row.feedback }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="未来活动期望">
                      <span>{{ row.futureExpectations }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </template>
        </CommonTable>
      </div>
    </el-card>

    <!-- Edit Participant Drawer -->
    <el-drawer
      v-model="drawerVisible"
      title="修改活动参与者信息"
      direction="rtl"
      size="500px"
    >
      <div class="drawer-content">
        <el-form
          ref="participantFormRef"
          :model="editParticipantForm"
          :rules="participantFormRules"
          label-width="120px"
          class="participant-form"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editParticipantForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="GitHub-ID" prop="githubId">
            <el-input v-model="editParticipantForm.githubId" placeholder="请输入GitHub-ID" />
          </el-form-item>
          <el-form-item label="GitCode-ID" prop="gitcodeId">
            <el-input v-model="editParticipantForm.gitcodeId" placeholder="请输入GitCode-ID" />
          </el-form-item>
          <el-form-item label="Gitee-ID" prop="giteeId">
            <el-input v-model="editParticipantForm.giteeId" placeholder="请输入Gitee-ID" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editParticipantForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="editParticipantForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="所属组织" prop="organization">
            <el-input v-model="editParticipantForm.organization" placeholder="请输入所属组织" />
          </el-form-item>
          <el-form-item label="是否到场" prop="attended">
            <el-select v-model="editParticipantForm.attended" placeholder="请选择是否到场">
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动满意度" prop="satisfaction">
            <el-input v-model="editParticipantForm.satisfaction" placeholder="请输入活动满意度" />
          </el-form-item>
          <el-form-item label="感兴趣议题" prop="interestedTopics">
            <el-input
              v-model="editParticipantForm.interestedTopics"
              type="textarea"
              :rows="3"
              placeholder="请输入感兴趣议题"
            />
          </el-form-item>
          <el-form-item label="意见和建议" prop="feedback">
            <el-input
              v-model="editParticipantForm.feedback"
              type="textarea"
              :rows="3"
              placeholder="请输入意见和建议"
            />
          </el-form-item>
          <el-form-item label="未来活动期望" prop="futureExpectations">
            <el-input
              v-model="editParticipantForm.futureExpectations"
              type="textarea"
              :rows="3"
              placeholder="请输入未来活动期望"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="cancelParticipantEdit">取消</el-button>
          <el-button type="primary" @click="saveParticipantEdit">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'

const route = useRoute()

// Edit mode state
const isEditing = ref(false)
const formRef = ref<FormInstance>()

// Edit form data
const editForm = ref({
  community: '',
  timeRange: [] as string[],
  location: '',
  partners: '',
  budget: '',
  support: '',
  type: '',
  format: '',
  registrationCount: 0,
  checkinCount: 0,
  liveViews: 0
})

// Form validation rules
const formRules: FormRules = {
  community: [
    { required: true, message: '请选择举办社区', trigger: 'change' }
  ],
  timeRange: [
    { required: true, message: '请选择活动时间', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入活动地址', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入活动类型', trigger: 'blur' }
  ],
  format: [
    { required: true, message: '请输入活动方式', trigger: 'blur' }
  ]
}

// Mock database of all activities
const allActivities = {
  'openEuler Summit 2024': {
    name: 'openEuler Summit 2024',
    community: 'openEuler',
    time: '2024-03-15 09:00-18:00',
    location: '北京国家会议中心',
    partners: '华为、中科院、清华大学',
    budget: '¥500,000',
    support: '华为技术支持',
    type: '技术峰会',
    format: '线下+线上',
    registrationCount: 500,
    checkinCount: 450,
    liveViews: 12000
  },
  'AI开发者大会': {
    name: 'AI开发者大会',
    community: 'MindSpore',
    time: '2024-04-20 09:00-17:00',
    location: '上海世博中心',
    partners: '华为、复旦大学、上海交大',
    budget: '¥300,000',
    support: 'MindSpore社区',
    type: '开发者大会',
    format: '线下+线上',
    registrationCount: 300,
    checkinCount: 280,
    liveViews: 8000
  },
  '数据库技术交流会': {
    name: '数据库技术交流会',
    community: 'openGauss',
    time: '2024-05-10 14:00-18:00',
    location: '深圳科技园',
    partners: '华为、腾讯',
    budget: '¥150,000',
    support: 'openGauss社区',
    type: '技术交流会',
    format: '线下',
    registrationCount: 200,
    checkinCount: 180,
    liveViews: 0
  },
  '开源操作系统研讨会': {
    name: '开源操作系统研讨会',
    community: 'openEuler',
    time: '2024-06-05 09:00-17:00',
    location: '杭州云栖小镇',
    partners: '阿里云、浙江大学',
    budget: '¥200,000',
    support: 'openEuler社区',
    type: '研讨会',
    format: '线下',
    registrationCount: 150,
    checkinCount: 140,
    liveViews: 0
  },
  '机器学习实战工作坊': {
    name: '机器学习实战工作坊',
    community: 'MindSpore',
    time: '2024-07-12 09:00-18:00',
    location: '广州天河区',
    partners: '华为、中山大学',
    budget: '¥180,000',
    support: 'MindSpore技术团队',
    type: '工作坊',
    format: '线下',
    registrationCount: 250,
    checkinCount: 230,
    liveViews: 0
  }
}

// Get activity name from query parameter
const activityName = computed(() => route.query.name as string || 'openEuler Summit 2024')

// Get activity data based on the name from query parameter
const activityData = computed(() => {
  return allActivities[activityName.value as keyof typeof allActivities] || allActivities['openEuler Summit 2024']
})

// Edit mode functions
const startEdit = () => {
  // Initialize edit form with current data
  const currentData = activityData.value
  const timeParts = currentData.time.split(' - ')
  editForm.value = {
    community: currentData.community,
    timeRange: timeParts.length === 2 ? timeParts : [currentData.time, currentData.time],
    location: currentData.location,
    partners: currentData.partners,
    budget: currentData.budget,
    support: currentData.support,
    type: currentData.type,
    format: currentData.format,
    registrationCount: currentData.registrationCount,
    checkinCount: currentData.checkinCount,
    liveViews: currentData.liveViews
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  formRef.value?.resetFields()
}

const saveEdit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // Format time range for display
      const timeStr = editForm.value.timeRange.length === 2
        ? `${editForm.value.timeRange[0]} - ${editForm.value.timeRange[1]}`
        : editForm.value.timeRange[0]

      // Update activity data (in real app, this would be an API call)
      const activityKey = activityName.value as keyof typeof allActivities
      if (allActivities[activityKey]) {
        allActivities[activityKey] = {
          ...allActivities[activityKey],
          community: editForm.value.community,
          time: timeStr,
          location: editForm.value.location,
          partners: editForm.value.partners,
          budget: editForm.value.budget,
          support: editForm.value.support,
          type: editForm.value.type,
          format: editForm.value.format,
          registrationCount: editForm.value.registrationCount,
          checkinCount: editForm.value.checkinCount,
          liveViews: editForm.value.liveViews
        }
      }

      isEditing.value = false
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('请填写所有必填字段')
    }
  })
}

// Participant table columns
const participantColumns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'githubId', label: 'GitHub-ID', width: 150 },
  { prop: 'gitcodeId', label: 'GitCode-ID', width: 150 },
  { prop: 'giteeId', label: 'Gitee-ID', width: 150 },
  { prop: 'email', label: '邮箱', minWidth: 200 },
  { prop: 'phone', label: '手机', width: 130 },
  { prop: 'organization', label: '所属组织', width: 150 },
  { prop: 'attended', label: '是否到场', width: 100 },
  { prop: 'operations', label: '操作', width: 120 }
]

// Participant mock data
const participantData = ref([
  {
    name: '张三',
    githubId: 'zhangsan',
    gitcodeId: 'zhangsan123',
    giteeId: 'zhangsan_gitee',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    organization: '华为',
    attended: '是',
    satisfaction: '非常满意',
    interestedTopics: '云原生、容器技术',
    feedback: '活动组织得很好，内容丰富',
    futureExpectations: '希望有更多实战工作坊'
  },
  {
    name: '李四',
    githubId: 'lisi',
    gitcodeId: 'lisi456',
    giteeId: 'lisi_gitee',
    email: 'lisi@example.com',
    phone: '13900139000',
    organization: '中科院',
    attended: '是',
    satisfaction: '满意',
    interestedTopics: '操作系统内核、性能优化',
    feedback: '技术分享很有深度',
    futureExpectations: '希望增加更多交流时间'
  },
  {
    name: '王五',
    githubId: 'wangwu',
    gitcodeId: 'wangwu789',
    giteeId: 'wangwu_gitee',
    email: 'wangwu@example.com',
    phone: '13700137000',
    organization: '清华大学',
    attended: '否',
    satisfaction: '一般',
    interestedTopics: '开源社区治理',
    feedback: '线上直播体验还可以改进',
    futureExpectations: '希望提供录播回放'
  }
])

// Drawer state for editing participant
const drawerVisible = ref(false)
const participantFormRef = ref<FormInstance>()
const editingParticipantIndex = ref<number>(-1)

// Edit participant form data
const editParticipantForm = ref({
  name: '',
  githubId: '',
  gitcodeId: '',
  giteeId: '',
  email: '',
  phone: '',
  organization: '',
  attended: '',
  satisfaction: '',
  interestedTopics: '',
  feedback: '',
  futureExpectations: ''
})

// Participant form validation rules
const participantFormRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
}

// Event handlers
const handleEdit = (row: any) => {
  // Find the index of the participant being edited
  editingParticipantIndex.value = participantData.value.findIndex(
    (p) => p.name === row.name && p.email === row.email
  )

  // Initialize form with current participant data
  editParticipantForm.value = {
    name: row.name,
    githubId: row.githubId,
    gitcodeId: row.gitcodeId,
    giteeId: row.giteeId,
    email: row.email,
    phone: row.phone,
    organization: row.organization,
    attended: row.attended,
    satisfaction: row.satisfaction,
    interestedTopics: row.interestedTopics,
    feedback: row.feedback,
    futureExpectations: row.futureExpectations
  }

  drawerVisible.value = true
}

const handleDelete = (row: any) => {
  console.log('删除参与者:', row)
  // TODO: 实现删除功能
}

const cancelParticipantEdit = () => {
  drawerVisible.value = false
  participantFormRef.value?.resetFields()
  editingParticipantIndex.value = -1
}

const saveParticipantEdit = async () => {
  if (!participantFormRef.value) return

  await participantFormRef.value.validate((valid) => {
    if (valid) {
      // Update participant data
      if (editingParticipantIndex.value !== -1) {
        participantData.value[editingParticipantIndex.value] = {
          ...editParticipantForm.value
        }
      }

      drawerVisible.value = false
      ElMessage.success('保存成功')
      editingParticipantIndex.value = -1
    } else {
      ElMessage.error('请填写所有必填字段')
    }
  })
}
</script>

<style scoped>
.activity-detail {
  width: 100%;
}

.el-breadcrumb {
  margin-bottom: 20px;
}

.detail-card {
  background-color: #ffffff;
  border: none;
}

.detail-card :deep(.el-card__header) {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header {
  display: flex;
  align-items: center;
}

.activity-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.detail-card :deep(.el-card__body) {
  padding: 20px;
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-header .section-title {
  margin: 0;
}

.edit-icon {
  font-size: 18px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.edit-icon:hover {
  opacity: 0.7;
}

.info-content {
  background-color: rgba(243, 243, 245, 0.4);
  padding: 24px;
  border-radius: 4px;
}

.info-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.info-form :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

.info-form :deep(.el-form-item__content) {
  color: #333;
}

.operation-link {
  color: rgb(0, 47, 167);
  cursor: pointer;
  margin-right: 12px;
  transition: opacity 0.3s;
}

.operation-link:hover {
  opacity: 0.7;
}

.operation-link:last-child {
  margin-right: 0;
}

.expand-content {
  background-color: rgba(234, 234, 235, 0.4);
  padding: 20px;
  margin: 12px 0;
  border-radius: 4px;
}

.expand-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.expand-form :deep(.el-form-item__label) {
  color: #606266;
  font-weight: 500;
}

.expand-form :deep(.el-form-item__content) {
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
}

.form-actions :deep(.el-button) {
  border-radius: 100px;
  padding: 8px 20px;
}

.info-form :deep(.el-select),
.info-form :deep(.el-date-editor) {
  width: 100%;
}

/* Drawer styles */
.drawer-content {
  overflow-y: auto;
  padding: 0 20px 20px 20px;
}

.participant-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.participant-form :deep(.el-select) {
  width: 100%;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  background-color: #ffffff;
}

:deep(.el-drawer__header) {
  margin-bottom: 20px;
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-drawer__body) {
  padding: 0;
  display: flex;
  flex-direction: column;
}

:deep(.el-drawer__footer) {
  position: sticky;
  bottom: 0;
  background-color: #ffffff;
  z-index: 10;
}
</style>
