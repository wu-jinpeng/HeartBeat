import {
  initDeploymentFrequencySettings,
  updateShouldGetBoardConfig,
  updateShouldGetPipelineConfig,
} from '@src/context/Metrics/metricsSlice';
import { DateRangePickerGroupContainer } from '@src/containers/ConfigStep/DateRangePicker/style';
import { DateRangePicker } from '@src/containers/ConfigStep/DateRangePicker/DateRangePicker';
import { ADD_TIME_RANGE_BUTTON_TEXT, MAX_TIME_RANGE_AMOUNT } from '@src/constants/resources';
import { selectDateRange, updateDateRange } from '@src/context/config/configSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { AddButton } from '@src/components/Common/AddButtonOneLine';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError } from '@mui/x-date-pickers';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import dayjs from 'dayjs';

export enum SortType {
  DESCENDING = 'DESCENDING',
  ASCENDING = 'ASCENDING',
  DEFAULT = 'DEFAULT',
}

export type SortDateRangeType = {
  startDate: string | null;
  endDate: string | null;
  sortIndex: number;
  startDateError: DateValidationError | null;
  endDateError: DateValidationError | null;
};

const sortFn = {
  DEFAULT: ({ sortIndex }: SortDateRangeType) => sortIndex,
  DESCENDING: ({ startDate }: SortDateRangeType) => -dayjs(startDate).unix(),
  ASCENDING: ({ startDate }: SortDateRangeType) => dayjs(startDate).unix(),
};

type IProps = {
  sortStatus: SortType;
  onChange?: (data: SortDateRangeType[]) => void;
  onError?: (data: SortDateRangeType[]) => void;
};

const fillDateRangeGroup = <T,>(item: T, index: number) => ({
  ...item,
  startDateError: null,
  endDateError: null,
  sortIndex: index,
});

export const DateRangePickerGroup = ({ sortStatus, onError }: IProps) => {
  const dispatch = useAppDispatch();
  const dateRangeGroup = useAppSelector(selectDateRange);
  const isAddButtonDisabled = dateRangeGroup.length === MAX_TIME_RANGE_AMOUNT;
  const [sortDateRangeGroup, setSortDateRangeGroup] = useState<SortDateRangeType[]>(
    dateRangeGroup.map(fillDateRangeGroup),
  );

  useEffect(() => {
    const errors = sortDateRangeGroup.filter(({ startDateError, endDateError }) => startDateError || endDateError);
    onError?.(errors);
  }, [onError, sortDateRangeGroup]);

  const handleStartDateError = async (error: DateValidationError, index: number) => {
    await setSortDateRangeGroup(
      sortDateRangeGroup.map((item) => ({ ...item, startDateError: item.sortIndex === index ? error : null })),
    );
  };

  const handleEndDateError = async (error: DateValidationError, index: number) => {
    await setSortDateRangeGroup(
      sortDateRangeGroup.map((item) => ({ ...item, endDateError: item.sortIndex === index ? error : null })),
    );
  };

  const dispatchUpdateConfig = () => {
    dispatch(updateShouldGetBoardConfig(true));
    dispatch(updateShouldGetPipelineConfig(true));
    dispatch(initDeploymentFrequencySettings());
  };

  const addRangeHandler = () => {
    const newDateRangeGroup = [...dateRangeGroup, { startDate: null, endDate: null }];
    setSortDateRangeGroup(newDateRangeGroup.map(fillDateRangeGroup));
    dispatch(updateDateRange(newDateRangeGroup));
  };

  const handleChange = (data: { startDate: string | null; endDate: string | null }[]) => {
    setSortDateRangeGroup(data.map(fillDateRangeGroup));
    dispatchUpdateConfig();
    dispatch(updateDateRange(data));
  };

  return (
    <DateRangePickerGroupContainer>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {sortBy(sortDateRangeGroup, get(sortFn, sortStatus)).map(({ startDate, endDate, sortIndex }, index) => (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            index={sortIndex}
            key={index}
            onChange={handleChange}
            onStartDateError={handleStartDateError}
            onEndDateError={handleEndDateError}
          />
        ))}
        <AddButton
          disabled={isAddButtonDisabled}
          aria-label='Button for adding date range'
          onClick={addRangeHandler}
          text={ADD_TIME_RANGE_BUTTON_TEXT}
          sx={{
            mt: '1.5rem',
          }}
        />
      </LocalizationProvider>
    </DateRangePickerGroupContainer>
  );
};
