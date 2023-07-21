import { useState } from 'react'
import { pipelineToolClient } from '@src/clients/pipeline/PipelineToolClient'
import { ERROR_MESSAGE_TIME_DURATION, UNKNOWN_EXCEPTION, VERIFY_FAILED_ERROR_MESSAGE } from '@src/constants'
import { PipelineRequestDTO } from '@src/clients/pipeline/dto/request'

export interface useVerifyPipeLineToolStateInterface {
  verifyPipelineTool: (params: PipelineRequestDTO) => Promise<
    | {
        isPipelineToolVerified: boolean
        response: object
      }
    | undefined
  >
  isLoading: boolean
  isServerError: boolean
  errorMessage: string
}

export const useVerifyPipelineToolEffect = (): useVerifyPipeLineToolStateInterface => {
  const [isLoading, setIsLoading] = useState(false)
  const [isServerError, setIsServerError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const verifyPipelineTool = async (params: PipelineRequestDTO) => {
    setIsLoading(true)
    try {
      return await pipelineToolClient.verifyPipelineTool(params)
    } catch (e) {
      const err = e as Error
      if (err.message === UNKNOWN_EXCEPTION) {
        setIsServerError(true)
      } else {
        setErrorMessage(`${params.type} ${VERIFY_FAILED_ERROR_MESSAGE}: ${err.message}`)
        setTimeout(() => {
          setErrorMessage('')
        }, ERROR_MESSAGE_TIME_DURATION)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyPipelineTool,
    isLoading,
    isServerError,
    errorMessage,
  }
}
