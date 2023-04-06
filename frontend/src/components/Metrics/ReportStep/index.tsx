import { Velocity } from '@src/components/Metrics/ReportStep/Velocity'
import { useEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { Loading } from '@src/components/Loading'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import { VelocityMetric } from '@src/constants'
import { reportResponseMapper } from '@src/mapper/ReportMapping'

export const ReportStep = () => {
  const { generateReport, isLoading } = useGenerateReportEffect()
  const [velocityData, setVelocityData] = useState({
    [VelocityMetric.VELOCITY_SP]: '2',
    [VelocityMetric.THROUGHPUT_CARDS_COUNT]: '2',
  })
  const configData = useAppSelector(selectConfig)
  const { metrics, calendarType, dateRange } = configData.basic
  const { boardConfig, pipelineToolConfig, sourceControlConfig } = configData
  const params = {
    metrics: metrics,
    pipeline: pipelineToolConfig,
    board: boardConfig,
    sourceControl: sourceControlConfig,
    calendarType: calendarType,
    startTime: dateRange.startDate,
    endTime: dateRange.endDate,
  }
  useEffect(() => {
    generateReport(params).then((res) => {
      if (res) {
        const reportData = reportResponseMapper(res.response)
        setVelocityData(reportData.velocityValues)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <>{isLoading ? <Loading /> : <Velocity title={'Velocity'} velocityData={velocityData} />}</>
}
