import {
  AscendingIcon,
  DescendingIcon,
  SortingButton,
  SortingButtoningContainer,
  SortingTextButton,
} from '@src/containers/ConfigStep/DateRangePicker/style';
import { selectDateRangeSortType, updateDateRangeSortType } from '@src/context/config/configSlice';
import { SortType } from '@src/containers/ConfigStep/DateRangePicker/types';
import { useAppDispatch, useAppSelector } from '@src/hooks/useAppDispatch';
import { SORTING_DATE_RANGE_TEXT } from '@src/constants/resources';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useState } from 'react';

type Props = {
  disabled: boolean;
};

export const SortingDateRange = ({ disabled }: Props) => {
  const dispatch = useAppDispatch();
  const sortType = useAppSelector(selectDateRangeSortType);
  const [dateRangeSortType, setDateRangeSortType] = useState<SortType>(sortType);

  const handleChangeSort = () => {
    const totalSortTypes = Object.values(SortType).length;
    const currentIndex = Object.values(SortType).indexOf(dateRangeSortType);
    const newIndex = (currentIndex + 1) % totalSortTypes;
    const newSortType = Object.values(SortType)[newIndex];

    setDateRangeSortType(newSortType);
    dispatch(updateDateRangeSortType(newSortType));
  };

  return (
    <Box aria-label='Sorting date range'>
      <SortingButtoningContainer>
        <SortingTextButton disableRipple>{SORTING_DATE_RANGE_TEXT[dateRangeSortType]}</SortingTextButton>
        <SortingButton aria-label='sort button' onClick={handleChangeSort} disabled={disabled}>
          {dateRangeSortType === SortType.ASCENDING ? (
            <AscendingIcon disabled={disabled} />
          ) : (
            <ArrowDropUp fontSize='inherit' />
          )}
          {dateRangeSortType === SortType.DESCENDING ? (
            <DescendingIcon disabled={disabled} />
          ) : (
            <ArrowDropDown fontSize='inherit' />
          )}
        </SortingButton>
      </SortingButtoningContainer>
    </Box>
  );
};
