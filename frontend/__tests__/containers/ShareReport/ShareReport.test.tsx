import { EMPTY_REPORT_VALUES, MOCK_REPORT_RESPONSE } from '../../fixtures';
import { useShareReportEffect } from '@src/hooks/useShareReportEffect';
import { render, renderHook, screen } from '@testing-library/react';
import { DEFAULT_MESSAGE } from '@src/constants/resources';
import { setupStore } from '../../utils/setupStoreUtil';
import ShareReport from '@src/containers/ShareReport';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

let store = setupStore();

jest.mock('@src/hooks/useShareReportEffect', () => ({
  ...jest.requireActual('@src/hooks/useShareReportEffect'),
  useShareReportEffect: jest.fn().mockReturnValue({
    getData: jest.fn(),
  }),
}));

describe('Share Report', () => {
  const { result: reportHook } = renderHook(() => useShareReportEffect(), {
    wrapper: ({ children }: { children: ReactNode }) => {
      return <Provider store={store}>{children}</Provider>;
    },
  });

  beforeEach(() => {
    store = setupStore();
  });

  const setReportHook = async () => {
    reportHook.current.dateRanges = [
      {
        startDate: '2024-02-04T00:00:00.000+08:00',
        endDate: '2024-02-17T23:59:59.999+08:00',
      },
      {
        startDate: '2024-02-18T00:00:00.000+08:00',
        endDate: '2024-02-28T23:59:59.999+08:00',
      },
    ];
    reportHook.current.reportInfos = [
      {
        id: '2024-02-04T00:00:00.000+08:00',
        timeout4Board: { message: DEFAULT_MESSAGE, shouldShow: true },
        timeout4Dora: { message: DEFAULT_MESSAGE, shouldShow: true },
        timeout4Report: { message: DEFAULT_MESSAGE, shouldShow: true },
        generalError4Board: { message: DEFAULT_MESSAGE, shouldShow: true },
        generalError4Dora: { message: DEFAULT_MESSAGE, shouldShow: true },
        generalError4Report: { message: DEFAULT_MESSAGE, shouldShow: true },
        shouldShowBoardMetricsError: true,
        shouldShowPipelineMetricsError: true,
        shouldShowSourceControlMetricsError: true,
        reportData: { ...MOCK_REPORT_RESPONSE, exportValidityTime: 30 },
      },
      {
        id: '2024-02-18T00:00:00.000+08:00',
        timeout4Board: { message: DEFAULT_MESSAGE, shouldShow: true },
        timeout4Dora: { message: DEFAULT_MESSAGE, shouldShow: true },
        timeout4Report: { message: DEFAULT_MESSAGE, shouldShow: true },
        generalError4Board: { message: DEFAULT_MESSAGE, shouldShow: true },
        generalError4Dora: { message: DEFAULT_MESSAGE, shouldShow: true },
        generalError4Report: { message: DEFAULT_MESSAGE, shouldShow: true },
        shouldShowBoardMetricsError: true,
        shouldShowPipelineMetricsError: true,
        shouldShowSourceControlMetricsError: true,
        reportData: { ...EMPTY_REPORT_VALUES },
      },
    ];
  };

  const setup = () => {
    return render(
      <Provider store={store}>
        <ShareReport />
      </Provider>,
    );
  };

  it('should render report content given data is ready', () => {
    setReportHook();
    setup();

    expect(screen.getByText('Board Metrics')).toBeInTheDocument();
    expect(screen.getByText('Velocity')).toBeInTheDocument();
    expect(screen.getByText('Cycle Time')).toBeInTheDocument();
    expect(screen.getByText('DORA Metrics')).toBeInTheDocument();
    expect(screen.getByText('Lead Time For Changes')).toBeInTheDocument();
    expect(screen.getByText('Deployment Frequency')).toBeInTheDocument();
    expect(screen.getByText('Dev Change Failure Rate')).toBeInTheDocument();
    expect(screen.getByText('Dev Mean Time To Recovery')).toBeInTheDocument();

    expect(reportHook.current.getData).toHaveBeenCalledTimes(1);
  });
});
