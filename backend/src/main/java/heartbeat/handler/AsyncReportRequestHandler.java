package heartbeat.handler;

import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.util.IdUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import static heartbeat.handler.FIleType.METRICS_DATA_COMPLETED;
import static heartbeat.handler.FIleType.REPORT;
import static heartbeat.service.report.scheduler.DeleteExpireCSVScheduler.EXPORT_CSV_VALIDITY_TIME;

@Log4j2
@Component
@RequiredArgsConstructor
public class AsyncReportRequestHandler extends AsyncHandler {

	private final Map<String, ReportResponse> reportMap = new ConcurrentHashMap<>();

	public void putReport(String reportId, ReportResponse e) {
		createDirToConvertData(REPORT);
		reportMap.put(reportId, e);
	}

	public ReportResponse getReport(String reportId) {
		return reportMap.get(reportId);
	}

	public void deleteExpireReport(long currentTimeStamp) {
		long exportTime = currentTimeStamp - EXPORT_CSV_VALIDITY_TIME;
		Set<String> keys = reportMap.keySet()
			.stream()
			.filter(reportId -> Long.parseLong(IdUtil.getTimeStampFromReportId(reportId)) < exportTime)
			.collect(Collectors.toSet());
		reportMap.keySet().removeAll(keys);
	}

}
