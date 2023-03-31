import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { MOCK_REPORT_URL } from '../fixtures'
import { HttpStatusCode } from 'axios'
import { reportClient } from '@src/clients/ReportClient'

const server = setupServer(rest.post(MOCK_REPORT_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.Ok))))

describe('report client', () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())

  it('should get response when generate report request status 200', async () => {
    const result = await reportClient.generateReporter()

    expect(result.response).not.toBeNull()
  })

  it('should throw error when generate report response status 500', async () => {
    server.use(rest.post(MOCK_REPORT_URL, (req, res, ctx) => res(ctx.status(HttpStatusCode.InternalServerError))))

    await expect(async () => {
      await reportClient.generateReporter()
    }).rejects.toThrow('report verify failed: Internal server error')
  })
})
