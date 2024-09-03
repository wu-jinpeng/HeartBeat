import {
  DateRange,
  selectIsProjectCreated,
  selectSourceControl,
  updateSourceControlVerifiedResponse,
} from '@src/context/config/configSlice';
import { updateSourceControlConfigurationSettingsFirstInto } from '@src/context/Metrics/metricsSlice';
import { sourceControlClient } from '@src/clients/sourceControl/SourceControlClient';
import { FULFILLED, SourceControlTypes } from '@src/constants/resources';
import { useAppDispatch, useAppSelector } from '@src/hooks/index';
import { useState } from 'react';
import dayjs from 'dayjs';

export interface IUseGetSourceControlConfigurationRepoInterface {
  readonly isLoading: boolean;
  readonly getSourceControlRepoInfo: (value: string, dateRanges: DateRange[]) => Promise<void>;
  readonly isGetRepo: boolean;
}
export const useGetSourceControlConfigurationRepoEffect = (): IUseGetSourceControlConfigurationRepoInterface => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGetRepo, setIsGetRepo] = useState<boolean>(false);
  const restoredSourceControlInfo = useAppSelector(selectSourceControl);
  const isProjectCreated = useAppSelector(selectIsProjectCreated);

  function getEnumKeyByEnumValue(enumValue: string): SourceControlTypes {
    return Object.entries(SourceControlTypes)
      .filter((it) => it[0] === enumValue)
      .map((it) => it[1])[0];
  }

  const getSourceControlRepoInfo = async (organization: string, dateRanges: DateRange[]) => {
    setIsLoading(true);
    const allRepoRes = await Promise.allSettled(
      dateRanges.flatMap((dateRange) => {
        const params = {
          type: getEnumKeyByEnumValue(restoredSourceControlInfo.type),
          token: restoredSourceControlInfo.token,
          organization: organization,
          endTime: dayjs(dateRange.endDate).startOf('date').valueOf(),
        };
        return sourceControlClient.getRepo(params);
      }),
    );
    allRepoRes.forEach((response) => {
      if (response.status === FULFILLED) {
        dispatch(
          updateSourceControlVerifiedResponse({
            parents: [
              {
                name: 'organization',
                value: organization,
              },
            ],
            names: response.value.data?.name.map((it) => it),
          }),
        );
        dispatch(
          updateSourceControlConfigurationSettingsFirstInto({
            ...response.value.data,
            isProjectCreated,
            type: 'repo',
          }),
        );
      }
    });
    setIsLoading(false);
    setIsGetRepo(true);
  };

  return {
    isLoading,
    getSourceControlRepoInfo,
    isGetRepo,
  };
};