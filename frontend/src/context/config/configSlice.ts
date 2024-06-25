import {
  BOARD_METRICS,
  BOARD_METRICS_EXCLUDE_CLASSIFICATION,
  Calendar,
  DORA_METRICS,
  IMPORT_METRICS_MAPPING,
  MAX_TIME_RANGE_AMOUNT,
  MESSAGE,
  RequiredData,
} from '@src/constants/resources';
import { initialPipelineToolState, IPipelineToolState } from '@src/context/config/pipelineTool/pipelineToolSlice';
import { initialSourceControlState, ISourceControl } from '@src/context/config/sourceControl/sourceControlSlice';
import { IBoardState, initialBoardState } from '@src/context/config/board/boardSlice';
import { IPipeline } from '@src/context/config/pipelineTool/verifyResponseSlice';
import { uniqPipelineListCrews, updateResponseCrews } from '@src/utils/util';
import { SortType } from '@src/containers/ConfigStep/DateRangePicker/types';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@src/store';
import merge from 'lodash/merge';
import { isArray } from 'lodash';
import dayjs from 'dayjs';
export interface DateRange {
  startDate: string | null;
  endDate: string | null;
  disabled?: boolean;
}

export type DateRangeList = DateRange[];

export interface BasicConfigState {
  isProjectCreated: boolean;
  basic: {
    projectName: string;
    calendarType: Calendar;
    dateRange: DateRangeList;
    sortType: SortType;
    metrics: string[];
  };
  board: IBoardState;
  pipelineTool: IPipelineToolState;
  sourceControl: ISourceControl;
  warningMessage: string | null;
}

export const initialBasicConfigState: BasicConfigState = {
  isProjectCreated: true,
  basic: {
    projectName: '',
    calendarType: Calendar.Regular,
    dateRange: [
      {
        startDate: null,
        endDate: null,
      },
    ],
    sortType: SortType.DEFAULT,
    metrics: [],
  },
  board: initialBoardState,
  pipelineTool: initialPipelineToolState,
  sourceControl: initialSourceControlState,
  warningMessage: null,
};

const getMetricsInfo = (metrics: string[]) => {
  const {
    Velocity: VELOCITY,
    CycleTime: CYCLE_TIME,
    Classification: CLASSIFICATION,
    LeadTimeForChanges: LEAD_TIME_FOR_CHANGES,
    DeploymentFrequency: DEPLOYMENT_FREQUENCY,
    DevChangeFailureRate: DEV_CHANGE_FAILURE_RATE,
    DevMeanTimeToRecovery: DEV_MEAN_TIME_TO_RECOVERY,
    ReworkTimes: REWORK_TIMES,
  } = RequiredData;
  return {
    metrics: metrics
      .map((metric) => IMPORT_METRICS_MAPPING[metric])
      .filter((metric) => (Object.values(RequiredData) as string[]).includes(metric)),
    shouldBoardShow: [VELOCITY, CYCLE_TIME, CLASSIFICATION, REWORK_TIMES].some((metric) => metrics.includes(metric)),
    shouldPipelineToolShow: [
      LEAD_TIME_FOR_CHANGES,
      DEPLOYMENT_FREQUENCY,
      DEV_CHANGE_FAILURE_RATE,
      DEV_MEAN_TIME_TO_RECOVERY,
    ].some((metric) => metrics.includes(metric)),
    shouldSourceControlShow: [LEAD_TIME_FOR_CHANGES].some((metric) => metrics.includes(metric)),
  };
};

const isSortType = (value: string): value is SortType => Object.values(SortType).includes(value as SortType);

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...initialBasicConfigState,
    board: { ...initialBoardState },
    pipelineTool: { ...initialPipelineToolState },
    sourceControl: { ...initialSourceControlState },
  },
  reducers: {
    updateProjectName: (state, action) => {
      state.basic.projectName = action.payload;
    },
    updateCalendarType: (state, action) => {
      state.basic.calendarType = action.payload;
    },
    updateDateRange: (state, action) => {
      state.basic.dateRange = action.payload;
    },
    updateDateRangeSortType: (state, action) => {
      state.basic.sortType = action.payload;
    },
    updateMetrics: (state, action) => {
      const { metrics, shouldBoardShow, shouldPipelineToolShow, shouldSourceControlShow } = getMetricsInfo(
        action.payload,
      );
      state.basic.metrics = metrics;
      state.board.isShow = shouldBoardShow;
      state.pipelineTool.isShow = shouldPipelineToolShow;
      state.sourceControl.isShow = shouldSourceControlShow;
    },
    updateBasicConfigState: (state, action) => {
      state.basic = action.payload;
      const { metrics, shouldBoardShow, shouldPipelineToolShow, shouldSourceControlShow } = getMetricsInfo(
        action.payload.metrics,
      );
      let importedDateRanges = action.payload.dateRange;
      importedDateRanges =
        importedDateRanges && importedDateRanges?.startDate && importedDateRanges?.endDate
          ? [importedDateRanges]
          : importedDateRanges;
      state.basic.dateRange =
        Array.isArray(importedDateRanges) && importedDateRanges.length > MAX_TIME_RANGE_AMOUNT
          ? importedDateRanges.slice(0, MAX_TIME_RANGE_AMOUNT)
          : importedDateRanges;
      const importedSortType = action.payload.sortType;
      action.payload.sortType = isSortType(importedSortType) ? importedSortType : SortType.DEFAULT;
      state.basic.metrics = metrics;
      state.board.isShow = shouldBoardShow;
      state.pipelineTool.isShow = shouldPipelineToolShow;
      state.sourceControl.isShow = shouldSourceControlShow;
      const { projectName } = state.basic;
      if (!state.isProjectCreated) {
        state.warningMessage =
          projectName &&
          isArray(importedDateRanges) &&
          importedDateRanges.length > 0 &&
          importedDateRanges.length <= 6 &&
          metrics.length > 0 &&
          ((importedDateRanges.length === 1 && !importedSortType) || isSortType(importedSortType))
            ? null
            : MESSAGE.CONFIG_PAGE_VERIFY_IMPORT_ERROR;
      }
      state.board.config = merge(action.payload.board, { type: 'Jira' });
      state.pipelineTool.config = action.payload.pipelineTool || state.pipelineTool.config;
      state.sourceControl.config = action.payload.sourceControl || state.sourceControl.config;
    },
    updateProjectCreatedState: (state, action) => {
      state.isProjectCreated = action.payload;
    },
    updateBoard: (state, action) => {
      state.board.config = action.payload;
    },
    updateJiraVerifyResponse: (state, action) => {
      const { jiraColumns, targetFields, users } = action.payload;
      state.board.verifiedResponse.jiraColumns = jiraColumns;
      state.board.verifiedResponse.targetFields = targetFields;
      state.board.verifiedResponse.users = users;
    },
    updatePipelineTool: (state, action) => {
      state.pipelineTool.config = action.payload;
    },
    updatePipelineToolVerifyResponse: (state, action) => {
      const { pipelineList } = action.payload;
      state.pipelineTool.verifiedResponse.pipelineList = pipelineList.map((pipeline: IPipeline) => ({
        ...pipeline,
        steps: [],
      }));
    },
    updatePipelineToolVerifyResponseSteps: (state, action) => {
      const { organization, pipelineName, steps, branches, pipelineCrews } = action.payload;
      state.pipelineTool.verifiedResponse.pipelineList = state.pipelineTool.verifiedResponse.pipelineList.map(
        (pipeline) =>
          pipeline.name === pipelineName && pipeline.orgName === organization
            ? {
                ...pipeline,
                branches: branches,
                steps: steps,
                crews: pipelineCrews,
              }
            : pipeline,
      );
    },
    updateSourceControl: (state, action) => {
      state.sourceControl.config = action.payload;
    },
    updateSourceControlVerifiedResponse: (state, action) => {
      const { githubRepos } = action.payload;
      state.sourceControl.verifiedResponse.repoList = githubRepos;
    },
    updatePipelineToolVerifyResponseCrews: (state, action) => {
      const { organization, pipelineName } = action.payload;
      state.pipelineTool.verifiedResponse.pipelineList = updateResponseCrews(
        organization,
        pipelineName,
        state.pipelineTool.verifiedResponse.pipelineList,
      );
    },
    resetImportedData: () => initialBasicConfigState,
  },
});
export const {
  updateProjectCreatedState,
  updateProjectName,
  updateCalendarType,
  updateDateRange,
  updateDateRangeSortType,
  updateMetrics,
  updateBoard,
  updateJiraVerifyResponse,
  updateBasicConfigState,
  updatePipelineTool,
  updatePipelineToolVerifyResponse,
  updateSourceControl,
  updateSourceControlVerifiedResponse,
  updatePipelineToolVerifyResponseSteps,
  resetImportedData,
  updatePipelineToolVerifyResponseCrews,
} = configSlice.actions;

export const selectBasicInfo = (state: RootState) => state.config.basic;
export const selectDateRange = (state: RootState) => state.config.basic.dateRange;
export const selectDateRangeSortType = (state: RootState) => state.config.basic.sortType;
export const selectMetrics = (state: RootState) => state.config.basic.metrics;
export const isSelectBoardMetrics = (state: RootState) =>
  state.config.basic.metrics.some((metric) => BOARD_METRICS.includes(metric));
export const isSelectDoraMetrics = (state: RootState) =>
  state.config.basic.metrics.some((metric) => DORA_METRICS.includes(metric));
export const isOnlySelectClassification = (state: RootState) =>
  state.config.basic.metrics.length === 1 && state.config.basic.metrics[0] === RequiredData.Classification;
export const isSelectDoraMetricsAndClassification = (state: RootState) =>
  state.config.basic.metrics.some((metric) => DORA_METRICS.includes(metric)) &&
  state.config.basic.metrics.includes(RequiredData.Classification) &&
  !state.config.basic.metrics.some((metric) => BOARD_METRICS_EXCLUDE_CLASSIFICATION.includes(metric));
export const selectBoard = (state: RootState) => state.config.board.config;
export const selectPipelineTool = (state: RootState) => state.config.pipelineTool.config;
export const selectSourceControl = (state: RootState) => state.config.sourceControl.config;
export const selectWarningMessage = (state: RootState) => state.config.warningMessage;
export const selectConfig = (state: RootState) => state.config;
export const selectUsers = (state: RootState) => state.config.board.verifiedResponse.users;
export const selectJiraColumns = (state: RootState) => state.config.board.verifiedResponse.jiraColumns;
export const selectIsProjectCreated = (state: RootState) => state.config.isProjectCreated;
export const selectPipelineOrganizations = (state: RootState) => [
  ...new Set(state.config.pipelineTool.verifiedResponse.pipelineList.map((item) => item.orgName)),
];

export const selectPipelineNames = (state: RootState, organization: string) =>
  state.config.pipelineTool.verifiedResponse.pipelineList
    .filter((pipeline) => pipeline.orgName === organization)
    .map((item) => item.name)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

export const selectStepsParams = (state: RootState, organizationName: string, pipelineName: string) => {
  const pipeline = state.config.pipelineTool.verifiedResponse.pipelineList.find(
    (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organizationName,
  );

  const pipelineType = state.config.pipelineTool.config.type;
  const token = state.config.pipelineTool.config.token;

  return {
    buildId: pipeline?.id ?? '',
    organizationId: pipeline?.orgId ?? '',
    pipelineType,
    token,
    params: state.config.basic.dateRange.map((dateRange) => {
      return {
        pipelineName: pipeline?.name ?? '',
        repository: pipeline?.repository ?? '',
        orgName: pipeline?.orgName ?? '',
        startTime: dayjs(dateRange.startDate).startOf('date').valueOf(),
        endTime: dayjs(dateRange.endDate).endOf('date').valueOf(),
      };
    }),
  };
};

export const selectPipelineList = (state: RootState) => state.config.pipelineTool.verifiedResponse.pipelineList;

export const selectSteps = (state: RootState, organizationName: string, pipelineName: string) =>
  state.config.pipelineTool.verifiedResponse.pipelineList.find(
    (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organizationName,
  )?.steps ?? [];

export const selectPipelineCrews = (state: RootState) => {
  const { pipelineList } = state.config.pipelineTool.verifiedResponse;
  return uniqPipelineListCrews(pipelineList);
};

export default configSlice.reducer;
