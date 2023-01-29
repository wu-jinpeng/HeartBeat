package heartbeat.controller.board;

import heartbeat.controller.board.vo.request.BoardRequest;
import heartbeat.controller.board.vo.response.BoardConfigResponse;
import heartbeat.service.board.jira.JiraService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/board/jira")
public class JiraController {

	private final JiraService jiraService;

	@PostMapping("/config")
	public BoardConfigResponse getJiraBoardConfig(@RequestBody BoardRequest boardRequest) {
		return jiraService.getJiraReconfiguration(boardRequest);
	}

}
