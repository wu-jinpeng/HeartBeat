import {
  DialogContainer,
  StyledButton,
  StyledCalendarToday,
  StyledDialogContent,
  StyledDialogTitle,
  StyledFormGroup,
  TimePeriodSelectionMessage,
  tooltipModifiers,
} from '@src/containers/ReportStep/DownloadDialog/style';
import { Checkbox, Dialog, FormControlLabel, Tooltip } from '@mui/material';
import { COMMON_BUTTONS } from '@src/constants/commons';
import CloseIcon from '@mui/icons-material/Close';
import { formatDate } from '@src/utils/util';
import React, { useState } from 'react';

interface DownloadDialogProps {
  isShowDialog: boolean;
  handleClose: () => void;
  dateRangeItems: DateRangeItem[];
  downloadCSVFile: (startDate: string, endDate: string) => void;
}

export interface DateRangeItem {
  startDate: string;
  endDate: string;
  disabled: boolean;
}

export const DownloadDialog = ({ isShowDialog, handleClose, dateRangeItems, downloadCSVFile }: DownloadDialogProps) => {
  const [selectedRangeItems, setSelectedRangeItems] = useState<DateRangeItem[]>([]);
  const disableMessage = 'Unavailable time period indicates that report generation during this period has failed.';

  const handleChange = (targetItem: DateRangeItem) => {
    if (selectedRangeItems.includes(targetItem)) {
      setSelectedRangeItems(selectedRangeItems.filter((item) => targetItem !== item));
    } else {
      setSelectedRangeItems([...selectedRangeItems, targetItem]);
    }
  };

  const handleDownload = () => {
    selectedRangeItems.forEach((item) => {
      downloadCSVFile(item.startDate, item.endDate);
    });
    handleClose();
  };

  const getLabel = (item: DateRangeItem) => {
    if (item.disabled) {
      return (
        <Tooltip
          arrow
          title={disableMessage}
          placement={'top-end'}
          slotProps={{
            popper: tooltipModifiers,
          }}
        >
          <span>{`${formatDate(item.startDate)} - ${formatDate(item.endDate)}`}</span>
        </Tooltip>
      );
    } else {
      return `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`;
    }
  };

  return (
    <Dialog open={isShowDialog} maxWidth='md'>
      <DialogContainer>
        <StyledDialogTitle>
          <strong>Export Board Data</strong>
          <CloseIcon onClick={handleClose} />
        </StyledDialogTitle>
        <StyledDialogContent dividers>
          <TimePeriodSelectionMessage>
            <StyledCalendarToday />
            <strong>Select the time period for the exporting data</strong>
          </TimePeriodSelectionMessage>
          <StyledFormGroup>
            {dateRangeItems.map((item, index) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedRangeItems.includes(item)}
                    onChange={() => handleChange(item)}
                    key={index}
                  />
                }
                label={getLabel(item)}
                disabled={item.disabled}
              />
            ))}
          </StyledFormGroup>
          <StyledButton variant='contained' onClick={handleDownload}>
            {COMMON_BUTTONS.CONFIRM}
          </StyledButton>
        </StyledDialogContent>
      </DialogContainer>
    </Dialog>
  );
};