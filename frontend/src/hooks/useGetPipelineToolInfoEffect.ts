import {
  updatePipelineToolVerifyResponse,
  selectIsProjectCreated,
  selectPipelineTool,
} from '@src/context/config/configSlice';
import { pipelineToolClient, IGetPipelineToolInfoResult } from '@src/clients/pipeline/PipelineToolClient';
import { selectShouldGetPipelineConfig, updatePipelineSettings } from '@src/context/Metrics/metricsSlice';
import { clearMetricsPipelineFormMeta } from '@src/context/meta/metaSlice';
import { shouldMetricsLoaded } from '@src/context/stepper/StepperSlice';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@src/hooks';

export interface IUseVerifyPipeLineToolStateInterface {
  result: IGetPipelineToolInfoResult;
  isLoading: boolean;
  apiCallFunc: () => void;
  isFirstFetch: boolean;
}

export const useGetPipelineToolInfoEffect = (): IUseVerifyPipeLineToolStateInterface => {
  const defaultInfoStructure = {
    code: 200,
    errorTitle: '',
    errorMessage: '',
  };
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const apiTouchedRef = useRef(false);
  const [info, setInfo] = useState<IGetPipelineToolInfoResult>(defaultInfoStructure);
  const isProjectCreated = useAppSelector(selectIsProjectCreated);
  const restoredPipelineTool = useAppSelector(selectPipelineTool);
  const shouldLoad = useAppSelector(shouldMetricsLoaded);
  const shouldGetPipelineConfig = useAppSelector(selectShouldGetPipelineConfig);
  const [isFirstFetch, setIsFirstFetch] = useState(shouldGetPipelineConfig);

  const getPipelineToolInfo = useCallback(async () => {
    const params = {
      type: restoredPipelineTool.type,
      token: restoredPipelineTool.token,
    };
    setIsLoading(true);
    try {
      const response = await pipelineToolClient.getInfo(params);
      setInfo(response);
      dispatch(updatePipelineToolVerifyResponse(response.data));
      dispatch(updatePipelineSettings({ ...response.data, isProjectCreated }));
    } finally {
      setIsLoading(false);
      setIsFirstFetch(false);
    }
  }, [dispatch, isProjectCreated, restoredPipelineTool.type, restoredPipelineTool.token]);

  useEffect(() => {
    if (!apiTouchedRef.current && !isLoading && shouldLoad && shouldGetPipelineConfig) {
      apiTouchedRef.current = true;
      getPipelineToolInfo();
      dispatch(clearMetricsPipelineFormMeta());
    }
  }, [dispatch, getPipelineToolInfo, isLoading, shouldLoad, shouldGetPipelineConfig]);

  return {
    result: info,
    isLoading,
    isFirstFetch,
    apiCallFunc: getPipelineToolInfo,
  };
};
