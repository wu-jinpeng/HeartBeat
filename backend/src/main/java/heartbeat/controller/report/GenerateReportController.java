package heartbeat.controller.report;

import heartbeat.controller.report.dto.request.DataType;
import heartbeat.controller.report.dto.request.ExportCSVRequest;
import heartbeat.controller.report.dto.request.GenerateBoardReportRequest;
import heartbeat.controller.report.dto.request.GenerateDoraReportRequest;
import heartbeat.controller.report.dto.request.RequireDataEnum;
import heartbeat.controller.report.dto.response.CallbackResponse;
import heartbeat.controller.report.dto.response.ReportResponse;
import heartbeat.exception.BaseException;
import heartbeat.handler.AsyncExceptionHandler;
import heartbeat.service.report.GenerateReporterService;
import heartbeat.util.IdUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Validated
@Log4j2
public class GenerateReportController {

	private final GenerateReporterService generateReporterService;

	private final AsyncExceptionHandler asyncExceptionHandler;

	private final List<String> buildKiteMetrics = Stream
		.of(RequireDataEnum.CHANGE_FAILURE_RATE, RequireDataEnum.DEPLOYMENT_FREQUENCY,
				RequireDataEnum.MEAN_TIME_TO_RECOVERY)
		.map(RequireDataEnum::getValue)
		.toList();

	private final List<String> codebaseMetrics = Stream.of(RequireDataEnum.LEAD_TIME_FOR_CHANGES)
		.map(RequireDataEnum::getValue)
		.toList();

	@Value("${callback.interval}")
	private Integer interval;

	@GetMapping("/{dataType}/{filename}")
	public InputStreamResource exportCSV(@PathVariable DataType dataType, @PathVariable String filename) {
		log.info("Start to export CSV file, _dataType: {}, _timeStamp: {}", dataType, filename);
		ExportCSVRequest request = new ExportCSVRequest(dataType.name().toLowerCase(), filename);
		InputStreamResource result = generateReporterService.fetchCSVData(request);
		log.info("Successfully get CSV file, _dataType: {}, _timeStamp: {}, _result: {}", dataType, filename, result);
		return result;
	}

	@GetMapping("/{reportId}")
	public ResponseEntity<ReportResponse> generateReport(@PathVariable String reportId) {
		boolean generateReportIsOver = generateReporterService.checkGenerateReportIsDone(reportId);
		ReportResponse reportResponse = generateReporterService.getComposedReportResponse(reportId,
				generateReportIsOver);
		if (generateReportIsOver) {
			log.info("Successfully generate Report, _reportId: {}, _reports: {}", reportId, reportResponse);
			generateReporterService.generateCSVForMetric(reportResponse, reportId);
			return ResponseEntity.status(HttpStatus.CREATED).body(reportResponse);
		}
		return ResponseEntity.status(HttpStatus.OK).body(reportResponse);
	}

	@PostMapping("/board")
	public ResponseEntity<CallbackResponse> generateBoardReport(@RequestBody GenerateBoardReportRequest request) {
		log.info(
				"Start to generate board report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _boardReportId: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				IdUtil.getBoardReportId(request.getCsvTimeStamp()));
		generateReporterService.initializeMetricsDataReadyInHandler(request.getCsvTimeStamp(), request.getMetrics());
		CompletableFuture.runAsync(() -> {
			try {
				ReportResponse reportResponse = generateReporterService
					.generateReporter(request.convertToReportRequest());
				generateReporterService.saveReporterInHandler(reportResponse,
						IdUtil.getBoardReportId(request.getCsvTimeStamp()));
				generateReporterService.updateMetricsDataReadyInHandler(request.getCsvTimeStamp(),
						request.getMetrics());
				log.info(
						"Successfully generate board report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _boardReportId: {}",
						request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(),
						request.getEndTime(), IdUtil.getBoardReportId(request.getCsvTimeStamp()));

			}
			catch (BaseException e) {
				asyncExceptionHandler.put(IdUtil.getBoardReportId(request.getCsvTimeStamp()), e);
			}
		});

		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

	@PostMapping("/dora")
	public ResponseEntity<CallbackResponse> generateDoraReport(@RequestBody GenerateDoraReportRequest request) {

		log.info(
				"Start to generate dora report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _doraReportId: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				IdUtil.getDoraReportId(request.getCsvTimeStamp()));
		generateReporterService.initializeMetricsDataReadyInHandler(request.getCsvTimeStamp(), request.getMetrics());
		List<String> pipeLineMetrics = request.getMetrics()
			.stream()
			.map(String::toLowerCase)
			.filter(this.buildKiteMetrics::contains)
			.collect(Collectors.toList());
		List<String> codeBaseMetrics = request.getMetrics()
			.stream()
			.map(String::toLowerCase)
			.filter(this.codebaseMetrics::contains)
			.collect(Collectors.toList());

		CompletableFuture.runAsync(() -> {
			try {
				generateReporterService.generateCsvForDora(request.convertToReportRequest());
				request.setMetrics(pipeLineMetrics);
				ReportResponse reportResponse = generateReporterService
					.generateReporter(request.convertToReportRequest());
				generateReporterService.saveReporterInHandler(reportResponse,
						IdUtil.getDoraReportId(request.getCsvTimeStamp()));
				generateReporterService.updateMetricsDataReadyInHandler(request.getCsvTimeStamp(), pipeLineMetrics);
			}
			catch (BaseException e) {
				asyncExceptionHandler.put(IdUtil.getDoraReportId(request.getCsvTimeStamp()), e);
			}
		});
		if (Objects.nonNull(codebaseMetrics)) {
			CompletableFuture.runAsync(() -> {
				try {
					request.setMetrics(codeBaseMetrics);
					ReportResponse reportResponse = generateReporterService
						.generateReporter(request.convertToReportRequest());
					generateReporterService.saveReporterInHandler(reportResponse,
							IdUtil.getCodeBaseReportId(request.getCsvTimeStamp()));
					generateReporterService.updateMetricsDataReadyInHandler(request.getCsvTimeStamp(), codeBaseMetrics);
				}
				catch (BaseException e) {
					asyncExceptionHandler.put(IdUtil.getDoraReportId(request.getCsvTimeStamp()), e);
				}
			});
		}

		log.info(
				"Successfully generate pipeline report, _metrics: {}, _considerHoliday: {}, _startTime: {}, _endTime: {}, _doraReportId: {}",
				request.getMetrics(), request.getConsiderHoliday(), request.getStartTime(), request.getEndTime(),
				IdUtil.getDoraReportId(request.getCsvTimeStamp()));

		String callbackUrl = "/reports/" + request.getCsvTimeStamp();
		return ResponseEntity.status(HttpStatus.ACCEPTED)
			.body(CallbackResponse.builder().callbackUrl(callbackUrl).interval(interval).build());
	}

}
