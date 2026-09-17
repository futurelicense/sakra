const fs = require('fs')
const path = require('path')

const downloadsDir = path.join(__dirname, '..', 'public', 'downloads')

fs.mkdirSync(downloadsDir, { recursive: true })

// Helper to create a structured CSV that Excel opens cleanly as a spreadsheet
function createSpreadsheetCSV(filename, headers, rows) {
  const content = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\r\n')

  fs.writeFileSync(path.join(downloadsDir, filename), content)
  console.log(`Created spreadsheet template: ${filename}`)
}

// 1. QA Test Case Template
createSpreadsheetCSV(
  'software-qa-test-case-template.xlsx',
  ['Test ID', 'Requirement', 'Test Scenario', 'Test Steps', 'Expected Result', 'Actual Result', 'Status', 'Priority', 'Defect Reference'],
  [
    ['TC-001', 'REQ-AUTH-01', 'Verify successful user login with valid credentials', '1. Navigate to login page\n2. Enter valid email and password\n3. Click Login', 'User is redirected to Dashboard with active session token', 'As expected. Redirected to /dashboard', 'Passed', 'High', 'None'],
    ['TC-002', 'REQ-AUTH-02', 'Verify login validation error with incorrect password', '1. Enter valid email\n2. Enter invalid password\n3. Click Login', 'Error message "Invalid credentials" displayed, password field cleared', 'As expected. Inline red error shown', 'Passed', 'High', 'None'],
    ['TC-003', 'REQ-DATA-04', 'Verify export functionality for 10,000+ records', '1. Open analytics table\n2. Select CSV Export\n3. Confirm download completes within 3s', 'CSV file generated with all 10,000 rows without memory leak or timeout', 'File generated in 1.8s. All records intact', 'Passed', 'Medium', 'None'],
    ['TC-004', 'REQ-CHECK-08', 'Verify defect logging webhook trigger on test failure', '1. Execute automated regression suite\n2. Inject failed assertion\n3. Check Jira ticket creation', 'Automated bug ticket created in Jira with stacktrace attachment', 'Ticket created successfully with full trace', 'Passed', 'Critical', 'None']
  ]
)

// 2. Bug Tracking Template
createSpreadsheetCSV(
  'software-defect-bug-tracker.xlsx',
  ['Bug ID', 'Severity', 'Priority', 'Environment', 'Steps to Reproduce', 'Assigned Developer', 'Status', 'Resolution', 'Retest Result'],
  [
    ['BUG-101', 'Critical', 'High', 'Staging (Chrome 122)', '1. Click "Export Data"\n2. Rapidly double-click submit button', 'John D. (Backend)', 'Resolved', 'Added idempotency key & button debounce', 'Verified Fix - No duplicate calls'],
    ['BUG-102', 'Major', 'Medium', 'Production (Safari / iOS)', '1. Open profile dropdown on mobile view\n2. Backdrop fails to dismiss', 'Sarah K. (Frontend)', 'In Progress', 'Refactoring z-index stacking context', 'Pending Deploy'],
    ['BUG-103', 'Minor', 'Low', 'All Environments', '1. Hover over tooltip in metrics card\n2. Text alignment misaligned by 2px', 'Alex R. (UI/UX)', 'Closed', 'Adjusted CSS flex layout padding', 'Verified Fix']
  ]
)

// 3. Data Quality Validation Checklist
createSpreadsheetCSV(
  'data-quality-validation-checklist.xlsx',
  ['Category', 'Validation Check', 'Verification Method', 'Threshold / Criteria', 'Observed Status', 'Pass / Fail', 'Remediation Action'],
  [
    ['Completeness', 'Null / Missing Primary Keys', 'SQL Query: count(*) where id is null', '0% missing keys', '0 missing keys found', 'PASS', 'None required'],
    ['Accuracy', 'Value Range Validation (Age, Salary)', 'Statistical descriptive min/max query', 'Age between 18-99, Salary > 0', '2 outliers found with negative values', 'FAIL', 'Imputed using median and flagged source ETL'],
    ['Consistency', 'Foreign Key Referential Integrity', 'Left join check on dimension tables', '100% matched keys', '100% referential integrity', 'PASS', 'None required'],
    ['Duplicates', 'De-duplication Check on Email / Phone', 'Group by email having count(*) > 1', 'Zero duplicate records allowed', '14 duplicate accounts identified', 'FAIL', 'Merged duplicate UUIDs via deduplication script']
  ]
)

// 4. Data Analysis Project Tracker
createSpreadsheetCSV(
  'data-analysis-project-tracker.xlsx',
  ['Phase', 'Project Objective', 'Dataset Inventory', 'Quality Checks', 'Analysis Tasks', 'Key Metrics', 'Insights Discovered', 'Deliverables'],
  [
    ['Phase 1: Ingestion', 'Aggregate customer transactional data', 'Sales_Q1_2026.csv, CRM_Export.sql', 'Schema validation, null checks', 'Load into PostgreSQL data warehouse', 'Record count: 30,000+', 'Identified 5 disparate date formats', 'Consolidated staging schema'],
    ['Phase 2: Exploratory Analysis', 'Evaluate churn correlation with QA tickets', 'Customer_Tickets.csv, Account_Plans.csv', 'Cross-table join consistency', 'Python Pandas regression & correlation matrix', 'R-squared: 0.74', 'Higher defect frequency accelerates churn by 32%', 'Executive slide deck & Tableau Dashboard'],
    ['Phase 3: Delivery', 'Present recommendations to stakeholders', 'Executive_Summary.pdf, Clean_Data.xlsx', 'Peer review & validation sign-off', 'Stakeholder presentation meeting', 'Projected churn reduction: 15%', 'Immediate QA stabilization proposed for core checkout', 'Actionable roadmap report']
  ]
)

// Intentionally do NOT generate placeholder resume or publication PDFs.
// Only ship real publisher-approved article PDFs and the official USCIS/RFE CV when provided.
console.log('Spreadsheet templates created. Skipping placeholder resume/publication PDFs.')
console.log('All templates created successfully!')
