import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useState } from 'react'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { saveTargetFields, selectMetricsImportedData } from '@src/context/Metrics/metricsSlice'
import { MetricsSettingTitle } from '@src/components/Common/MetricsSettingTitle'
import { SELECTED_VALUE_SEPARATOR } from '@src/constants'
import { useAppSelector } from '@src/hooks'
import { WaringDone } from '@src/components/Metrics/MetricsStep/CycleTime/style'
import { selectIsProjectCreated } from '@src/context/config/configSlice'

interface classificationProps {
  title: string
  label: string
  targetFields: { name: string; key: string; flag: boolean }[]
}

export const Classification = ({ targetFields, title, label }: classificationProps) => {
  const dispatch = useAppDispatch()
  const isProjectCreated = useAppSelector(selectIsProjectCreated)
  const importClassificationKeys = useAppSelector(selectMetricsImportedData).importedClassification
  const classification = targetFields.map((targetField) => targetField.name)
  const getDefaultValue = (importClassification: string[]) => {
    const includeClassifications = importClassification.filter((item) => targetFields.find((i) => i.key === item))
    return targetFields.filter((item) => includeClassifications.find((i) => i === item.key))
  }
  const defaultValue = getDefaultValue(importClassificationKeys).map((targetField) => targetField.name)
  const [selectedClassification, setSelectedClassification] = useState(isProjectCreated ? classification : defaultValue)

  const isAllSelected = selectedClassification.length > 0 && selectedClassification.length === targetFields.length

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    const classificationSettings =
      value[value.length - 1] === 'All' ? (isAllSelected ? [] : classification) : [...value]
    const updatedTargetFields = targetFields.map((targetField) => ({
      ...targetField,
      flag: classificationSettings.includes(targetField.name),
    }))
    setSelectedClassification(classificationSettings)
    dispatch(saveTargetFields(updatedTargetFields))
  }

  return (
    <>
      <MetricsSettingTitle title={title} />
      {!isProjectCreated && (
        <WaringDone>
          <span>Warning: Some classifications in import data might be removed now.</span>
        </WaringDone>
      )}
      <FormControl variant='standard'>
        <InputLabel id='classification-check-box'>{label}</InputLabel>
        <Select
          multiple
          labelId='classification-check-box'
          value={selectedClassification}
          onChange={handleChange}
          renderValue={(selectedClassification: string[]) => selectedClassification.join(SELECTED_VALUE_SEPARATOR)}
        >
          <MenuItem value='All'>
            <Checkbox checked={isAllSelected} />
            <ListItemText primary='All' />
          </MenuItem>
          {targetFields.map((targetField) => (
            <MenuItem key={targetField.key} value={targetField.name}>
              <Checkbox checked={selectedClassification.includes(targetField.name)} />
              <ListItemText primary={targetField.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
