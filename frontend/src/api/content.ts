import { request } from '@/utils/request'

// 内容数据接口
export interface Content {
  id: string
  community: string
  title: string
  activityName: string
  platform: string
  authorName: string
  publishTime: string
  contentType: string
  materialType: string
  publishType: string
  publisherName: string
  viewCount: number
  favoriteCount: number
  commentCount: number
  shareCount: number
  completionRate: string
  createdAt: string
  updatedAt: string
}

// 获取内容列表
export function getContents() {
  return request.get<Content[]>('/contents')
}
