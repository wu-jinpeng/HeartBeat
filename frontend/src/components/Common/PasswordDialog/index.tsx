import { Fragment, useEffect, memo, useState, MouseEvent, ChangeEvent } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import DialogContent from '@mui/material/DialogContent'
import { StyleDialogActions, StyleDialogTitle } from '@src/components/Metrics/ReportStep/ExpiredDialog/style'
import { isEmpty } from 'lodash'
import { StyleFormControl, StylePassWordError } from '@src/components/Common/PasswordDialog/style'
import { ENCRYPTED_MESSAGE } from '@src/constants/resources'

export interface PasswordDialogInterface {
  isShowPasswordDialog: boolean
  handleConfirm: (password: string) => void
  handleCancel: () => void
}

const PasswordDialog = memo(({ isShowPasswordDialog, handleConfirm, handleCancel }: PasswordDialogInterface) => {
  const [open, setOpen] = useState(false)
  const [isDisabledConfirm, setIsDisabledConfirm] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

  const handleMouseDownConfirmPassword = (event: MouseEvent) => {
    event.preventDefault()
  }

  const getPasswordError = (password: string, isConfirmedPassword: boolean) => {
    const passwordRegExp = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,50}$')
    if (isEmpty(password)) {
      return isConfirmedPassword ? ENCRYPTED_MESSAGE.CONFIRMED_PASSWORD_EMPTY : ENCRYPTED_MESSAGE.PASSWORD_EMPTY
    }
    if (!passwordRegExp.test(password)) {
      return ENCRYPTED_MESSAGE.NOT_MATCH
    }
    return ''
  }

  const onChangePassword = (value: string) => {
    const errorMessage = getPasswordError(value, false)
    setPassword(value)
    setPasswordError(errorMessage)
    setIsDisabledConfirm(!isFilledPasswordAndValidSucceed(value, errorMessage, confirmPassword, confirmPasswordError))
  }

  const onChangeConfirmPassword = (value: string) => {
    const errorMessage = getPasswordError(value, true)
    setConfirmPassword(value)
    setConfirmPasswordError(errorMessage)
    setIsDisabledConfirm(!isFilledPasswordAndValidSucceed(password, passwordError, value, errorMessage))
  }

  const isFilledPasswordAndValidSucceed = (
    password: string,
    passwordError: string,
    confirmPassword: string,
    confirmPasswordError: string
  ) => {
    return !isEmpty(password) && !isEmpty(confirmPassword) && isEmpty(passwordError) && isEmpty(confirmPasswordError)
  }

  const onConfirm = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError(ENCRYPTED_MESSAGE.NOT_SAME)
    } else {
      handleConfirm(password)
      resetPassword()
    }
  }

  const resetPassword = () => {
    setPassword('')
    setPasswordError('')
    setConfirmPassword('')
    setConfirmPasswordError('')
  }

  const onCancel = () => {
    handleCancel()
    resetPassword()
  }

  useEffect(() => {
    setOpen(isShowPasswordDialog)
  }, [isShowPasswordDialog])

  return (
    <Fragment>
      <Dialog aria-label='password-dialog' fullWidth={true} open={open} onClose={handleCancel}>
        <StyleDialogTitle>{'please set password'}</StyleDialogTitle>
        <DialogContent>
          <StyleFormControl sx={{ width: '35ch' }} variant='standard'>
            <InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
            <Input
              id='standard-adornment-password'
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              error={!isEmpty(passwordError)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <StylePassWordError>{passwordError}</StylePassWordError>
          </StyleFormControl>
          <FormControl sx={{ width: '35ch' }} variant='standard'>
            <InputLabel htmlFor='standard-confirm-password'>Confirm password</InputLabel>
            <Input
              id='standard-confirm-password'
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onChangeConfirmPassword(e.target.value)}
              error={!isEmpty(confirmPasswordError)}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle confirmed password visibility'
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <StylePassWordError>{confirmPasswordError}</StylePassWordError>
          </FormControl>
        </DialogContent>
        <StyleDialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button disabled={isDisabledConfirm} onClick={onConfirm} autoFocus variant='contained'>
            Confirm
          </Button>
        </StyleDialogActions>
      </Dialog>
    </Fragment>
  )
})

PasswordDialog.displayName = 'PasswordDialog'
export default PasswordDialog
