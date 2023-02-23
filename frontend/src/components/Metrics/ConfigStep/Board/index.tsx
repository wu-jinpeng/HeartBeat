import { CircularProgress, InputLabel, ListItemText, MenuItem, Select } from '@mui/material'
import { BOARD_TYPES, emailRegExp, ZERO, EMAIL, CONFIG_TITLE } from '@src/constants'
import React, { FormEvent, useEffect, useState } from 'react'
import {
  BoardButtonGroup,
  BoardForm,
  BoardLoadingDrop,
  BoardSection,
  BoardTextField,
  BoardTitle,
  BoardTypeSelections,
  ResetButton,
  VerifyButton,
} from '@src/components/Metrics/ConfigStep/Board/style'
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch'
import { changeBoardVerifyState, isBoardVerified } from '@src/features/board/boardSlice'
import { selectBoardFields, updateBoardFields } from '@src/features/config/configSlice'
import { useVerifyBoardState } from '@src/hooks/useVerifyBoardState'

export const Board = () => {
  const dispatch = useAppDispatch()
  const isVerified = useAppSelector(isBoardVerified)
  const boardFields = useAppSelector(selectBoardFields)
  const [isDisableVerifyButton, setIsDisableVerifyButton] = useState(true)
  const [validFields, setValidFields] = useState([false, false, false, false, false, false])
  const { verifyJira, isVerifyLoading } = useVerifyBoardState()
  const fields = [
    {
      key: 'board',
      value: boardFields.board,
    },
    {
      key: 'boardId',
      value: boardFields.boardId,
    },
    {
      key: 'email',
      value: boardFields.email,
    },
    {
      key: 'projectKey',
      value: boardFields.projectKey,
    },
    {
      key: 'site',
      value: boardFields.site,
    },
    {
      key: 'token',
      value: boardFields.token,
    },
  ]

  useEffect(() => {
    dispatch(
      updateBoardFields({
        board: fields[0].value,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
    setValidFields([false, false, false, false, false, false])
  }, [fields[0].value])

  useEffect(() => {
    setIsDisableVerifyButton(
      !fields.map((field) => checkFiledValid(field.key, field.value)).every((validField) => validField)
    )
  }, [fields])

  const initBoardFields = () => {
    dispatch(
      updateBoardFields({
        board: BOARD_TYPES.JIRA,
        boardId: '',
        email: '',
        projectKey: '',
        site: '',
        token: '',
      })
    )
  }

  const checkFiledValid = (type: string, value: string): boolean =>
    type === EMAIL ? emailRegExp.test(value) : value !== ''

  const onFormUpdate = (index: number, value: string) => {
    const newBoardFields = {
      board: fields[0].value,
      boardId: fields[1].value,
      email: fields[2].value,
      projectKey: fields[3].value,
      site: fields[4].value,
      token: fields[5].value,
    }
    const newValidFields = validFields.map((isValidField, fieldIndex) =>
      fieldIndex === index ? !checkFiledValid(fields[index].key, value) : isValidField
    )

    setValidFields(newValidFields)
    dispatch(
      updateBoardFields({
        ...newBoardFields,
        [fields[index].key]: value,
      })
    )
  }

  const handleSubmitBoardFields = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await verifyJira()
    dispatch(changeBoardVerifyState(true))
  }

  const handleResetBoardFields = () => {
    initBoardFields()
    setIsDisableVerifyButton(true)
    dispatch(changeBoardVerifyState(false))
  }

  return (
    <BoardSection>
      {isVerifyLoading && (
        <BoardLoadingDrop open={isVerifyLoading} data-testid='circularProgress'>
          <CircularProgress size='8rem' />
        </BoardLoadingDrop>
      )}
      <BoardTitle>{CONFIG_TITLE.BOARD}</BoardTitle>
      <BoardForm onSubmit={(e) => handleSubmitBoardFields(e)} onReset={handleResetBoardFields}>
        {fields.map((filed, index) =>
          index === ZERO ? (
            <BoardTypeSelections variant='standard' required key={index}>
              <InputLabel id='board-type-checkbox-label'>board</InputLabel>
              <Select
                labelId='board-type-checkbox-label'
                value={filed.value}
                onChange={(e) => {
                  onFormUpdate(index, e.target.value)
                }}
              >
                {Object.values(BOARD_TYPES).map((data) => (
                  <MenuItem key={data} value={data}>
                    <ListItemText primary={data} />
                  </MenuItem>
                ))}
              </Select>
            </BoardTypeSelections>
          ) : (
            <BoardTextField
              key={index}
              required
              label={filed.key}
              variant='standard'
              value={filed.value}
              onChange={(e) => {
                onFormUpdate(index, e.target.value)
              }}
              error={validFields[index]}
              helperText={validFields[index] ? `${filed.key} is required` : ''}
            />
          )
        )}
        <BoardButtonGroup>
          {isVerified ? (
            <VerifyButton>Verified</VerifyButton>
          ) : (
            <VerifyButton type='submit' disabled={isDisableVerifyButton || isVerifyLoading}>
              Verify
            </VerifyButton>
          )}

          {isVerified && <ResetButton type='reset'>Reset</ResetButton>}
        </BoardButtonGroup>
      </BoardForm>
    </BoardSection>
  )
}
