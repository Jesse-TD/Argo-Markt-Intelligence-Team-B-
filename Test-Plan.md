SE 4485: Software Engineering Projects

Spring 2025

Test Plan

| Group Number | Group 12 |
| --- | --- |
| Project Title | Marketing Intelligence Platform Team B |
| Sponsoring Company | ARGO |
| Sponsor(s) | Ponchai Reainthong, Raisa Gonzalez, Goitom Kassaye |
| Students | 1\. Jesse Incoom<br><br>2\. Zara Iqbal<br><br>3\. Eric Medina<br><br>4\. Nicolas De la Cruz Velasquez<br><br>5\. Jon Grimes |

Group 12 Test Plan

### ABSTRACT

- This document outlines the comprehensive test plan for the _Marketing Intelligence Platform_ developed by Group 12 for ARGO. It details the testing strategy, techniques, and methodologies used to validate the functionality, reliability, and performance of the system. The document includes system-level test cases derived from functional requirements, the application of black-box and white-box testing techniques, and mapping between test cases and use cases to ensure full requirement coverage. It also addresses test quality metrics, configuration management practices, and compliance with relevant engineering standards. The goal of this test plan is to ensure the platform meets the expectations of the client and end-users through structured and traceable testing efforts.

### TABLE OF CONTENTS

ABSTRACT 1

[TABLE OF CONTENTS 1](#_Toc1920602096)

[LIST OF FIGURES 1](#_Toc1759957952)

[LIST OF TABLES 1](#_Toc852147371)

[INTRODUCTION 1](#_Toc1046309630)

[REQUIREMENTS/SPECIFICATIONS-BASED SYSTEM LEVEL TEST CASES 1](#_Toc1111609718)

[TECHNIQUES FOR TEST GENERATION 1](#_Toc672997139)

[Test Generation Techniques Used 1](#_Toc868867849)

[Black-Box vs. White-Box Testing 1](#_Toc1296233928)

[Quality Criteria for Test Evaluation 1](#_Toc1270515041)

[TRACEABILITY OF TEST CASES TO USE CASES 1](#_Toc369392812)

[EVIDENCE THE TEST PLAN HAS BEEN PLACED UNDER CONFIGURATION MANAGEMENT 1](#_Toc1567083807)

[ENGINEERING STANDARDS AND MULTIPLE CONSTRAINTS 1](#_Toc1735996568)

[ADDITIONAL REFERENCES 1](#_Toc1884824980)

### LIST OF FIGURES

### LIST OF TABLES

Table 1

### INTRODUCTION

- introduction to the entire document
- purpose and scope of the document
- description of the structure of the document

### REQUIREMENTS/SPECIFICATIONS-BASED SYSTEM LEVEL TEST CASES

Test Case ID

Description

Input

Expected Output

Priority

TC01

Engagement rate chart renders

Valid pageReport JSON

Chart shows engagement rate over time

High

TC02

Video retention chart renders

Valid videoReport JSON

Chart displays retention at 10%, 25%, 50%, 75%, 100%

High

TC03

Scroll depth chart appears

Valid scrollPercent custom dimension

Chart reflects scroll interaction

Medium

TC04

API fetch success

Valid user and GA4 parameters

API returns expected metrics

High

TC05

Chart expansion toggle works

User clicks "Expand"

All charts in the section are shown

Low

TC06

User login with ARGO credentials

Valid login credentials

User is authenticated and redirected to dashboard

High

TC07

User logout

User clicks logout

User is redirected to login page and session ends

High

TC08

View metrics on dashboard

Page and video report data

All charts render correctly in each section

High

TC09

Generate Chat-GPT insights

Valid data

AI-generated insights are shown under each section

Medium

TC10

Render customer acquisition charts

Valid data

Customer Acquisition section displays 4 charts

High

TC11

Render customer engagement charts

Valid data

Customer Engagement section displays 4+ charts

High

TC12

Render fulfillment charts

Valid data

Fulfillment section displays 4 charts

High

TC13

Render customer experience charts

Valid data

Customer Experience section displays 4 charts

High

TC14

Render risk management charts

Valid data

Risk Management section displays 4 charts

High

TC15

Render sales management charts

Valid data

Sales Management section displays 4 charts

High

TC16

Render service charts

Valid data

Service section displays 4+charts

High

TC17

Download Report

User clicks download

Report is saved as file

Medium

Table 1

### TECHNIQUES FOR TEST GENERATION

In this project, we applied both black-box and white-box testing techniques to ensure that the Marketing Intelligence Platform behaves correctly at the system and code levels.

#### Test Generation Techniques Used

1. **Equivalence Class Partitioning (ECP):**  
    We divided input data into valid and invalid partitions to reduce the number of test cases while maintaining coverage. For instance, we tested typical, boundary, and invalid date ranges for campaign filters.
2. Boundary Value Analysis (BVA):  
    This technique helped us identify potential off-by-one or edge-related errors. We applied BVA to inputs like date ranges, numerical thresholds for campaign metrics, and pagination values.
3. Decision Table Testing:  
    Used for validating business logic involving combinations of filters and user roles. This ensured that all logical outcomes for complex inputs were covered.
4. State Transition Testing:  
    We used this to verify dynamic UI components such as tab switching, user authentication states, and system responses after login or both user-defined and automatic data updates.
5. Control Flow Testing (White-box):  
    Applied during unit and integration testing to ensure that key backend functions covered all logical branches.
6. Error Guessing:  
    Based on our understanding of the platform and common errors, we manually created test cases targeting likely failure points.

#### Black-Box vs. White-Box Testing

Black-box Testing was primarily used during system-level and acceptance testing. We tested the application through its user interface, verifying outputs based on various input combinations without knowledge of the underlying code. For example, we tested user interactions such as applying different campaign filters and validating whether the corresponding reports, graphs, and insights displayed correctly. This helped ensure that the platform behaves as expected from a user’s perspective.

White-box Testing was used for unit and integration testing of backend services. We focused on validating the logic behind data aggregation, user authentication, and API endpoints. For example, we tested whether campaign metrics were correctly calculated across various conditions, such as missing values or conflicting filters. We used branch coverage analysis and console-based assertions to ensure all execution paths were accounted for and functioned correctly under expected and edge-case scenarios.

#### Quality Criteria for Test Evaluation

To evaluate the effectiveness and completeness of our test suite, we used the following quality criteria:

- Code Coverage:  
    We used manual inspection and console-based logs to ensure major backend functions were tested, especially those responsible for filtering and computing marketing metrics.
- Requirement Coverage:  
    Each functional requirement from the Requirements Document was linked to at least one test case. For example, requirements related to user roles, report generation, and chart accuracy were mapped directly to UI and API test cases.
- Traceability:  
    All test cases were traceable to specific user stories or use cases. This mapping was documented to demonstrate full coverage of system functionality.
- Defect Detection Rate:  
    During each testing iteration, we tracked the number of defects found relative to the number of tests executed to monitor how effective our tests were at identifying issues early.
- Test Case Effectiveness:  
    We reviewed how many test cases resulted in the discovery of real defects (as opposed to false positives or redundant checks), refining low-yield test cases as needed.
- Automation Potential:  
    While most tests were executed manually, we identified repeatable tests (e.g., checking default chart rendering) that could be automated in future sprints to support regression testing in a CI/CD pipeline.

### TRACEABILITY OF TEST CASES TO USE CASES

- **Use Case: User Log In**
- **Mapped Test Case(s):** TC06
- **Description:** This use case is covered by TC06, which verifies that users can log in using valid ARGO credentials. The test confirms successful authentication and redirection to the dashboard, ensuring the system meets the requirement _“User needs to log in with ARGO credentials.”_
- **Use Case: User Logout**
- **Mapped Test Case(s):** TC07
- **Description:** TC07 confirms the logout functionality. When a user clicks logout, they are redirected to the login page and the session is terminated. This test ensures the system fulfills the requirement _“User needs to log out of the dashboard.”_
- **Use Case: Request Engagement Metrics**
- **Mapped Test Case(s):** TC01, TC02, TC03, TC04, TC08
- **Description:** These test cases verify that metrics are correctly fetched from the backend (TC04) and that individual visualizations for engagement rate (TC01), video retention (TC02), and scroll depth (TC03) display accurately. TC08 confirms that all charts render correctly across the dashboard. Together, they ensure the system meets the requirement _“User needs to view metrics – on dashboard.”_
- **Use Case: Report Download**
- **Mapped Test Case(s):** TC17
- **Description:** TC17 validates the system’s ability to generate and save a report when a user initiates a download. It ensures that a properly formatted file (e.g., PDF or CSV) is created, satisfying the requirement _“User needs to download the created reports.”_
- **Use Case: GPT Insights**
- **Mapped Test Case(s):** TC09
- **Description:** TC09 tests the integration of Chat-GPT powered insights. It checks that when valid dashboard data is available, the system displays relevant AI-generated commentary under each section. This fulfills the requirement _“System needs to be able to provide Chat-GPT powered insights.”_

EVIDENCE THE TEST PLAN HAS BEEN PLACED UNDER CONFIGURATION MANAGEMENT

### ENGINEERING STANDARDS AND MULTIPLE CONSTRAINTS

- - IEEE Std 829-1983: Software Testing \[[pdf](https://course.techconf.org/se4485/IEEE/IEEE%20Std%20829-1983-Software-Testing.pdf)\]
    - ISO/IEC/IEEE Std 29119-1-(Revision-2022): Part 1 - Software Testing General Concepts \[[pdf](https://course.techconf.org/se4485/IEEE/IEEE-Std-29119-1-%28Revision-2022%29-Software-Testing-General-Concepts.pdf)\]
    - ISO/IEC/IEEE Std 29119-2-(Revision-2021): Part 2 - Test Process \[[pdf](https://course.techconf.org/se4485/IEEE/IEEE-Std-29119-2-%28Revision-2021%29-Test-Process.pdf)\]
    - ISO/IEC/IEEE Std 29119-3-(Revision-2021): Part 3 - Test Documentation \[[pdf](https://course.techconf.org/se4485/IEEE/IEEE-Std-29119-3-%28Revision-2021%29-Test-Documentation.pdf)\]
    - ISO/IEC/IEEE Std 29119-4-(Revision-2021): Part 4 - Test Techniques \[[pdf](https://course.techconf.org/se4485/IEEE/IEEE%2029119.4%20%282021%29%20-%20Test%20Techniques.pdf)\]
    - Additional standards suggested by the sponsor(s)

### ADDITIONAL REFERENCES

- - Jorgensen, P.C., 2013. _Software Testing: A Craftsman's Approach._ Auerbach Publications
    - Mathur, A.P., 2013. _Foundations of Software Testing, 2/e._ Pearson Education
    - Paul C. Jorgensen. _Software Testing: A Craftsman's Approach_, 5th Edition, Auerbach Publications, 2021.
