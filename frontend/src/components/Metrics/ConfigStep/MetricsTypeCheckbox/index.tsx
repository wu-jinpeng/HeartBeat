import { Checkbox, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import {
  BOARD_TYPES,
  PIPELINE_TOOL_TYPES,
  SOURCE_CONTROL_TYPES,
  SELECTED_VALUE_SEPARATOR,
  REQUIRED_DATA,
} from '@src/constants'
import { useEffect, useState } from 'react'
import { RequireDataSelections } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox/style'
import { Board } from '@src/components/Metrics/ConfigStep/Board'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import {
  isPipelineToolVerified,
  isSourceControlVerified,
  selectConfig,
  selectIsBoardVerified,
  updateBoard,
  updateBoardVerifyState,
  updateMetrics,
  updatePipelineTool,
  updatePipelineToolVerifyState,
  updateSourceControl,
  updateSourceControlVerifyState,
} from '@src/context/config/configSlice'
import { PipelineTool } from '@src/components/Metrics/ConfigStep/PipelineTool'
import { SourceControl } from '@src/components/Metrics/ConfigStep/SourceControl'

export const MetricsTypeCheckbox = () => {
  const dispatch = useAppDispatch()
  const configData = useAppSelector(selectConfig)
  const isBoardVerify = useAppSelector(selectIsBoardVerified)
  const isPipelineToolVerify = useAppSelector(isPipelineToolVerified)
  const isSourceControlVerify = useAppSelector(isSourceControlVerified)
  const { isShowBoard, isShowPipeline, isShowSourceControl } = configData
  const { metrics } = configData.basic
  const [isEmptyRequireData, setIsEmptyProjectData] = useState<boolean>(false)
  const updateBoardState = () => {
    dispatch(
      updateBoard({
        type: BOARD_TYPES.JIRA,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
    isShowBoard ? dispatch(updateBoardVerifyState(isBoardVerify)) : dispatch(updateBoardVerifyState(false))
  }

  useEffect(() => {
    metrics && dispatch(updateMetrics(metrics))
  }, [metrics, dispatch])

  const updatePipelineToolState = () => {
    dispatch(updatePipelineTool({ pipelineTool: PIPELINE_TOOL_TYPES.BUILD_KITE, token: '' }))
    dispatch(updatePipelineToolVerifyState(false))
    isShowPipeline
      ? dispatch(updatePipelineToolVerifyState(isPipelineToolVerify))
      : dispatch(updatePipelineToolVerifyState(false))
  }

  const updateSourceControlState = () => {
    dispatch(updateSourceControl({ sourceControl: SOURCE_CONTROL_TYPES.GITHUB, token: '' }))
    dispatch(updateSourceControlVerifyState(false))
    isShowSourceControl
      ? dispatch(updateSourceControlVerifyState(isSourceControlVerify))
      : dispatch(updateSourceControlVerifyState(false))
  }

  const handleRequireDataChange = (event: SelectChangeEvent<typeof metrics>) => {
    const {
      target: { value },
    } = event

    dispatch(updateMetrics(value))
    value.length === 0 ? setIsEmptyProjectData(true) : setIsEmptyProjectData(false)
    updateBoardState()
    updatePipelineToolState()
    updateSourceControlState()
  }
  return (
    <>
      <RequireDataSelections variant='standard' required error={isEmptyRequireData}>
        <InputLabel id='require-data-multiple-checkbox-label'>Required Data</InputLabel>
        <Select
          labelId='require-data-multiple-checkbox-label'
          multiple
          value={metrics}
          onChange={handleRequireDataChange}
          renderValue={(selected) => selected.join(SELECTED_VALUE_SEPARATOR)}
        >
          {Object.values(REQUIRED_DATA).map((data) => (
            <MenuItem key={data} value={data}>
              <Checkbox checked={metrics.indexOf(data) > -1} />
              <ListItemText primary={data} />
            </MenuItem>
          ))}
        </Select>
        {isEmptyRequireData && <FormHelperText>Metrics is required</FormHelperText>}
      </RequireDataSelections>
      {isShowBoard && <Board />}
      {isShowPipeline && <PipelineTool />}
      {isShowSourceControl && <SourceControl />}
    </>
  )
}
