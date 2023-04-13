import { act, renderHook, waitFor } from '@testing-library/react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { MOCK_GENERATE_REPORT_REQUEST_PARAMS } from '../fixtures'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { reportClient } from '@src/clients/report/ReportClient'
import { reportMapper } from '@src/hooks/reportMapper/report'

const mockReportResponse = {
  response: {
    velocity: {
      velocityForSP: '20',
      velocityForCards: '14',
    },
    cycleTime: {},
    classification: [],
    deploymentFrequency: {},
    leadTimeForChanges: {},
    changeFailureRate: {},
  },
}

const expectedReportValues = {
  velocityValues: [
    { id: 0, name: 'Velocity(SP)', value: ['20'] },
    { id: 1, name: 'ThroughPut(Cards Count)', value: ['14'] },
  ],
  cycleValues: [],
  classificationValues: [],
  deploymentFrequencyValues: [],
  leadTimeForChangesValues: [],
  changeFailureRateValues: [],
}

jest.mock('@src/hooks/reportMapper/report', () => ({
  reportMapper: jest.fn(() => 'mock'),
}))

describe('use generate report effect', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should init data state when render hook', async () => {
    const { result } = renderHook(() => useGenerateReportEffect())

    expect(result.current.isLoading).toEqual(false)
  })
  it('should set error message when generate report throw error', async () => {
    jest.useFakeTimers()
    reportClient.report = jest.fn().mockImplementation(() => {
      throw new Error('error')
    })
    const { result } = renderHook(() => useGenerateReportEffect())

    expect(result.current.isLoading).toEqual(false)

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
      jest.advanceTimersByTime(ERROR_MESSAGE_TIME_DURATION)
    })

    expect(result.current.errorMessage).toEqual('')
  })

  it('should set error message when generate report response status 500', async () => {
    reportClient.report = jest.fn().mockImplementation(() => {
      throw new InternalServerException('error message')
    })
    const { result } = renderHook(() => useGenerateReportEffect())

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    expect(result.current.errorMessage).toEqual('generate report: error message')
  })

  it('should call reportMapper method when generate report response status 200', async () => {
    reportClient.report = jest.fn().mockReturnValue(mockReportResponse)

    const { result } = renderHook(() => useGenerateReportEffect())

    act(() => {
      result.current.generateReport(MOCK_GENERATE_REPORT_REQUEST_PARAMS)
    })

    await waitFor(() => {
      expect(reportMapper).toHaveBeenCalledTimes(1)
    })
  })
})
