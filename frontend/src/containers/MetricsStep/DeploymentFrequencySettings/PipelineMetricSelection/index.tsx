import {
  selectOrganizationWarningMessage,
  selectPipelineNameWarningMessage,
  selectStepWarningMessage,
  updatePipelineStep,
  updateShouldGetPipelineConfig,
  selectShouldGetPipelineConfig,
} from '@src/context/Metrics/metricsSlice';
import {
  selectPipelineNames,
  selectPipelineOrganizations,
  selectSteps,
  selectStepsParams,
  updatePipelineToolVerifyResponseSteps,
} from '@src/context/config/configSlice';

import { SingleSelection } from '@src/containers/MetricsStep/DeploymentFrequencySettings/SingleSelection';
import { BranchSelection } from '@src/containers/MetricsStep/DeploymentFrequencySettings/BranchSelection';
import { ButtonWrapper, PipelineMetricSelectionWrapper, RemoveButton, WarningMessage } from './style';
import { WarningNotification } from '@src/components/Common/WarningNotification';
import { useGetMetricsStepsEffect } from '@src/hooks/useGetMetricsStepsEffect';
import { MESSAGE, NO_PIPELINE_STEP_ERROR } from '@src/constants/resources';
import { ErrorNotification } from '@src/components/ErrorNotification';
import { shouldMetricsLoad } from '@src/context/stepper/StepperSlice';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@src/hooks';
import { Loading } from '@src/components/Loading';
import { store } from '@src/store';

interface pipelineMetricSelectionProps {
  type: string;
  pipelineSetting: {
    id: number;
    organization: string;
    pipelineName: string;
    step: string;
    branches: string[];
  };
  isInfoLoading: boolean;
  isShowRemoveButton: boolean;
  onRemovePipeline: (id: number) => void;
  onUpdatePipeline: (id: number, label: string, value: string | StringConstructor[] | unknown) => void;
  isDuplicated: boolean;
  setLoadingCompletedNumber: (updateFunction: (prevValue: number) => number) => void;
  totalPipelineNumber: number;
}

export const PipelineMetricSelection = ({
  type,
  pipelineSetting,
  isShowRemoveButton,
  onRemovePipeline,
  onUpdatePipeline,
  isDuplicated,
  isInfoLoading,
  setLoadingCompletedNumber,
  totalPipelineNumber,
}: pipelineMetricSelectionProps) => {
  const { id, organization, pipelineName, step } = pipelineSetting;
  const dispatch = useAppDispatch();
  const { isLoading, errorMessage, getSteps } = useGetMetricsStepsEffect();
  const organizationNameOptions = selectPipelineOrganizations(store.getState());
  const pipelineNameOptions = selectPipelineNames(store.getState(), organization);
  const stepsOptions = selectSteps(store.getState(), organization, pipelineName);
  const organizationWarningMessage = selectOrganizationWarningMessage(store.getState(), id);
  const pipelineNameWarningMessage = selectPipelineNameWarningMessage(store.getState(), id);
  const stepWarningMessage = selectStepWarningMessage(store.getState(), id);
  const [isShowNoStepWarning, setIsShowNoStepWarning] = useState(false);
  const shouldLoad = useAppSelector(shouldMetricsLoad);
  const shouldGetPipelineConfig = useAppSelector(selectShouldGetPipelineConfig);
  const isLoadingRef = useRef(false);

  const validStepValue = useMemo<string>(() => (stepsOptions.includes(step) ? step : ''), [step, stepsOptions]);

  const handleRemoveClick = () => {
    onRemovePipeline(id);
    setLoadingCompletedNumber((value) => value - 1);
  };

  useEffect(() => {
    !isInfoLoading && shouldLoad && shouldGetPipelineConfig && pipelineName && handleGetPipelineData(pipelineName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoad, pipelineName, isInfoLoading, shouldGetPipelineConfig]);

  useEffect(() => {
    if (isLoadingRef.current && !isLoading) {
      setLoadingCompletedNumber((value) => totalPipelineNumber > value ? value + 1 : value);
    }
    isLoadingRef.current = isLoading;
  }, [isLoading, setLoadingCompletedNumber]);

  const handleGetPipelineData = (_pipelineName: string) => {
    const { params, buildId, organizationId, pipelineType, token } = selectStepsParams(
      store.getState(),
      organization,
      _pipelineName,
    );
    getSteps(params, organizationId, buildId, pipelineType, token).then((res) => {
      if (res && !res.haveStep) {
        isShowRemoveButton && handleRemoveClick();
      } else {
        const steps = res?.response ?? [];
        const branches = res?.branches ?? [];
        const pipelineCrews = res?.pipelineCrews ?? [];
        dispatch(
          updatePipelineToolVerifyResponseSteps({
            organization,
            pipelineName: _pipelineName,
            steps,
            branches,
            pipelineCrews,
          }),
        );
        res?.haveStep && dispatch(updatePipelineStep({ steps, id, type, branches, pipelineCrews }));
        dispatch(updateShouldGetPipelineConfig(false));
      }
      res && setIsShowNoStepWarning(!res.haveStep);
    });
  };

  return (
    <PipelineMetricSelectionWrapper>
      {organizationWarningMessage && <WarningNotification message={organizationWarningMessage} />}
      {pipelineNameWarningMessage && <WarningNotification message={pipelineNameWarningMessage} />}
      {stepWarningMessage && <WarningNotification message={stepWarningMessage} />}
      {isShowNoStepWarning && <WarningNotification message={MESSAGE.NO_STEP_WARNING} />}
      {isLoading && <Loading message={'step loading'} />}
      {isDuplicated && <WarningMessage>This pipeline is the same as another one!</WarningMessage>}
      {errorMessage && <ErrorNotification message={errorMessage} />}
      <SingleSelection
        id={id}
        options={organizationNameOptions}
        label={'Organization'}
        value={organization}
        onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
      />
      {organization && (
        <SingleSelection
          id={id}
          options={pipelineNameOptions}
          label={'Pipeline Name'}
          value={pipelineName}
          onGetSteps={handleGetPipelineData}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        />
      )}
      {organization && pipelineName && (
        <SingleSelection
          id={id}
          options={stepsOptions}
          label={'Step'}
          value={validStepValue}
          isError={isShowNoStepWarning}
          errorText={NO_PIPELINE_STEP_ERROR}
          onUpDatePipeline={(id, label, value) => onUpdatePipeline(id, label, value)}
        />
      )}
      {organization && pipelineName && (
        <BranchSelection {...pipelineSetting} onUpdatePipeline={onUpdatePipeline} isStepLoading={isLoading} />
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
