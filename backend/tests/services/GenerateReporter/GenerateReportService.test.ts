import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../src/contract/kanban/KanbanStoryPointResponse";
import "mocha";
import { JiraCard, JiraCardField } from "../../../src/models/kanban/JiraCard";
import {
  CodebaseSetting,
  GenerateReportRequest,
  PipelineSetting,
  RequestKanbanSetting,
} from "../../../src/contract/GenerateReporter/GenerateReporterRequestBody";
import { GenerateReporterResponse } from "../../../src/contract/GenerateReporter/GenerateReporterResponse";
import sinon from "sinon";
import { GenerateReportService } from "../../../src/services/GenerateReporter/GenerateReportService";
import { changeConsiderHolidayMode } from "../../../src/services/common/WorkDayCalculate";
import { Cards } from "../../../src/models/kanban/RequestKanbanResults";
import { JiraBlockReasonEnum } from "../../../src/models/kanban/JiraBlockReasonEnum";
import { expect } from "chai";
import { SprintStatistics } from "../../../src/models/kanban/SprintStatistics";
import { Jira } from "../../../src/services/kanban/Jira/Jira";
import * as GeneraterCsvFile from "../../../src/services/common/GeneraterCsvFile";
import { RequireDataEnum } from "../../../src/models/RequireDataEnum";
import { GitHub } from "../../../src/services/codebase/GitHub";
import { SettingMissingError } from "../../../src/types/SettingMissingError";
import { Buildkite } from "../../../src/services/pipeline/Buildkite";
const sprint1Name = "test Sprint 1";
const sprint2Name = "test Sprint 2";
const jiraCardField1: JiraCardField = new JiraCardField();
const jiraCardField2: JiraCardField = new JiraCardField();
const jiraCardField3: JiraCardField = new JiraCardField();

jiraCardField1.sprint = sprint1Name;
jiraCardField1.label = JiraBlockReasonEnum.DEPENDENCIES_NOT_WORK;

jiraCardField2.sprint = sprint2Name;
jiraCardField2.label = JiraBlockReasonEnum.TAKE_LEAVE;

const jiraCard1: JiraCard = { fields: jiraCardField1, key: "" };
const jiraCard2: JiraCard = { fields: jiraCardField2, key: "" };
const jiraCard3: JiraCard = { fields: jiraCardField3, key: "" };

const kanbanSetting: RequestKanbanSetting = {
  type: "jira",
  token: "test-token",
  site: "dorametrics",
  projectKey: "ADM",
  boardId: "2",
  boardColumns: [
    {
      name: "TODO",
      value: "To do",
    },
    {
      name: "Blocked",
      value: "Block",
    },
    {
      name: "Doing",
      value: "In Dev",
    },
    {
      name: "Testing",
      value: "Testing",
    },
    {
      name: "Done",
      value: "Done",
    },
  ],
  treatFlagCardAsBlock: true,
  users: ["Huijun Hong", "Wu Jinpeng", "Xinyi Wei", "junfeng.dai"],
  targetFields: [
    {
      key: "parent",
      name: "Parent",
      flag: false,
    },
    {
      key: "issuerestriction",
      name: "Restrict to",
      flag: false,
    },
    {
      key: "issuetype",
      name: "Issue Type",
      flag: false,
    },
    {
      key: "project",
      name: "Project",
      flag: false,
    },
    {
      key: "customfield_10020",
      name: "Sprint",
      flag: false,
    },
    {
      key: "customfield_10021",
      name: "Flagged",
      flag: false,
    },
    {
      key: "customfield_10000",
      name: "Development",
      flag: false,
    },
    {
      key: "fixVersions",
      name: "Fix versions",
      flag: false,
    },
    {
      key: "priority",
      name: "Priority",
      flag: false,
    },
    {
      key: "customfield_10037",
      name: "Partner",
      flag: false,
    },
    {
      key: "customfield_10015",
      name: "Start date",
      flag: false,
    },
    {
      key: "timetracking",
      name: "Time tracking",
      flag: false,
    },
    {
      key: "labels",
      name: "Labels",
      flag: false,
    },
    {
      key: "customfield_10038",
      name: "QA",
      flag: false,
    },
    {
      key: "customfield_10016",
      name: "Story point estimate",
      flag: false,
    },
    {
      key: "customfield_10019",
      name: "Rank",
      flag: false,
    },
    {
      key: "assignee",
      name: "Assignee",
      flag: false,
    },
    {
      key: "customfield_10017",
      name: "Issue color",
      flag: false,
    },
    {
      key: "customfield_10027",
      name: "Feature/Operation",
      flag: false,
    },
  ],
  doneColumn: ["DONE", "CANCELLED"],
  teamName: "",
  teamId: "",
};
const matchedCards: JiraCardResponse[] = [
  {
    baseInfo: jiraCard1,
    cycleTime: [
      { column: "TODO", day: 0.01 },
      { column: "DOING", day: 1.3 },
      { column: "TESTING", day: 0.25 },
      { column: "DONE", day: 8.64 },
    ],
    originCycleTime: [
      { column: "TODO", day: 0.01 },
      { column: "DOING", day: 1.3 },
      { column: "TESTING", day: 0.25 },
      { column: "DONE", day: 8.64 },
    ],
    cardCycleTime: {
      name: "ADM-221",
      steps: {
        analyse: 0,
        development: 1.3,
        waiting: 0,
        testing: 0.25,
        blocked: 0,
        review: 0,
      },
      total: 1.55,
    },
    cycleTimeFlat: { TODO: 0.01, DOING: 1.3, TESTING: 0.25, DONE: 8.64 },
    totalCycleTimeDivideStoryPoints: "0.78",
    buildCycleTimeFlatObject: () => void {},
    calculateTotalCycleTimeDivideStoryPoints: () => void {},
    getCardId: sinon.fake(),
    getStatus: sinon.fake(),
    getStoryPoint: sinon.fake(),
    getTotalOrZero: sinon.fake(),
  },
  {
    baseInfo: jiraCard2,
    cycleTime: [
      { column: "BACKLOG", day: 248.73 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 2.35 },
      { column: "FLAG", day: 0 },
      { column: "BLOCKED", day: 0.96 },
      { column: "TESTING", day: 1.81 },
      { column: "DONE", day: 10.08 },
    ],
    originCycleTime: [
      { column: "BACKLOG", day: 248.73 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 2.35 },
      { column: "FLAG", day: 0 },
      { column: "BLOCKED", day: 0.96 },
      { column: "TESTING", day: 1.81 },
      { column: "DONE", day: 10.08 },
    ],
    cardCycleTime: {
      name: "ADM-212",
      steps: {
        analyse: 0,
        development: 2.35,
        waiting: 0,
        testing: 1.81,
        blocked: 0.96,
        review: 0,
      },
      total: 5.12,
    },
    cycleTimeFlat: {
      BACKLOG: 248.73,
      TODO: 0.97,
      DOING: 2.35,
      FLAG: 0,
      BLOCKED: 0.96,
      TESTING: 1.81,
      DONE: 10.08,
    },
    totalCycleTimeDivideStoryPoints: "2.56",
    buildCycleTimeFlatObject: () => void {},
    calculateTotalCycleTimeDivideStoryPoints: () => void {},
    getCardId: sinon.fake(),
    getStatus: sinon.fake(),
    getStoryPoint: sinon.fake(),
    getTotalOrZero: sinon.fake(),
  },
  {
    baseInfo: jiraCard3,
    cycleTime: [
      { column: "BACKLOG", day: 248.78 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 3.03 },
      { column: "BLOCKED", day: 0.94 },
      { column: "TESTING", day: 1.16 },
      { column: "DONE", day: 10.08 },
    ],
    originCycleTime: [
      { column: "BACKLOG", day: 248.78 },
      { column: "TODO", day: 0.97 },
      { column: "DOING", day: 3.03 },
      { column: "BLOCKED", day: 0.94 },
      { column: "TESTING", day: 1.16 },
      { column: "DONE", day: 10.08 },
    ],
    cardCycleTime: {
      name: "ADM-208",
      steps: {
        analyse: 0,
        development: 3.03,
        waiting: 0,
        testing: 1.16,
        blocked: 0.94,
        review: 0,
      },
      total: 5.13,
    },
    cycleTimeFlat: {
      BACKLOG: 248.78,
      TODO: 0.97,
      DOING: 3.03,
      BLOCKED: 0.94,
      TESTING: 1.16,
      DONE: 10.08,
    },
    totalCycleTimeDivideStoryPoints: "2.56",
    buildCycleTimeFlatObject: () => void {},
    calculateTotalCycleTimeDivideStoryPoints: () => void {},
    getCardId: sinon.fake(),
    getStatus: sinon.fake(),
    getStoryPoint: sinon.fake(),
    getTotalOrZero: sinon.fake(),
  },
];
const cards: Cards = {
  storyPointSum: 6,
  cardsNumber: 3,
  matchedCards: matchedCards,
};

const request: GenerateReportRequest = {
  metrics: ["Velocity", "Cycle time", "Classification"],
  startTime: 1640966400000,
  endTime: 1659369599000,
  considerHoliday: false,
  kanbanSetting: kanbanSetting,
  csvTimeStamp: 1660201532188,
  pipeline: new PipelineSetting(),
  codebaseSetting: new CodebaseSetting(),
};
const requestWithNullKanbanSetting: GenerateReportRequest = {
  metrics: ["Velocity", "Cycle time", "Classification"],
  startTime: 1640966400000,
  endTime: 1659369599000,
  considerHoliday: false,
  kanbanSetting: new RequestKanbanSetting(),
  csvTimeStamp: 1660201532188,
  pipeline: new PipelineSetting(),
  codebaseSetting: new CodebaseSetting(),
};
const completedCardsNumber = [
  {
    sprintName: "ADM Sprint 4",
    value: 3,
  },
];
const standardDeviation = [
  {
    sprintName: "ADM Sprint 4",
    value: {
      standardDeviation: 1.69,
      average: 3.93,
    },
  },
];
const blockedAndDevelopingPercentage = [
  {
    sprintName: "ADM Sprint 4",
    value: {
      blockedPercentage: 0.16,
      developingPercentage: 0.84,
    },
  },
];
const latestSprintBlockReason = {
  totalBlockedPercentage: 0.16,
  blockReasonPercentage: [
    {
      reasonName: "dependencies_not_work",
      percentage: 0,
    },
    {
      reasonName: "sit_env_down",
      percentage: 0,
    },
    {
      reasonName: "priority_change",
      percentage: 0,
    },
    {
      reasonName: "solution_review",
      percentage: 0,
    },
    {
      reasonName: "pr_review",
      percentage: 0,
    },
    {
      reasonName: "question_to_be_answered",
      percentage: 0,
    },
    {
      reasonName: "take_leave",
      percentage: 0,
    },
    {
      reasonName: "others",
      percentage: 0.16,
    },
  ],
};
const response: GenerateReporterResponse = {
  velocity: {
    velocityForSP: "6",
    velocityForCards: "3",
  },
  cycleTime: {
    averageCircleTimePerCard: "3.93",
    averageCycleTimePerSP: "1.97",
    totalTimeForCards: 11.8,
    swimlaneList: [
      {
        optionalItemName: "To do",
        averageTimeForSP: "0.33",
        averageTimeForCards: "0.65",
        totalTime: "1.95",
      },
      {
        optionalItemName: "In Dev",
        averageTimeForSP: "1.11",
        averageTimeForCards: "2.23",
        totalTime: "6.68",
      },
      {
        optionalItemName: "Testing",
        averageTimeForSP: "0.54",
        averageTimeForCards: "1.07",
        totalTime: "3.22",
      },
      {
        optionalItemName: "Done",
        averageTimeForSP: "4.80",
        averageTimeForCards: "9.60",
        totalTime: "28.80",
      },
      {
        optionalItemName: "Block",
        averageTimeForSP: "0.32",
        averageTimeForCards: "0.63",
        totalTime: "1.90",
      },
    ],
  },
  changeFailureRate: undefined,
  classification: [],
  completedCardsNumber: completedCardsNumber,
  standardDeviation: standardDeviation,
  blockedAndDevelopingPercentage: blockedAndDevelopingPercentage,
  deploymentFrequency: undefined,
  leadTimeForChanges: undefined,
  meanTimeToRecovery: undefined,
  latestSprintBlockReason: latestSprintBlockReason,
};
const statistics = new SprintStatistics(
  completedCardsNumber,
  standardDeviation,
  blockedAndDevelopingPercentage,
  latestSprintBlockReason
);

const pipeLineMetrics = [
  RequireDataEnum.CHANGE_FAILURE_RATE,
  RequireDataEnum.DEPLOYMENT_FREQUENCY,
  RequireDataEnum.MEAN_TIME_TO_RECOVERY,
].map((metric) => metric.toLowerCase());
const codebaseMetrics = [RequireDataEnum.LEAD_TIME_OF_CHANGES].map((metric) =>
  metric.toLowerCase()
);
const kanbanMetrics = [
  RequireDataEnum.VELOCITY,
  RequireDataEnum.CYCLE_TIME,
  RequireDataEnum.CLASSIFICATION,
].map((metric) => metric.toLowerCase());

describe("GenerateReportService", () => {
  afterEach(() => sinon.restore());
  const service = new GenerateReportService();
  const serviceProto = Object.getPrototypeOf(service);
  serviceProto.kanbanMetrics = kanbanMetrics;
  serviceProto.pipeLineMetrics = pipeLineMetrics;
  serviceProto.codebaseMetrics = codebaseMetrics;
  it("generate report with velocity & cycle time & classification", async () => {
    sinon.stub(changeConsiderHolidayMode);
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");
    const service = new GenerateReportService();
    service.setCards(cards);
    service.setKanbanSprintStatistics(statistics);

    const reportResponse = await service.generateReporter(request);
    expect(reportResponse).deep.equal(response);
  });

  it("generate report with deployment frequnency & change failure rate & mean time to recovery & lead time for changes", async () => {
    const requestWithOtherMetrics: GenerateReportRequest = {
      metrics: [
        "deployment frequency",
        "change failure rate",
        "mean time to recovery",
        "lead time for changes",
      ],
      startTime: 1640966400000,
      endTime: 1659369599000,
      considerHoliday: false,
      kanbanSetting: kanbanSetting,
      csvTimeStamp: 1660201532188,
      pipeline: new PipelineSetting(),
      codebaseSetting: new CodebaseSetting(),
    };
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");

    const deployInfo1 = {
      pipelineCreateTime: "2021-12-17T07:22:38.100Z",
      jobStartTime: "2021-12-17T07:37:36.455Z",
      jobFinishTime: "2021-12-17T07:38:08.835Z",
      commitId: "beccbf50c2a345097f10fd1f2b33a34e6df304e1",
      state: "passed",
    };
    const deployInfo2 = {
      pipelineCreateTime: "2021-12-17T07:22:38.100Z",
      jobStartTime: "2021-12-17T07:37:36.455Z",
      jobFinishTime: "2021-12-17T07:38:08.835Z",
      commitId: "beccbf50c2a345097f10fd1f2b33a34e6df304e1",
      state: "passed",
    };
    const deployTimes = {
      pipelineId: "reporting-web",
      pipelineName: "reporting-web",
      pipelineStep: ':white_check_mark: Record "qa" release',
      passed: [deployInfo1, deployInfo2],
      failed: [" ", " "],
    };
    serviceProto.deployTimesListFromDeploySetting = [deployTimes];
    serviceProto.leadTimes = [];
    const reportResponse = await serviceProto.generateReporter(
      requestWithOtherMetrics
    );
    expect(
      reportResponse.deploymentFrequency?.avgDeploymentFrequency?.name
    ).equals("Average");
    expect(
      reportResponse.changeFailureRate?.avgChangeFailureRate?.failureRate
    ).equals("50.00% (2/4)");
    expect(
      reportResponse.meanTimeToRecovery?.avgMeanTimeToRecovery?.name
    ).equals("Average");
    expect(
      reportResponse.leadTimeForChanges?.avgLeadTimeForChanges?.name
    ).equals("Average");
  });

  it("fetch original data with kanban metric", async () => {
    request.metrics = ["Velocity", "Cycle time", "Classification"];
    const fetchDataFromKanban = sinon.stub(
      GenerateReportService.prototype,
      <any>"fetchDataFromKanban"
    );
    await (service as any).fetchOriginalData(request);
    expect(fetchDataFromKanban.callCount).equal(1);
  });

  it("should throw error when metrics does not exist", async () => {
    sinon.stub(GenerateReportService.prototype, <any>"fetchOriginalData");
    sinon.stub(GenerateReportService.prototype, <any>"generateCsvForPipeline");
    const requestWithoutMatchedMetrics: GenerateReportRequest = {
      metrics: ["test"],
      startTime: 1640966400000,
      endTime: 1659369599000,
      considerHoliday: false,
      kanbanSetting: kanbanSetting,
      csvTimeStamp: 1660201532188,
      pipeline: new PipelineSetting(),
      codebaseSetting: new CodebaseSetting(),
    };
    try {
      await service.generateReporter(requestWithoutMatchedMetrics);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        expect(err.message).equals("can not match this metric: test");
      }
    }
  });

  it("fetch original data with codebse metrics", async () => {
    const fetchDataFromCodebase = sinon.stub(
      GenerateReportService.prototype,
      <any>"fetchDataFromCodebase"
    );
    request.metrics = ["lead time for changes"];
    request.codebaseSetting = new CodebaseSetting();
    request.codebaseSetting.type = "Github";
    request.codebaseSetting.token = "abc";
    request.pipeline = new PipelineSetting();
    request.pipeline.type = "buildkite";
    request.pipeline.token = "abc";

    await serviceProto.fetchOriginalData(request);
    expect(fetchDataFromCodebase.callCount).equal(1);
  });

  it("fetch original data with pipeline metrics", async () => {
    const fetchDataFromPipeline = sinon.stub(
      GenerateReportService.prototype,
      <any>"fetchDataFromPipeline"
    );
    request.metrics = ["change failure rate"];
    request.pipeline = new PipelineSetting();
    request.pipeline.type = "buildkite";
    await serviceProto.fetchOriginalData(request);
    expect(fetchDataFromPipeline.callCount).equal(1);
  });

  it("should throw error when fetching original data without kanban setting", async () => {
    try {
      await serviceProto.fetchOriginalData(requestWithNullKanbanSetting);
    } catch (err) {
      if (err instanceof SettingMissingError) {
        expect(err.message).equals(
          new SettingMissingError("kanban setting").message
        );
      }
    }
  });

  it("should throw error when fetching original data without pipeline setting", async () => {
    request.metrics = ["CHANGE_FAILURE_RATE"];
    request.pipeline = new PipelineSetting();
    try {
      await serviceProto.fetchOriginalData(request);
    } catch (err) {
      if (err instanceof SettingMissingError) {
        expect(err.message).equals(
          new SettingMissingError("pipeline setting").message
        );
      }
    }
  });

  it("should throw error when fetching original data without codebase or pipeline setting", async () => {
    request.metrics = ["lead time for changes"];
    request.codebaseSetting = new CodebaseSetting();
    try {
      await serviceProto.fetchOriginalData(request);
    } catch (err) {
      if (err instanceof SettingMissingError) {
        expect(err.message).equals(
          new SettingMissingError("codebase setting or pipeline setting")
            .message
        );
      }
    }
  });
});
describe("fetch data ", () => {
  afterEach(() => sinon.restore());
  const service = new GenerateReportService();
  const serviceProto = Object.getPrototypeOf(service);
  serviceProto.kanbanMetrics = kanbanMetrics;
  serviceProto.pipeLineMetrics = pipeLineMetrics;
  serviceProto.codebaseMetrics = codebaseMetrics;
  it("fetch data from Kanban ", async () => {
    sinon
      .stub(Jira.prototype, "getStoryPointsAndCycleTime")
      .returns(Promise.resolve(cards));
    sinon
      .stub(Jira.prototype, "getSprintStatistics")
      .returns(Promise.resolve(statistics));
    sinon
      .stub(Jira.prototype, "getStoryPointsAndCycleTimeForNonDoneCards")
      .returns(Promise.resolve(cards));
    sinon.stub(Jira.prototype, "getColumns");
    sinon.stub(GeneraterCsvFile, "ConvertBoardDataToCsv");

    await serviceProto.fetchDataFromKanban(request);

    expect(serviceProto.cards).deep.equal(cards);
    expect(serviceProto.kanabanSprintStatistics).deep.equal(statistics);
  });

  it("fetch data from codebase ", async () => {
    const leadTime1 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web",
      name: "sme-web",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/MYOB-Technology/sme-web",
    };
    const leadTime2 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web-bff",
      name: "sme-web-bff",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/MYOB-Technology/sme-web-bff",
    };
    request.codebaseSetting = {
      type: "Github",
      token: " test-token ",
      leadTime: [leadTime1, leadTime2],
    };
    const deployment1 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web",
      name: "sme-web",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/MYOB-Technology/sme-web",
    };
    const deployment2 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web-bff",
      name: "sme-web-bff",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/MYOB-Technology/sme-web-bff",
    };
    request.pipeline = {
      type: "BuildKite",
      token: "test-token",
      deployment: [deployment1, deployment2],
    };
    sinon.stub(Buildkite.prototype, "fetchPipelineBuilds");
    sinon.stub(Buildkite.prototype, "countDeployTimes");

    serviceProto.deployTimesListFromLeadTimeSetting = [];
    serviceProto.BuildInfosOfLeadtimes = [];

    sinon.stub(GitHub.prototype, "fetchPipelinesLeadTime");
    await serviceProto.fetchDataFromCodebase(
      request,
      1640966400000,
      1659369599000
    );

    expect(serviceProto.deployTimesListFromLeadTimeSetting.length).equals(2);
    expect(serviceProto.BuildInfosOfLeadtimes.length).equals(2);
  });

  it("should get repo map ", async () => {
    const leadTime1 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web",
      name: "sme-web",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/MYOB-Technology/sme-web",
    };
    const leadTime2 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web-bff",
      name: "sme-web-bff",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/MYOB-Technology/sme-web-bff",
    };
    const codebaseSetting = {
      type: "Github",
      token: " test-token ",
      leadTime: [leadTime1, leadTime2],
    };
    const responseMap = await serviceProto.constructor.getRepoMap(
      codebaseSetting
    );
    const expectedMap: Map<string, string> = new Map();
    expectedMap.set("sme-web", "https://github.com/MYOB-Technology/sme-web");
    expectedMap.set(
      "sme-web-bff",
      "https://github.com/MYOB-Technology/sme-web-bff"
    );
    expect(responseMap).deep.equals(expectedMap);
  });

  it("fetch data from pipeline ", async () => {
    const deployment1 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web",
      name: "sme-web",
      step: ":rocket: :eagle: Deploy Integration App",
      repository: "https://github.com/MYOB-Technology/sme-web",
    };
    const deployment2 = {
      orgId: "myob",
      orgName: "MYOB",
      id: "sme-web-bff",
      name: "sme-web-bff",
      step: ":kubernetes: Deploy to Integration",
      repository: "https://github.com/MYOB-Technology/sme-web-bff",
    };
    request.pipeline = {
      type: "BuildKite",
      token: "test-token",
      deployment: [deployment1, deployment2],
    };
    serviceProto.deployTimesListFromDeploySetting = [];
    serviceProto.BuildInfos = [];

    sinon.stub(Buildkite.prototype, "fetchPipelineBuilds");
    sinon.stub(Buildkite.prototype, "countDeployTimes");

    await serviceProto.fetchDataFromPipeline(
      request,
      1640966400000,
      1659369599000
    );
    expect(serviceProto.deployTimesListFromDeploySetting.length).equals(2);
    expect(serviceProto.BuildInfos.length).equals(2);
  });
});
