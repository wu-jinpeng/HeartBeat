import {
  initDeploymentFrequencySettings,
  saveUsers,
  updateShouldGetBoardConfig,
  updateShouldGetPipelineConfig,
} from '@src/context/Metrics/metricsSlice';
import { selectDateRange, updateDateRange } from '@src/context/config/configSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StyledDateRangePicker, StyledDateRangePickerContainer } from './style';
import { DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS } from '@src/constants/resources';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Z_INDEX } from '@src/constants/commons';
import { Nullable } from '@src/utils/types';
import dayjs, { Dayjs } from 'dayjs';
import isNull from 'lodash/isNull';

export const DateRangePicker = () => {
  const dispatch = useAppDispatch();
  const { startDate, endDate } = useAppSelector(selectDateRange);
  const dispatchUpdateConfig = () => {
    dispatch(updateShouldGetBoardConfig(true));
    dispatch(updateShouldGetPipelineConfig(true));
    dispatch(initDeploymentFrequencySettings());
    dispatch(saveUsers([]));
  };

  const changeStartDate = (value: Nullable<Dayjs>) => {
    let daysAddToEndDate = DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS;
    if (value) {
      const currentDate = dayjs(new Date());
      const valueToStartDate = value.startOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      const daysBetweenCurrentAndStartDate = currentDate.diff(valueToStartDate, 'days');
      daysAddToEndDate =
        daysBetweenCurrentAndStartDate >= DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS
          ? DEFAULT_SPRINT_INTERVAL_OFFSET_DAYS
          : daysBetweenCurrentAndStartDate;
    }
    dispatch(
      updateDateRange(
        isNull(value)
          ? {
              startDate: null,
              endDate: null,
            }
          : {
              startDate: value.startOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
              endDate: value.endOf('date').add(daysAddToEndDate, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            },
      ),
    );
    dispatchUpdateConfig();
  };

  const changeEndDate = (value: Dayjs) => {
    dispatch(
      updateDateRange({
        startDate: startDate,
        endDate: !isNull(value) ? value.endOf('date').format('YYYY-MM-DDTHH:mm:ss.SSSZ') : null,
      }),
    );
    dispatchUpdateConfig();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDateRangePickerContainer>
        <StyledDateRangePicker
          disableFuture
          label='From *'
          value={startDate ? dayjs(startDate) : null}
          onChange={(newValue) => changeStartDate(newValue as unknown as Dayjs)}
          slots={{
            openPickerIcon: CalendarTodayIcon,
          }}
          slotProps={{
            textField: {
              variant: 'standard',
            },
            popper: {
              sx: { zIndex: Z_INDEX.DROPDOWN },
            },
          }}
        />
        <StyledDateRangePicker
          disableFuture
          label='To *'
          value={endDate ? dayjs(endDate) : null}
          maxDate={dayjs(startDate).add(30, 'day')}
          minDate={dayjs(startDate)}
          onChange={(newValue) => changeEndDate(newValue as unknown as Dayjs)}
          slots={{
            openPickerIcon: CalendarTodayIcon,
          }}
          slotProps={{
            textField: {
              variant: 'standard',
            },
            popper: {
              sx: { zIndex: Z_INDEX.DROPDOWN },
            },
          }}
        />
      </StyledDateRangePickerContainer>
    </LocalizationProvider>
  );
};