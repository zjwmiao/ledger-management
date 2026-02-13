<template>
  <div class="activity-detail">
    <!-- Breadcrumb -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/activity-management' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Main Card -->
    <el-card class="detail-card" shadow="never" v-loading="loading">
      <!-- Activity Name Title -->
      <template #header>
        <div class="card-header">
          <span class="activity-name">{{ activityDetail?.name }}</span>
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
                  <span>{{ activityDetail?.community }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动时间">
                  <span>{{ activityDetail?.startDate ? formatDateRange(activityDetail.startDate, activityDetail.endDate) : '' }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动地址">
                  <span>{{ activityDetail?.location }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="合作企业">
                  <span>{{ activityDetail?.partnerCompanies }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动预算">
                  <span>{{ activityDetail?.budget }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动支撑">
                  <span>{{ activityDetail?.supportInfo }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="活动类型">
                  <span>{{ activityDetail?.type }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="活动方式">
                  <span>{{ activityDetail?.activityMode }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="报名人数">
                  <span>{{ activityDetail?.registrationCount }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签到人数">
                  <span>{{ activityDetail?.checkinCount }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <el-col :span="12">
                <el-form-item label="直播观看">
                  <span>{{ activityDetail?.livestreamViews }}</span>
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
          <template #attended="{ row }">
            <el-icon v-if="row.attended" color="rgb(11, 177, 81)"><SuccessFilled /></el-icon>
            <span v-else>--</span>
          </template>
          <template #giftReceived="{ row }">
            <el-icon v-if="row.giftReceived" color="rgb(11, 177, 81)"><SuccessFilled /></el-icon>
            <span v-else>--</span>
          </template>
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
                      <span>{{ row.expand?.satisfaction || '' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="感兴趣议题">
                      <span>{{ row.expand?.interestedTopics || '' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="40">
                  <el-col :span="12">
                    <el-form-item label="意见和建议">
                      <span>{{ row.expand?.feedback || '' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="未来活动期望">
                      <span>{{ row.expand?.futureExpectations || '' }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Edit, SuccessFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import CommonTable from '@/components/CommonTable.vue'
import { getActivityById, getParticipations, updateActivity, updateParticipation, deleteParticipation, type Activity } from '@/api/activity'

const route = useRoute()

// Loading state
const loading = ref(false)

// Activity data from API
const activityDetail = ref<Activity | null>(null)

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
    { required: true, message: '请选择活动类型', trigger: 'change' }
  ],
  format: [
    { required: true, message: '请选择活动方式', trigger: 'change' }
  ]
}

// Format date range
const formatDateRange = (startDate: string, endDate: string) => {
  if (!startDate) return ''
  if (startDate === endDate) {
    return startDate
  }
  return `${startDate} - ${endDate}`
}

// Fetch activity details
const fetchActivityDetail = async (id: string) => {
  loading.value = true
  try {
    const data = await getActivityById(id)
    activityDetail.value = data
  } catch (error) {
    console.error('Failed to fetch activity detail:', error)
    ElMessage.error('活动详情加载失败')
  } finally {
    loading.value = false
  }
}

const activityId = computed(() => route.query.id as string)

// Load activity on mount
onMounted(() => {
  if (activityId.value) {
    fetchActivityDetail(activityId.value)
    fetchParticipationData()
  } else {
    ElMessage.warning('未找到活动ID')
  }
})

// Edit mode functions
const startEdit = () => {
  if (!activityDetail.value) return

  const activity = activityDetail.value
  // 将API数据映射到表单字段
  editForm.value = {
    community: activity.community,
    timeRange: [activity.startDate, activity.endDate],
    location: activity.location,
    partners: activity.organizer,
    budget: '',
    support: '',
    type: activity.type,
    format: '',
    registrationCount: activity.maxParticipants,
    checkinCount: 0,
    liveViews: 0
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  formRef.value?.resetFields()
}

const saveEdit = async () => {
  if (!formRef.value || !activityDetail.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 将表单字段映射回API数据
        const updateData = {
          platform: editForm.value.community,
          startDate: editForm.value.timeRange[0],
          endDate: editForm.value.timeRange[1],
          location: editForm.value.location,
          organizer: editForm.value.partners,
          type: editForm.value.type,
          maxParticipants: editForm.value.registrationCount
        }

        await updateActivity(activityDetail.value!.id, updateData)

        // Refresh activity data
        await fetchActivityDetail(activityDetail.value!.id)

        isEditing.value = false
        ElMessage.success('保存成功')
      } catch (error) {
        console.error('Failed to update activity:', error)
        ElMessage.error('保存失败')
      }
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
  { prop: 'giftReceived', label: '是否领取礼品', width: 130 },
  { prop: 'operations', label: '操作', width: 120 }
]

interface Participation {
  id: string
  name: string
  githubId: string
  gitcodeId: string
  giteeId: string
  email: string
  phone: string
  organization: string
  attended: boolean
  giftReceived: boolean
  satisfaction: number | string
  interestedTopics: string
  feedback: string
  futureExpectations: string
}

// Participant mock data
const participantData = ref([] as Participation[])

const fetchParticipationData = async () => {
  const data = await getParticipations(activityId.value)
  if (Array.isArray(data)) {
    participantData.value = data.map(item => {
      const platFormMap = item.developerWithAccounts.platformAccounts.reduce((map, d) => {
        map[d.platform.toLowerCase()] = d
        return map
      }, {})
      return {
        id: item.id,
        name: item.developerWithAccounts.name,
        githubId: platFormMap.github?.platformAccountId || '--',
        giteeId: platFormMap.gitee?.platformAccountId || '--',
        gitcodeId: platFormMap.gitcode?.platformAccountId || '--',
        phone: '--',
        email: '--',
        organization: '--',
        attended: item.attended,
        giftReceived: item.giftReceived,
        satisfaction: item.satisfaction,
        interestedTopics: item.interestedTopics,
        feedback: item.feedback,
        futureExpectations: item.futureExpectations,
      }
    })
  }
}

// Drawer state for editing participant
const drawerVisible = ref(false)
const participantFormRef = ref<FormInstance>()
const editingParticipantIndex = ref<number>(-1)

// Edit participant form data
const editParticipantForm = ref({
  id: '',
  name: '',
  githubId: '',
  gitcodeId: '',
  giteeId: '',
  email: '',
  phone: '',
  organization: '',
  attended: '',
  giftReceived: '',
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
    (p) => p.id === row.id
  )

  // Initialize form with current participant data
  editParticipantForm.value = {
    id: row.id,
    name: row.name,
    githubId: row.githubId,
    gitcodeId: row.gitcodeId,
    giteeId: row.giteeId,
    email: row.email,
    phone: row.phone,
    organization: row.organization,
    attended: row.attended,
    giftReceived: row.giftReceived,
    satisfaction: row.satisfaction,
    interestedTopics: row.interestedTopics,
    feedback: row.feedback,
    futureExpectations: row.futureExpectations
  }

  drawerVisible.value = true
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该参与者吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteParticipation(activityId.value, row.id)
    ElMessage.success('删除成功')

    // 重新加载参与者列表
    await fetchParticipationData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete participant:', error)
      ElMessage.error('删除失败')
    }
  }
}

const cancelParticipantEdit = () => {
  drawerVisible.value = false
  participantFormRef.value?.resetFields()
  editingParticipantIndex.value = -1
}

const saveParticipantEdit = async () => {
  if (!participantFormRef.value) return

  try {
    const valid = await participantFormRef.value.validate()
    if (valid) {
      // 调用更新接口
      const updateData = {
        attended: Boolean(editParticipantForm.value.attended),
        giftReceived: Boolean(editParticipantForm.value.giftReceived),
        satisfaction: Number(editParticipantForm.value.satisfaction),
        interestedTopics: editParticipantForm.value.interestedTopics,
        feedback: editParticipantForm.value.feedback,
        futureExpectations: editParticipantForm.value.futureExpectations
      }

      await updateParticipation(activityId.value, editParticipantForm.value.id, updateData)

      drawerVisible.value = false
      ElMessage.success('保存成功')
      editingParticipantIndex.value = -1

      // 重新加载参与者列表
      await fetchParticipationData()
    }
  } catch (error) {
    console.error('Failed to update participant:', error)
    ElMessage.error('保存失败')
  }
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
