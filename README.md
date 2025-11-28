# QA Engineering Assessment - Aajil

## 📋 Project Overview

This repository contains my complete submission for the Aajil QA Engineering technical assessment, demonstrating both manual testing expertise and automated test automation with CI/CD integration.

**Assessment Components:**
- **Part 1:** Manual Testing of Demoblaze.com checkout functionality
- **Part 2:** Test Automation of Blazedemo.com flight purchase flow with CI/CD

## 🏗️ Repository Structure

### Branch Architecture
- **`main` branch**: Contains all test automation code, manual testing artifacts, and CI/CD configuration
- **`master` branch**: Contains application code (simulated deployment)

```
QA-Assessment-Aajil/
├── .github/workflows/
│   └── run-tests-on-deployment.yml    # CI/CD pipeline
├── ManualTestingArtifacts/
│   ├── test-suite.xlsx               # Complete test suite along  with bugs report (4 sheets)
│   └── bug_report.pdf     # Detailed bug report
├── pages/                            # Page Object Model classes
├── tests/                            # Playwright test specifications
├── utils/                            # Helper functions & data generators
├── playwright.config.ts              # Playwright configuration
└── package.json                      # Project dependencies
```

## 🧪 Manual Testing (Part 1) - COMPLETED

### Comprehensive Test Coverage
**20 Test Cases Executed on Demoblaze.com:**

| Test Type | Total | Passed | Failed | Success Rate |
|-----------|-------|--------|--------|--------------|
| **Positive Tests** | 10 | 8 | 2 | 80% |
| **Negative Tests** | 10 | 2 | 8 | 20% |
| **Overall** | 20 | 10 | 10 | 50% |

### Test Suite Structure (Excel File)
The test suite includes **4 comprehensive sheets**:

1. **Positive Test Cases** - 10 scenarios testing normal workflows
2. **Negative Test Cases** - 10 scenarios testing edge cases and error conditions  
3. **Bug Reports** - Consolidated list of identified defects
4. **Additional/Missing Test Cases** - Extended test coverage and gap analysis

### Critical Findings
- **High Severity Bug**: Empty cart checkout allowed
- **Security Concerns**: No credit card validation or input sanitization
- **UX Issues**: Poor empty state handling, no quantity management
- **Validation Gaps**: 8/10 negative tests failed, revealing major quality issues

### Artifacts Location
- `ManualTestingArtifacts/test-suite.xlsx` - Complete 4-sheet test suite
- `ManualTestingArtifacts/bug_report.pdf` - Detailed bug documentation

## 🤖 Test Automation (Part 2) - COMPLETED

### Technology Stack
- **Framework**: Playwright with TypeScript
- **Pattern**: Page Object Model (POM)
- **CI/CD**: GitHub Actions

### Automated Test Scenarios
The `purchaseEndToEnd` function executes flight purchases with these scenarios:

1. **Boston → Berlin, Flight 2** - Specific route validation
2. **Random Parameters** - Dynamic city and flight selection
3. **Boston → Boston, Flight 1** - Validation failure test
4. **Paris → Berlin, Flight 0** - Validation failure test
5. **Paris → London, Flight 1** - Custom route validation

### Validation Criteria
- ✅ Status must be "PendingCapture"
- ✅ Price must be greater than $100.00
- ✅ Input sanitization and validation
- ✅ Random data generation for user information
- ✅ XPath locators used throughout

## 🚀 CI/CD Pipeline

### Automated Testing on Deployment
The repository features a continuous integration pipeline that:

**Trigger**: Automatically runs when code is pushed to the `master` branch (application deployment)

**Process**:
1. Monitors `master` branch for changes
2. Checks out test code from `main` branch
3. Executes full Playwright test suite
4. Generates HTML test reports
5. Stores artifacts for 30 days

**Manual Trigger**: Also available via GitHub Actions UI for on-demand testing

### Pipeline File
- Location: `.github/workflows/run-tests-on-deployment.yml`
- Configuration: Ubuntu latest, Node.js 18, Playwright containers

## ⚙️ Setup & Execution

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Local Installation
```bash
# Clone the repository
git clone https://github.com/voliullah/QA-Assessment-Aajil.git
cd QA-Assessment-Aajil

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests Locally
```bash
# Run all test scenarios
npx playwright test

# Run specific test file
npx playwright test tests/purchase-flow.spec.ts

# Run with headed browser (visible)
npx playwright test --headed

# Generate HTML report
npx playwright show-report
```

### CI/CD Execution
Tests automatically run when:
1. Code is pushed to `master` branch
2. Manual trigger via GitHub Actions UI
3. Results available in Actions tab with downloadable reports

## 📊 Assessment Deliverables

### ✅ Completed Requirements

**Manual Testing:**
- [x] **20 comprehensive test cases** across 4 detailed sheets
- [x] 10 positive test cases (8 passed, 2 failed - identified real bugs)
- [x] 10 negative test cases (2 passed, 8 failed - major validation gaps)
- [x] Additional/Missing test cases analysis
- [x] Detailed bug reports with reproduction steps
- [x] Exploratory testing documentation

**Test Automation:**
- [x] `purchaseEndToEnd` function with 3 parameters
- [x] Page Object Model implementation
- [x] Input validation and sanitization
- [x] Random data generation
- [x] 5 specified test scenarios
- [x] Status and price validation
- [x] XPath locators throughout

**CI/CD:**
- [x] Automated test execution on deployment
- [x] GitHub Actions workflow
- [x] Test reporting and artifacts
- [x] Cross-browser testing capability

## 🔍 Key Demonstrations

1. **Critical Thinking**: Identified 10+ business logic flaws and validation gaps across 20 test cases
2. **Attention to Detail**: Comprehensive test coverage with additional/missing test cases analysis
3. **Technical Excellence**: Production-ready automation framework with CI/CD
4. **Clear Communication**: Professional documentation across 4 detailed Excel sheets

## 📈 Test Results

### Manual Testing
- **20 test cases executed** with detailed analysis
- **50% failure rate** identifying critical business logic issues
- **Additional test cases** documented for extended coverage
- **High severity bugs** documented with reproduction steps

### Automation Testing  
- **5 scenarios automated** with 100% pass rate for valid cases
- **Proper error handling** for invalid scenarios
- **CI/CD integration** demonstrating real-world workflow
- **Cross-browser compatibility** testing

---

**Candidate**: Waliullah  
**Repository**: https://github.com/voliullah/QA-Assessment-Aajil  
**CI/CD Status**: ✅ Active - Tests run on master branch deployments  
**Test Coverage**: ✅ 20 manual test cases + 5 automated scenarios
