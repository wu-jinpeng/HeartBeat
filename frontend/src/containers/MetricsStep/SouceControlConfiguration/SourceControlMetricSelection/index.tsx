import {
  ButtonWrapper,
  PipelineMetricSelectionWrapper,
  RemoveButton,
  WarningMessage,
} from '@src/containers/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection/style';
import {
  selectDateRange,
  selectSourceControlBranches,
  selectSourceControlOrganizations,
  selectSourceControlRepos,
} from '@src/context/config/configSlice';
import {
  AxiosRequestErrorCode,
  MESSAGE,
  SOURCE_CONTROL_CONFIG_TITLE,
  SOURCE_CONTROL_ERROR_MESSAGE,
} from '@src/constants/resources';
import { IPresentationForErrorCasesProps } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PresentationForErrorCases';
import {
  selectSourceControlConfigurationSettings,
  updateShouldGetSourceControlConfig,
} from '@src/context/Metrics/metricsSlice';
import { useGetSourceControlConfigurationBranchEffect } from '@src/hooks/useGetSourceControlConfigurationBranchEffect';
import { useGetSourceControlConfigurationRepoEffect } from '@src/hooks/useGetSourceControlConfigurationRepoEffect';
import { useGetSourceControlConfigurationCrewEffect } from '@src/hooks/useGetSourceControlConfigurationCrewEffect';
import { SourceControlBranch } from '@src/containers/MetricsStep/SouceControlConfiguration/SourceControlBranch';
import { SingleSelection } from '@src/containers/MetricsStep/DeploymentFrequencySettings/SingleSelection';
import { addNotification } from '@src/context/notification/NotificationSlice';
import { MetricsDataFailStatus } from '@src/constants/commons';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { Loading } from '@src/components/Loading';
import { useEffect, useRef } from 'react';
import { store } from '@src/store';

interface SourceControlMetricSelectionProps {
  sourceControlSetting: {
    id: number;
    organization: string;
    repo: string;
    branches: string[];
  };
  isShowRemoveButton: boolean;
  onRemoveSourceControl: (id: number) => void;
  handleUpdateErrorInfo: (errorInfo: IPresentationForErrorCasesProps) => void;
  onUpdateSourceControl: (id: number, label: string, value: string | StringConstructor[] | string[]) => void;
  isDuplicated: boolean;
  setLoadingCompletedNumber: React.Dispatch<React.SetStateAction<number>>;
  totalSourceControlNumber: number;
}

export const SourceControlMetricSelection = ({
  sourceControlSetting,
  isShowRemoveButton,
  onRemoveSourceControl,
  onUpdateSourceControl,
  isDuplicated,
  setLoadingCompletedNumber,
  handleUpdateErrorInfo,
  totalSourceControlNumber,
}: SourceControlMetricSelectionProps) => {
  const { id, organization, repo } = sourceControlSetting;
  const isInitialMount = useRef(true);
  const {
    isLoading: repoIsLoading,
    getSourceControlRepoInfo,
    isGetRepo,
    stepFailedStatus: getRepoFailedStatus,
  } = useGetSourceControlConfigurationRepoEffect();
  const {
    isLoading: branchIsLoading,
    getSourceControlBranchInfo,
    isGetBranch,
    stepFailedStatus: getBranchFailedStatus,
  } = useGetSourceControlConfigurationBranchEffect();
  const {
    isLoading: crewIsLoading,
    getSourceControlCrewInfo,
    isGetAllCrews,
    stepFailedStatus: getCrewFailedStatus,
  } = useGetSourceControlConfigurationCrewEffect();
  const storeContext = store.getState();
  const dispatch = useAppDispatch();
  const organizationNameOptions = selectSourceControlOrganizations(storeContext);
  const repoNameOptions = selectSourceControlRepos(storeContext, organization);
  const branchNameOptions = selectSourceControlBranches(storeContext, organization, repo);
  const dateRanges = useAppSelector(selectDateRange);
  const sourceControlList = useAppSelector(selectSourceControlConfigurationSettings);

  const selectedBranches = sourceControlList.find((it) => it.id === id)?.branches;
  const isLoading = repoIsLoading || branchIsLoading || crewIsLoading;

  const handleRemoveClick = () => {
    onRemoveSourceControl(id);
    setLoadingCompletedNumber((value) => Math.max(value - 1, 0));
  };

  useEffect(() => {
    if (isInitialMount.current && !isGetRepo && organization && repoNameOptions.length === 0) {
      getSourceControlRepoInfo(organization, dateRanges, id);
      isInitialMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetRepo]);

  useEffect(() => {
    if (!isGetBranch && isGetRepo && organization && repo && branchNameOptions.length === 0) {
      getSourceControlBranchInfo(organization, repo, id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetBranch, isGetRepo]);

  useEffect(() => {
    if (!isGetAllCrews && isGetBranch && isGetRepo && organization && repo && selectedBranches) {
      Promise.all(selectedBranches.map((it) => getSourceControlCrewInfo(organization, repo, it, dateRanges))).then(
        () => {
          dispatch(updateShouldGetSourceControlConfig(false));
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGetAllCrews, isGetBranch, isGetRepo]);

  useEffect(() => {
    if (isGetAllCrews) {
      setLoadingCompletedNumber((value) => Math.min(totalSourceControlNumber, value + 1));
    }
  }, [isGetAllCrews, setLoadingCompletedNumber, totalSourceControlNumber]);

  useEffect(() => {
    const popup = () => {
      if (
        getRepoFailedStatus === MetricsDataFailStatus.PartialFailed4xx ||
        getBranchFailedStatus === MetricsDataFailStatus.PartialFailed4xx ||
        getCrewFailedStatus === MetricsDataFailStatus.PartialFailed4xx
      ) {
        dispatch(
          addNotification({
            type: 'warning',
            message: MESSAGE.SOURCE_CONTROL_REQUEST_PARTIAL_FAILED_4XX,
          }),
        );
      } else if (
        getRepoFailedStatus === MetricsDataFailStatus.PartialFailedTimeout ||
        getBranchFailedStatus === MetricsDataFailStatus.PartialFailedTimeout ||
        getCrewFailedStatus === MetricsDataFailStatus.PartialFailedTimeout
      ) {
        dispatch(
          addNotification({
            type: 'warning',
            message: MESSAGE.SOURCE_CONTROL_REQUEST_PARTIAL_FAILED_OTHERS,
          }),
        );
      }
    };
    const retry = () => {
      if (
        getRepoFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getRepoFailedStatus === MetricsDataFailStatus.AllFailed4xx
      ) {
        return getSourceControlRepoInfo(organization, dateRanges, id);
      } else if (
        getBranchFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getBranchFailedStatus === MetricsDataFailStatus.AllFailed4xx
      ) {
        return getSourceControlBranchInfo(organization, repo, id);
      } else {
        return Promise.all(
          selectedBranches!.map((it) => getSourceControlCrewInfo(organization, repo, it, dateRanges)),
        ).then(() => {
          dispatch(updateShouldGetSourceControlConfig(false));
        });
      }
    };
    const codeFunction = () => {
      if (
        getRepoFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getBranchFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getCrewFailedStatus === MetricsDataFailStatus.AllFailedTimeout
      ) {
        return AxiosRequestErrorCode.Timeout;
      } else {
        return 404;
      }
    };
    if (!isLoading) {
      popup();
      const code = codeFunction();
      const errorInfo: IPresentationForErrorCasesProps = {
        code,
        errorTitle: SOURCE_CONTROL_CONFIG_TITLE,
        errorMessage: SOURCE_CONTROL_ERROR_MESSAGE,
        retry,
        isLoading,
      };
      const isError =
        getRepoFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getRepoFailedStatus === MetricsDataFailStatus.AllFailed4xx ||
        getBranchFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getBranchFailedStatus === MetricsDataFailStatus.AllFailed4xx ||
        getCrewFailedStatus === MetricsDataFailStatus.AllFailedTimeout ||
        getCrewFailedStatus === MetricsDataFailStatus.AllFailed4xx;
      if (isError) {
        handleUpdateErrorInfo(errorInfo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getBranchFailedStatus, getCrewFailedStatus, getRepoFailedStatus, isLoading]);

  const handleOnUpdateOrganization = (id: number, label: string, value: string | []): void => {
    onUpdateSourceControl(id, label, value);
    getSourceControlRepoInfo(value.toString(), dateRanges, id);
  };

  const handleOnUpdateRepo = (id: number, label: string, value: string | []): void => {
    onUpdateSourceControl(id, label, value);
    getSourceControlBranchInfo(organization, value.toString(), id);
  };

  const handleOnUpdateBranches = (id: number, label: string, value: string[]): void => {
    const branchNeedGetCrews = value.filter((it) => selectedBranches?.every((branch) => branch !== it));
    onUpdateSourceControl(id, label, value);
    Promise.all(
      branchNeedGetCrews.map((branch) => getSourceControlCrewInfo(organization, repo, branch, dateRanges)),
    ).then(() => {
      dispatch(updateShouldGetSourceControlConfig(false));
    });
  };

  return (
    <PipelineMetricSelectionWrapper>
      {isLoading && <Loading />}
      {isDuplicated && <WarningMessage>This source control is the same as another one!</WarningMessage>}
      <SingleSelection
        id={id}
        options={organizationNameOptions}
        label={'Organization'}
        value={organization}
        onUpdate={handleOnUpdateOrganization}
      />
      {organization && (
        <SingleSelection id={id} options={repoNameOptions} label={'Repo'} value={repo} onUpdate={handleOnUpdateRepo} />
      )}
      {organization && repo && (
        <SourceControlBranch {...sourceControlSetting} branches={branchNameOptions} onUpdate={handleOnUpdateBranches} />
      )}
      <ButtonWrapper>
        {isShowRemoveButton && (
          <RemoveButton data-test-id={'remove-button'} onClick={handleRemoveClick}>
            Remove
          </RemoveButton>
        )}
      </ButtonWrapper>
    </PipelineMetricSelectionWrapper>
  );
};
