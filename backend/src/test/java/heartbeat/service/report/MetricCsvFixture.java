package heartbeat.service.report;

import heartbeat.controller.report.dto.response.Classification;
import heartbeat.controller.report.dto.response.ClassificationNameValuePair;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.controller.report.dto.response.Rework;
import heartbeat.controller.report.dto.response.Velocity;
import heartbeat.controller.report.dto.response.CycleTime;
import heartbeat.controller.report.dto.response.CycleTimeForSelectedStepItem;
import heartbeat.controller.report.dto.response.DeploymentFrequency;
import heartbeat.controller.report.dto.response.AvgDeploymentFrequency;
import heartbeat.controller.report.dto.response.DeploymentFrequencyOfPipeline;
import heartbeat.controller.report.dto.response.DailyDeploymentCount;
import heartbeat.controller.report.dto.response.DevChangeFailureRate;
import heartbeat.controller.report.dto.response.AvgDevChangeFailureRate;
import heartbeat.controller.report.dto.response.DevChangeFailureRateOfPipeline;
import heartbeat.controller.report.dto.response.DevMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.AvgDevMeanTimeToRecovery;
import heartbeat.controller.report.dto.response.DevMeanTimeToRecoveryOfPipeline;
import heartbeat.controller.report.dto.response.LeadTimeForChanges;
import heartbeat.controller.report.dto.response.LeadTimeForChangesOfPipelines;
import heartbeat.controller.report.dto.response.AvgLeadTimeForChanges;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MetricCsvFixture {

	public static ReportResponse MOCK_METRIC_CSV_DATA() {
		return ReportResponse.builder()
			.velocity(Velocity.builder().velocityForCards(2).velocityForSP(7).build())
			.classificationList(List.of(Classification.builder()
				.fieldName("Issue Type")
				.pairList(List.of(ClassificationNameValuePair.builder().name("Bug").value(0.3333333333333333).build(),
						ClassificationNameValuePair.builder().name("Story").value(0.6666666666666666).build()))
				.build()))
			.cycleTime(CycleTime.builder()
				.totalTimeForCards(29.26)
				.averageCycleTimePerCard(9.75)
				.averageCycleTimePerSP(4.18)
				.swimlaneList(new ArrayList<>(List.of(
						CycleTimeForSelectedStepItem.builder()
							.optionalItemName("In Dev")
							.averageTimeForSP(2.6)
							.averageTimeForCards(6.06)
							.totalTime(18.17)
							.build(),
						CycleTimeForSelectedStepItem.builder()
							.optionalItemName("Analysis")
							.averageTimeForSP(12.6)
							.averageTimeForCards(26.06)
							.totalTime(318.17)
							.build(),
						CycleTimeForSelectedStepItem.builder()
							.optionalItemName("Block")
							.averageTimeForSP(0.01)
							.averageTimeForCards(0.03)
							.totalTime(0.1)
							.build(),
						CycleTimeForSelectedStepItem.builder()
							.optionalItemName("Review")
							.averageTimeForSP(1.56)
							.averageTimeForCards(3.65)
							.totalTime(10.94)
							.build(),
						CycleTimeForSelectedStepItem.builder()
							.optionalItemName("Testing")
							.averageTimeForSP(0.01)
							.averageTimeForCards(0.02)
							.totalTime(0.05)
							.build(),
						CycleTimeForSelectedStepItem.builder()
							.optionalItemName("Other step name")
							.averageTimeForSP(0.01)
							.averageTimeForCards(0.02)
							.totalTime(0.05)
							.build())))
				.build())
			.deploymentFrequency(DeploymentFrequency.builder()
				.avgDeploymentFrequency(
						AvgDeploymentFrequency.builder().name("Average").deploymentFrequency(0.67F).build())
				.deploymentFrequencyOfPipelines(List.of(
						DeploymentFrequencyOfPipeline.builder()
							.name("Heartbeat")
							.step(":rocket: Deploy prod")
							.deploymentFrequency(0.78F)
							.dailyDeploymentCounts(
									List.of(DailyDeploymentCount.builder().date("10/16/2023").count(1).build()))
							.build(),
						DeploymentFrequencyOfPipeline.builder()
							.name("Heartbeat")
							.step(":mag: Check Frontend License")
							.deploymentFrequency(0.56F)
							.dailyDeploymentCounts(
									List.of(DailyDeploymentCount.builder().date("10/16/2023").count(1).build()))
							.build()))
				.build())
			.devChangeFailureRate(DevChangeFailureRate.builder()
				.avgDevChangeFailureRate(AvgDevChangeFailureRate.builder()
					.name("Average")
					.totalTimes(12)
					.totalFailedTimes(0)
					.failureRate(0.0F)
					.build())
				.devChangeFailureRateOfPipelines(List.of(
						DevChangeFailureRateOfPipeline.builder()
							.name("Heartbeat")
							.step(":rocket: Deploy prod")
							.failedTimesOfPipeline(0)
							.totalTimesOfPipeline(7)
							.failureRate(0.0F)
							.build(),
						DevChangeFailureRateOfPipeline.builder()
							.name("Heartbeat")
							.step(":mag: Check Frontend License")
							.failedTimesOfPipeline(0)
							.totalTimesOfPipeline(5)
							.failureRate(0.0F)
							.build()))
				.build())
			.devMeanTimeToRecovery(DevMeanTimeToRecovery.builder()
				.avgDevMeanTimeToRecovery(
						AvgDevMeanTimeToRecovery.builder().timeToRecovery(BigDecimal.valueOf(0)).build())
				.devMeanTimeToRecoveryOfPipelines(List.of(
						DevMeanTimeToRecoveryOfPipeline.builder()
							.timeToRecovery(BigDecimal.valueOf(0))
							.name("Heartbeat")
							.step(":rocket: Deploy prod")
							.build(),
						DevMeanTimeToRecoveryOfPipeline.builder()
							.timeToRecovery(BigDecimal.valueOf(0))
							.name("Heartbeat")
							.step(":mag: Check Frontend License")
							.build()))
				.build())
			.leadTimeForChanges(LeadTimeForChanges.builder()
				.leadTimeForChangesOfPipelines(List.of(
						LeadTimeForChangesOfPipelines.builder()
							.name("Heartbeat")
							.step(":rocket: Deploy prod")
							.prLeadTime(0.0)
							.pipelineLeadTime(1.01)
							.totalDelayTime(1.01)
							.build(),
						LeadTimeForChangesOfPipelines.builder()
							.name("Heartbeat")
							.step(":mag: Check Frontend License")
							.prLeadTime(0.0)
							.pipelineLeadTime(5.18)
							.totalDelayTime(5.18)
							.build()))
				.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
					.name("Average")
					.prLeadTime(0.0)
					.pipelineLeadTime(3.0949999999999998)
					.totalDelayTime(3.0949999999999998)
					.build())
				.build())
			.build();
	}

	public static ReportResponse MOCK_EMPTY_METRIC_CSV_DATA() {
		return ReportResponse.builder().build();
	}

	public static ReportResponse MOCK_METRIC_CSV_DATA_WITH_ONE_PIPELINE() {
		return ReportResponse.builder()
			.rework(Rework.builder().totalReworkTimes(3).totalReworkCards(3).reworkCardsRatio(0.99).build())
			.deploymentFrequency(DeploymentFrequency.builder()
				.avgDeploymentFrequency(
						AvgDeploymentFrequency.builder().name("Average").deploymentFrequency(0.67F).build())
				.deploymentFrequencyOfPipelines(List.of(DeploymentFrequencyOfPipeline.builder()
					.name("Heartbeat")
					.step(":rocket: Deploy prod")
					.deploymentFrequency(0.78F)
					.dailyDeploymentCounts(List.of(DailyDeploymentCount.builder().date("10/16/2023").count(1).build()))
					.build()))
				.build())
			.devChangeFailureRate(DevChangeFailureRate.builder()
				.avgDevChangeFailureRate(AvgDevChangeFailureRate.builder()
					.name("Average")
					.totalTimes(12)
					.totalFailedTimes(0)
					.failureRate(0.0F)
					.build())
				.devChangeFailureRateOfPipelines(List.of(DevChangeFailureRateOfPipeline.builder()
					.name("Heartbeat")
					.step(":rocket: Deploy prod")
					.failedTimesOfPipeline(0)
					.totalTimesOfPipeline(7)
					.failureRate(0.0F)
					.build()))
				.build())
			.devMeanTimeToRecovery(DevMeanTimeToRecovery.builder()
				.avgDevMeanTimeToRecovery(
						AvgDevMeanTimeToRecovery.builder().timeToRecovery(BigDecimal.valueOf(0)).build())
				.devMeanTimeToRecoveryOfPipelines(List.of(DevMeanTimeToRecoveryOfPipeline.builder()
					.timeToRecovery(BigDecimal.valueOf(0))
					.name("Heartbeat")
					.step(":rocket: Deploy prod")
					.build()))
				.build())
			.leadTimeForChanges(LeadTimeForChanges.builder()
				.leadTimeForChangesOfPipelines(List.of(LeadTimeForChangesOfPipelines.builder()
					.name("Heartbeat")
					.step(":rocket: Deploy prod")
					.prLeadTime(0.0)
					.pipelineLeadTime(1.01)
					.totalDelayTime(1.01)
					.build()))
				.avgLeadTimeForChanges(AvgLeadTimeForChanges.builder()
					.name("Average")
					.prLeadTime(0.0)
					.pipelineLeadTime(3.0949999999999998)
					.totalDelayTime(3.0949999999999998)
					.build())
				.build())
			.build();
	}

}
