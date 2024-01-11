export interface BoardRequestDTO {
  token: string
  type: string
  site: string
  startTime: number | null
  endTime: number | null
  boardId: string
}

export interface BoardInfoRequestDTO {
  token: string
  type: string
  site: string
  startTime: number | null
  endTime: number | null
  boardId: string
  projectKey: string
}
