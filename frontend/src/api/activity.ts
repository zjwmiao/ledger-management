import { request } from '@/utils/request'

// 活动接口返回的数据类型
export interface Activity {
  id: string
  name: string
  type: string
  community: string
  activityMode: string
  supportInfo: string
  budget: number
  registrationCount: number
  checkinCount: number
  livestreamViews: number
  partnerCompanies: string
  startDate: string
  endDate: string
  description: string
  location: string
  organizer: string
  maxParticipants: number
  status: string
  createdAt: string
  updatedAt: string
}

// 获取活动列表
export function getActivities() {
  return request.get<Activity[]>('/activities')
}

// 获取单个活动详情
export function getActivityById(id: string) {
  return request.get<Activity>(`/activities/${id}`)
}

// 创建活动
export function createActivity(data: Partial<Activity>) {
  return request.post<Activity>('/activities', data)
}

// 更新活动
export function updateActivity(id: string, data: Partial<Activity>) {
  return request.put<Activity>(`/activities/${id}`, data)
}

// 删除活动
export function deleteActivity(id: string) {
  return request.delete(`/activities/${id}`)
}

// 活动参加者接口
export interface Participation {
  id: string
  activityId: string
  developerId: string
  attended: boolean
  giftReceived: boolean
  satisfaction: number
  interestedTopics: string
  feedback: string
  futureExpectations: string
  developerWithAccounts?: any
}

// 获取活动参加者列表
export function getParticipations(activityId: string) {
  return request.get<Participation[]>(`/activities/${activityId}/participations`)
}

// 更新活动参加者信息
export function updateParticipation(activityId: string, participationId: string, data: Partial<Participation>) {
  return request.put<Participation>(`/activities/${activityId}/participations/${participationId}`, data)
}

// 删除活动参加者
export function deleteParticipation(activityId: string, participationId: string) {
  return request.delete(`/activities/${activityId}/participations/${participationId}`)
}