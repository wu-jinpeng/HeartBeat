import { Checkbox, createFilterOptions, TextField } from '@mui/material';
import { Z_INDEX } from '@src/constants/commons';
import { StyledAutocompleted } from './styles';
import React from 'react';

type Props = {
  optionList: string[];
  selectedOption: string[];
  onChangeHandler: (event: React.SyntheticEvent, value: string[]) => void;
  isSelectAll: boolean;
  textFieldLabel: string;
  isError: boolean;
  testId?: string;
  isBoardCrews?: boolean;
};
const MultiAutoComplete = ({
  optionList,
  selectedOption,
  onChangeHandler,
  isSelectAll,
  textFieldLabel,
  isError,
  testId,
  isBoardCrews = true,
}: Props) => {
  const filter = createFilterOptions();

  return (
    <StyledAutocompleted
      multiple
      data-testid={testId}
      options={optionList}
      disableCloseOnSelect
      value={selectedOption}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        return ['All', ...filtered];
      }}
      getOptionLabel={(option) => option as string}
      onChange={(event, value) => !!value && onChangeHandler(event, value as unknown as string[])}
      renderOption={(props, option, { selected }) => {
        const selectAllProps = option === 'All' ? { checked: isSelectAll } : {};
        return (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} {...selectAllProps} />
            {option as string}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={isBoardCrews}
          error={isError && isBoardCrews}
          variant='standard'
          label={textFieldLabel}
        />
      )}
      slotProps={{
        popper: {
          sx: {
            zIndex: Z_INDEX.DROPDOWN,
          },
        },
      }}
    />
  );
};

export default MultiAutoComplete;
