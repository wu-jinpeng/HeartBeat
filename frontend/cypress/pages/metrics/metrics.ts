import { TIPS } from '../../../src/constants/resources'

class Metrics {
  static CYCLE_TIME_LABEL = {
    analysisLabel: 'In Analysis',
    todoLabel: 'Ready For Dev',
    inDevLabel: 'In Dev',
    blockLabel: 'Blocked',
    waitingLabel: 'Ready For Test',
    testingLabel: 'In Test',
    reviewLabel: 'Ready to Deploy',
    doneLabel: 'Done',
  }
  static CYCLE_TIME_VALUE = {
    analysisValue: 'Analysis',
    todoValue: 'To do',
    inDevValue: 'In Dev',
    blockValue: 'Block',
    waitingValue: 'Waiting for testing',
    testingValue: 'Testing',
    reviewValue: 'Review',
    doneValue: 'Done',
    noneValue: '----',
  }

  get realDoneSelect() {
    return cy.contains('Consider as Done').siblings().eq(0)
  }

  get RealDoneSelectAllOption() {
    return cy.contains('All')
  }

  get closeModelElement() {
    return cy.get(
      '.Mui-expanded > .MuiFormControl-root > .MuiInputBase-root > .MuiAutocomplete-endAdornment > .MuiAutocomplete-popupIndicator > [data-testid="ArrowDropDownIcon"] > path'
    )
  }

  get classificationSelect() {
    return cy.contains('Distinguished By').siblings()
  }

  get classificationSelectAllOption() {
    return cy.contains('All')
  }

  get deploymentFrequencySettingTitle() {
    return cy.contains('Pipeline settings')
  }

  get organizationSelect() {
    return cy.get('[data-test-id="single-selection-organization"]')
  }

  get pipelineOfOrgXXXX() {
    return cy.get('li[role="option"]').contains('XXXX')
  }

  get pipelineSelectOneOption() {
    return cy.get('li[role="option"]').contains('fs-platform-payment-selector')
  }

  get stepSelectSomeOption() {
    return cy.get('li[role="option"]').contains('RECORD RELEASE TO PROD')
  }

  get addOnePipelineButton() {
    return cy.get('[data-testid="AddIcon"]:first')
  }

  get classificationClear() {
    return this.classificationSelect.find('[aria-label="Clear"]')
  }

  get pipelineSelectOnboardingOption() {
    return cy.get('[data-test-id="single-selection-pipeline-name"]:contains("fs-platform-onboarding")')
  }

  get pipelineSelectUIOption() {
    return cy.get('li[role="option"]').contains('payment-selector-ui')
  }

  get buildKiteStepNotFoundTips() {
    return cy.contains('BuildKite get steps failed: 404 Not Found')
  }

  get pipelineRemoveButton() {
    return cy.get('[data-test-id="remove-button"]').eq(1)
  }

  get branchSelect() {
    return cy.contains('Branches').eq(0).siblings()
  }

  get branchSelectSomeOption() {
    return cy.contains('All')
  }

  get pipelineStepSelectXXOption() {
    return cy.get('[data-test-id="single-selection-step"]:contains("RECORD RELEASE TO UAT"):last')
  }

  get pipelineStepXXOption() {
    return cy.get('[data-test-id="single-selection-pipeline-name"]:contains("payment-selector-ui")')
  }

  get leadTimeForChangeAddOneButton() {
    return cy.get('[data-testid="AddIcon"]:last')
  }

  get headerBar() {
    return cy.get('[data-test-id="Header"]')
  }

  get nextButton() {
    return cy.contains('Next')
  }

  get backButton() {
    return cy.contains('Previous')
  }

  get cycleTimeTitleTooltip() {
    return cy.get('[data-test-id="tooltip')
  }

  get progressBar() {
    return cy.get('[data-testid="loading-page"]', { timeout: 10000 })
  }

  private readonly cycleTimeSettingAnalysis = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.analysisLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.analysisValue).click()
  }

  private readonly cycleTimeSettingTodo = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.todoLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.todoValue).click()
  }

  private readonly cycleTimeSettingInDev = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.inDevLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.inDevValue).click()
  }

  private readonly cycleTimeSettingBlock = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.blockLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.blockValue).click()
  }

  private readonly cycleTimeSettingWaitTest = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.waitingLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.waitingValue).click()
  }

  private readonly cycleTimeSettingTesting = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.testingLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.testingValue).click()
  }

  private readonly cycleTimeSettingReview = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.reviewLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.reviewValue).click()
  }

  private readonly cycleTimeSettingDone = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.doneLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.doneValue).click()
  }

  private readonly cycleTimeSettingDoneColumnToNone = () => {
    cy.contains(Metrics.CYCLE_TIME_LABEL.doneLabel).siblings().eq(0).click()
    cy.get('li[role="option"]').contains(Metrics.CYCLE_TIME_VALUE.noneValue).click()
  }

  checkDuplicatedMessage = () => cy.contains('This pipeline is the same as another one!').should('exist')

  getStepOfSomePipelineSelect = (i: number) => cy.get('[data-test-id="single-selection-step"]').eq(i)

  getOrganizationSecondSelect = (i: number) => cy.get('[data-test-id="single-selection-organization"]').eq(i)

  getPipelineSelect = (i: number) => cy.get('[data-test-id="single-selection-pipeline-name"]').eq(i)

  checkCycleTimeTooltip() {
    this.cycleTimeTitleTooltip.trigger('mouseover')
    cy.contains(TIPS.CYCLE_TIME).should('be.visible')
  }

  checkCycleTime() {
    this.cycleTimeSettingAnalysis()
    this.cycleTimeSettingTodo()
    this.cycleTimeSettingInDev()
    this.cycleTimeSettingBlock()
    this.cycleTimeSettingWaitTest()
    this.cycleTimeSettingTesting()
    this.cycleTimeSettingReview()
    this.cycleTimeSettingDone()
  }

  checkRealDone() {
    this.realDoneSelect.click()

    this.RealDoneSelectAllOption.click()
    this.closeModelElement.click({ force: true })
  }

  checkClassification() {
    this.classificationSelect.click()

    this.classificationSelectAllOption.click()
    this.closeModelElement.click({ force: true })
  }

  checkDeploymentFrequencySettings() {
    this.deploymentFrequencySettingTitle.should('be.exist')
    this.organizationSelect.click()
    this.pipelineOfOrgXXXX.click()
    this.getPipelineSelect(0).click()
    this.pipelineSelectOneOption.click()
    this.waitingForProgressBar()
    this.getStepOfSomePipelineSelect(0).click()
    this.stepSelectSomeOption.click()
    this.branchSelect.click()
    this.branchSelectSomeOption.click()
    this.closeOptions()

    this.addOnePipelineButton.click()
    this.getOrganizationSecondSelect(1).click()
    this.pipelineOfOrgXXXX.click()
    this.getPipelineSelect(1).click()
    this.pipelineSelectUIOption.click()
    this.buildKiteStepNotFoundTips.should('exist')
    this.pipelineRemoveButton.click()

    this.addOnePipelineButton.click()
    this.getOrganizationSecondSelect(1).click()
    this.pipelineOfOrgXXXX.click()
    this.getPipelineSelect(1).click()
    this.pipelineSelectOneOption.click()
    this.waitingForProgressBar()
    this.getStepOfSomePipelineSelect(1).click()
    this.stepSelectSomeOption.click()
    this.checkDuplicatedMessage()
    this.pipelineRemoveButton.click()
  }

  closeOptions() {
    this.headerBar.click()
  }

  goReportStep() {
    this.nextButton.click()
  }

  BackToConfigStep() {
    this.backButton.click()
  }

  waitingForProgressBar() {
    this.progressBar.should('be.visible')
    this.progressBar.should('not.exist')
  }

  checkRequiredFields() {
    this.cycleTimeSettingDoneColumnToNone()
    this.nextButton.should('be.disabled')
    this.cycleTimeSettingDone()
    this.checkRealDone()
    this.nextButton.should('be.enabled')

    this.classificationClear.click({ force: true })
    this.nextButton.should('be.disabled')
    this.checkClassification()
    this.nextButton.should('be.enabled')
  }
}

const metricsPage = new Metrics()
export default metricsPage
