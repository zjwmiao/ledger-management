<template>
  <div class="developer-detail">
    <!-- Breadcrumb -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/developer-management' }">开发者管理</el-breadcrumb-item>
      <el-breadcrumb-item>开发者详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="detail-card" shadow="never">
      <!-- Activity Name Title -->
      <template #header>
        <div class="card-header">
          <span class="developer-name">{{ developerData.githubId }}</span>
        </div>
      </template>
      <!-- Personal Information Section -->
      <div class="info-section">
        <div class="section-title">个人信息</div>

        <div class="info-container">
          <!-- Left Table -->
          <div class="info-table">
            <div class="info-row">
              <span class="info-label">GitHub-ID</span>
              <span class="info-value">{{ developerData.githubId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">GitCode-ID</span>
              <span class="info-value">{{ developerData.gitcodeId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">社区</span>
              <span class="info-value">{{ developerData.community }}</span>
            </div>
          </div>

          <!-- Right Table -->
          <div class="info-table">
            <div class="info-row">
              <span class="info-label">Gitee-ID</span>
              <span class="info-value">{{ developerData.giteeId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">组织</span>
              <span class="info-value">{{ developerData.organization }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeCommunity">
        <el-tab-pane label="openEuler" name="openEuler" />
        <el-tab-pane label="openGauss" name="openGauss" />
        <el-tab-pane label="openUBMC" name="openUBMC" />
      </el-tabs>

      <div class="community-info">
        <ContributionTable
          title="技术贡献"
          :items="techContributions"
          layout="horizontal"
        />
        <ContributionTable
          title="活动贡献"
          :items="activityContributions"
          layout="horizontal"
        />
        <ContributionTable
          title="内容贡献"
          :items="contentContributions"
          layout="horizontal"
        />
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ContributionTable, { type ContributionItem } from '@/components/ContributionTable.vue';

const route = useRoute();

interface DeveloperData {
  githubId: string
  giteeId: string
  gitcodeId: number | string
  organization: string
  community: string
}

interface CommunityContributions {
  tech: ContributionItem[]
  activity: ContributionItem[]
  content: ContributionItem[]
}

type CommunityName = 'openEuler' | 'openGauss' | 'openUBMC'

const developerData = ref<DeveloperData>({
  githubId: '张三',
  giteeId: '男',
  gitcodeId: 28,
  organization: '138****8888',
  community: 'zhangsan@example.com'
});

const activeCommunity = ref<CommunityName>('openEuler');

// Load developer data based on query parameter
onMounted(() => {
  const name = route.query.name as string;
  if (name) {
    loadDeveloperData(name);
  }
});

// Mock function to load developer data
const loadDeveloperData = (name: string) => {
  // TODO: Replace with actual API call
  console.log('Loading data for developer:', name);

  // Mock data based on name
  const mockData: Record<string, DeveloperData> = {
    'Zhang San': {
      githubId: 'zhangsan',
      giteeId: 'zhangsan_gt',
      gitcodeId: 'zhangsan_gc',
      organization: 'OpenSource Inc.',
      community: 'openEuler'
    },
    'Li Si': {
      githubId: 'lisi',
      giteeId: 'lisi_gt',
      gitcodeId: 'lisi_gc',
      organization: 'Tech Corp',
      community: 'openGauss'
    },
    'Wang Wu': {
      githubId: 'wangwu',
      giteeId: 'wangwu_gt',
      gitcodeId: 'wangwu_gc',
      organization: 'Dev Studio',
      community: 'openUBMC'
    }
  };

  if (mockData[name]) {
    developerData.value = mockData[name];
  }
};

// 按社区分组的贡献数据
const contributionsData: Record<CommunityName, CommunityContributions> = {
  openEuler: {
    tech: [
      { label: 'Comment贡献数', value: 103 },
      { label: '合入PR', value: 45 },
      { label: 'PR平均响应时长', value: '2.5h' },
      { label: 'Issue', value: 56 },
      { label: 'Issue平均响应时长', value: '3.2h' },
      { label: 'Add code', value: 89 },
      { label: 'PR闭环率', value: '85%' },
      { label: 'PR平均关闭时长', value: '12h' },
      { label: 'Issue闭环率', value: '78%' },
      { label: 'Issue平均关闭时长', value: '24h' }
    ],
    activity: [
      { label: '参与活动数', value: 12 },
      { label: '主办活动数', value: 5 },
      { label: '活动平均评分', value: 4.5 }
    ],
    content: [
      { label: '发布内容数', value: 20 },
      { label: '内容平均评分', value: 4.8 },
      { label: '内容总浏览量', value: 1500 }
    ]
  },
  openGauss: {
    tech: [
      { label: 'Comment贡献数', value: 87 },
      { label: '合入PR', value: 32 },
      { label: 'PR平均响应时长', value: '3.1h' },
      { label: 'Issue', value: 41 },
      { label: 'Issue平均响应时长', value: '4.5h' },
      { label: 'Add code', value: 65 },
      { label: 'PR闭环率', value: '82%' },
      { label: 'PR平均关闭时长', value: '15h' },
      { label: 'Issue闭环率', value: '75%' },
      { label: 'Issue平均关闭时长', value: '28h' }
    ],
    activity: [
      { label: '参与活动数', value: 8 },
      { label: '主办活动数', value: 3 },
      { label: '活动平均评分', value: 4.3 }
    ],
    content: [
      { label: '发布内容数', value: 15 },
      { label: '内容平均评分', value: 4.6 },
      { label: '内容总浏览量', value: 1200 }
    ]
  },
  openUBMC: {
    tech: [
      { label: 'Comment贡献数', value: 56 },
      { label: '合入PR', value: 28 },
      { label: 'PR平均响应时长', value: '2.8h' },
      { label: 'Issue', value: 34 },
      { label: 'Issue平均响应时长', value: '3.8h' },
      { label: 'Add code', value: 52 },
      { label: 'PR闭环率', value: '88%' },
      { label: 'PR平均关闭时长', value: '10h' },
      { label: 'Issue闭环率', value: '80%' },
      { label: 'Issue平均关闭时长', value: '20h' }
    ],
    activity: [
      { label: '参与活动数', value: 6 },
      { label: '主办活动数', value: 2 },
      { label: '活动平均评分', value: 4.7 }
    ],
    content: [
      { label: '发布内容数', value: 10 },
      { label: '内容平均评分', value: 4.9 },
      { label: '内容总浏览量', value: 800 }
    ]
  }
};

// 根据当前选中的社区返回对应的贡献数据
const techContributions = computed(() => contributionsData[activeCommunity.value].tech);
const activityContributions = computed(() => contributionsData[activeCommunity.value].activity);
const contentContributions = computed(() => contributionsData[activeCommunity.value].content);
</script>
<style scoped>
.detail-card {
  margin-top: 24px;
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

.developer-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.detail-card :deep(.el-card__body) {
  padding: 20px;
}

.info-section {
  background: rgba(243, 243, 245, 0.4);
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: #303133;
  margin-bottom: 16px;
}

.info-container {
  display: flex;
  gap: 24px;
}

.info-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  min-height: 24px;
}

.info-label {
  min-width: 100px;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #303133;
}

.community-info {
  margin-top: 24px;
}
</style>