import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@src/store/store'
import { REGULAR_CALENDAR } from '@src/constants'

export interface configState {
  projectName: string
  calendarType: string
  dateRange: {
    startDate: number | null
    endDate: number | null
  }
}

const initialState: configState = {
  projectName: '',
  calendarType: REGULAR_CALENDAR,
  dateRange: {
    startDate: null,
    endDate: null,
  },
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateProjectName: (state, action) => {
      state.projectName = action.payload
    },
    updateCalendarType: (state, action) => {
      state.calendarType = action.payload
    },
    updateDateRange: (state, action) => {
      const { startDate, endDate } = action.payload
      state.dateRange = { startDate, endDate }
    },
  },
})

export const { updateProjectName, updateCalendarType, updateDateRange } = configSlice.actions

export const selectProjectName = (state: RootState) => state.config.projectName
export const selectCalendarType = (state: RootState) => state.config.calendarType
export const selectDateRange = (state: RootState) => state.config.dateRange

export default configSlice.reducer
