import { test, expect } from '../fixtures'

test('should render metrics page', async ({ homePage }) => {
  await homePage.createNewProject()

  expect(homePage.page.url()).toContain('metrics')

  await homePage.close()
})
test('should show three steps when render metrics page', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkSteps()

  await metricsPage.close()
})

test('should show project name when input some letters', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await expect(metricsPage.projectNameLabel).toBeVisible()

  await metricsPage.close()
})
test('should show error message when project name is Empty', async ({ metricsPage }) => {
  await metricsPage.createNewProject()

  await metricsPage.checkProjectName()

  await expect(metricsPage.errorMessage).toBeTruthy()

  await metricsPage.close()
})
