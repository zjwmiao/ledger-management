import { request } from '@/utils/request'

// 实习数据接口
export interface Internship {
  id: string
  projectName: string
  createdAt: string
  mentor: string
  mentorEmail: string
  expectedCompletionTime: string
  score: number
  claimant: string
  closedAt: string
  status: string
  belongingSig: string
  originalUrl: string
  systemCreatedAt: string
  systemUpdatedAt: string
}

// 分页响应接口
export interface InternshipPageResponse {
  data: Internship[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

// 获取实习列表（分页）
export function getInternships(pageNum: number = 1, pageSize: number = 10) {
  return request.get<InternshipPageResponse>(`/internships?pageNum=${pageNum}&pageSize=${pageSize}`)
}
