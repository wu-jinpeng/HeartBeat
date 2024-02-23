package heartbeat.service.report;

import heartbeat.controller.board.dto.response.CardCollection;
import heartbeat.controller.report.dto.request.GenerateReportRequest;
import heartbeat.controller.report.dto.request.JiraBoardSetting;
import heartbeat.service.board.jira.JiraService;
import heartbeat.service.report.calculator.model.FetchedData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class KanbanServiceTest {

	@InjectMocks
	private KanbanService kanbanService;

	@Mock
	private JiraService jiraService;

	@Mock
	private KanbanCsvService kanbanCsvService;

	@Test
	void shouldCallCsvServiceToGenerateCSVInfoWhenJiraBoardSettingIsNotNull() {
		JiraBoardSetting mockJiraBoardSetting = KanbanFixture.MOCK_JIRA_BOARD_SETTING();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.jiraBoardSetting(mockJiraBoardSetting)
			.startTime("startTime")
			.endTime("endTime")
			.build();
		CardCollection realDoneCardCollection = CardCollection.builder().build();
		CardCollection nonDoneCardCollection = CardCollection.builder().build();

		when(jiraService.getStoryPointsAndCycleTimeForNonDoneCards(any(), any(), any()))
			.thenReturn(nonDoneCardCollection);
		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any()))
			.thenReturn(realDoneCardCollection);

		FetchedData.CardCollectionInfo result = kanbanService.fetchDataFromKanban(request);

		assertEquals(realDoneCardCollection, result.getRealDoneCardCollection());
		assertEquals(nonDoneCardCollection, result.getNonDoneCardCollection());
		verify(kanbanCsvService).generateCsvInfo(request, realDoneCardCollection, nonDoneCardCollection);
		verify(jiraService).getStoryPointsAndCycleTimeForNonDoneCards(
				KanbanFixture.MOCK_EXPECT_STORY_POINT_AND_CYCLE_TIME_REQUEST(), mockJiraBoardSetting.getBoardColumns(),
				mockJiraBoardSetting.getUsers());
		verify(jiraService).getStoryPointsAndCycleTimeForDoneCards(
				KanbanFixture.MOCK_EXPECT_STORY_POINT_AND_CYCLE_TIME_REQUEST(), mockJiraBoardSetting.getBoardColumns(),
				mockJiraBoardSetting.getUsers(), mockJiraBoardSetting.getAssigneeFilter());
	}

	@Test
	void shouldCallCsvServiceToGenerateCSVInfoWhenNoneDoneCardsGreaterThan5() {
		JiraBoardSetting mockJiraBoardSetting = KanbanFixture.MOCK_JIRA_BOARD_SETTING();
		GenerateReportRequest request = GenerateReportRequest.builder()
			.jiraBoardSetting(mockJiraBoardSetting)
			.startTime("startTime")
			.endTime("endTime")
			.build();
		CardCollection realDoneCardCollection = CardCollection.builder().build();
		CardCollection nonDoneCardCollection = KanbanFixture.MOCK_NONE_DONE_CARDS();

		when(jiraService.getStoryPointsAndCycleTimeForNonDoneCards(any(), any(), any()))
			.thenReturn(nonDoneCardCollection);
		when(jiraService.getStoryPointsAndCycleTimeForDoneCards(any(), any(), any(), any()))
			.thenReturn(realDoneCardCollection);

		FetchedData.CardCollectionInfo result = kanbanService.fetchDataFromKanban(request);

		assertEquals("2023-11-02T01:55:00.000+0800",
				result.getNonDoneCardCollection().getJiraCardDTOList().get(0).getBaseInfo().getFields().getCreated());
		assertEquals(50, result.getNonDoneCardCollection().getJiraCardDTOList().size());
	}

}
