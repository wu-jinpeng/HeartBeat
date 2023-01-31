import { fireEvent, render } from '@testing-library/react'
import MetricsStepper from '@src/components/metrics/MetricsStepper'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { stepperSlice } from '@src/features/stepper/StepperSlice'
import { NEXT, BACK, EXPORT_BOARD_DATA, STEPS } from '../../../fixtures'

describe('MetricsStepper', () => {
  const setupStepperStore = () => {
    return configureStore({
      reducer: {
        [stepperSlice.name]: stepperSlice.reducer,
      },
    })
  }

  let store = setupStepperStore()
  beforeEach(() => {
    store = setupStepperStore()
  })

  const setup = () =>
    render(
      <Provider store={store}>
        <MetricsStepper />
      </Provider>
    )

  it('should show metrics stepper', () => {
    const { getByText } = setup()

    STEPS.map((label) => {
      expect(getByText(label)).toBeInTheDocument()
    })
    expect(getByText(NEXT)).toBeInTheDocument()
    expect(getByText(BACK)).toBeInTheDocument()
  })

  it('should show metrics config step when click back button given config step ', () => {
    const { getByText } = setup()

    fireEvent.click(getByText(BACK))

    expect(getByText('Step 1')).toBeInTheDocument()
  })

  it('should show metrics metrics step when click next button given config step', async () => {
    const { getByText } = setup()

    fireEvent.click(getByText(NEXT))

    expect(getByText('Step 2')).toBeInTheDocument()
  })

  it('should show metrics config step when click back button given metrics step', async () => {
    const { getByText } = setup()

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(BACK))
    expect(getByText('Step 1')).toBeInTheDocument()
  })

  it('should show metrics export step when click next button given export step', async () => {
    const { getByText } = setup()

    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(NEXT))
    fireEvent.click(getByText(EXPORT_BOARD_DATA))
    expect(getByText('Step 3')).toBeInTheDocument()
  })
})
