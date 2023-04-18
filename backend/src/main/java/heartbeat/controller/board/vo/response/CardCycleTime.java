package heartbeat.controller.board.vo.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardCycleTime {

	private String name;

	private StepsDay steps;

	private double total;

}
