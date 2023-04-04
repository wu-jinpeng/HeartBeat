import { useState } from 'react'
import { ERROR_MESSAGE_TIME_DURATION } from '@src/constants'
import { generateReportParams, reportClient } from '@src/clients/ReportClient'
import { VelocityInterface } from '@src/types/reportResponse'

export interface useGenerateReportEffectInterface {
  generateReport: (params: generateReportParams) => Promise<
    | {
        response: {
          velocity: VelocityInterface
        }
      }
    | undefined
  >
  isLoading: boolean
  errorMessage: string
}

export const useGenerateReportEffect = (): useGenerateReportEffectInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const generateReport = async (params: generateReportParams) => {
    setIsLoading(true)
    try {
      return await reportClient.reporting(params)
    } catch (e) {
      const err = e as Error
      setErrorMessage(`generate report: ${err.message}`)
      setTimeout(() => {
        setErrorMessage('')
      }, ERROR_MESSAGE_TIME_DURATION)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateReport,
    isLoading,
    errorMessage,
  }
}
