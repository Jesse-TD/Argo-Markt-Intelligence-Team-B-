# SE 4485: Software Engineering Projects  
**Spring 2025 Requirements Documentation**

**Group Number:** 12  
**Project Title:** Marketing Intelligence Platform Team B  
**Sponsoring Company:** ARGO  
**Sponsor(s):** Ponchai Reainthong, Raisa Gonzalez, Goitom Kassaye  
**Students:**  
1. Zara Iqbal  
2. Jon Grimes  
3. Eric Medina  
4. Nicolas De la Cruz Velasquez  
5. Jesse Incoom  

---

## Title Page

*Group 12 Requirements Document*

---

## Abstract

This document outlines the requirements for the development of the Marketing Intelligence Platform, sponsored by ARGO. It provides a detailed breakdown of the system's functional and non-functional requirements, ensuring alignment with project objectives and user expectations. Functional requirements are illustrated through comprehensive use case diagrams that highlight user interactions—including login, logout, dashboard access, report download, and AI-powered insights. Each use case includes corresponding system responses and exception handling to ensure seamless functionality.

---

## Table of Contents

- [List of Figures](#list-of-figures)
- [Introduction](#introduction)
- [Use Case Model for Functional Requirements](#use-case-model-for-functional-requirements)
  - [Requirement: User needs to log in with ARGO credentials](#requirement-user-needs-to-log-in-with-argo-credentials)
  - [Use Case: User Logout](#use-case-user-logout)
  - [Use Case: Request Engagement Metrics](#use-case-request-engagement-metrics)
  - [Use Case: Report Download](#use-case-report-download)
  - [Use Case: GPT Insights](#use-case-gpt-insights)
- [Rationale for Your Use Case Model](#rationale-for-your-use-case-model)
- [Non-Functional Requirements](#non-functional-requirements)
- [Evidence of Configuration Management](#evidence-of-configuration-management)
- [Engineering Standards and Multiple Constraints](#engineering-standards-and-multiple-constraints)
- [Additional References](#additional-references)

---

## List of Figures

- **Figure 1.0:** Use Case Model for User Log In
- **Figure 1.1:** Use Case Model for User Logout
- **Figure 1.2:** Use Case Model for Request Engagement Metrics
- **Figure 1.3:** Use Case Model for Report Download
- **Figure 1.4:** Use Case Model for GPT Insights

---

## Introduction

This Requirements Documentation is prepared for the SE 4485 Software Engineering Projects course for Spring 2025 by Group 12. It outlines the requirements for the development of the Marketing Intelligence Platform Team B, sponsored by ARGO, and provides a comprehensive understanding of both the functional and non-functional aspects of the system. The purpose of this document is to detail the system functionalities, user interactions, and performance criteria to ensure alignment with project objectives and user expectations. Topics include high-level use case models—covering login, logout, dashboard access, report download, and AI-powered insights—as well as the rationale behind the chosen modeling techniques, non-functional requirements, configuration management, and adherence to engineering standards. The document is organized with a title page, abstract, table of contents, and list of figures, followed by detailed sections on the introduction, use case models, rationale, non-functional requirements, configuration management evidence, engineering standards, and additional references.

---

## Use Case Model for Functional Requirements

### Requirement: User needs to log in with ARGO credentials

**Figure 1.0**

![Login UML Diagram](/Charts/loginpage.drawio.png)

**Use Case Name:** User Log In  
**Actors:** User, Authenticator  
**User:** Enters credentials into the login page.  
**System:** Validates user credentials and manages redirection.

**Entry Conditions:**
- The User is not currently logged in.
- The User has navigated to the Log-In Page, which is ready to accept input.

**Normal Flow of Events:**

1. **User Input:**
   - 1.1 The User enters their login credentials (e.g., username and password).
   - 1.2 The User submits the credentials.

2. **Validate Input:**
   - 2.1 The System receives the submitted credentials.
   - 2.2 The System checks the credentials against the authentication data store.
   - 2.3 If the credentials are valid, proceed to step 3; otherwise, handle exceptions.

3. **Redirect to Dashboard:**
   - 3.1 The System includes the “Redirect to dashboard” flow.
   - 3.2 The User is taken to their dashboard page upon successful authentication.

**Exit Flow:**
- The User is successfully authenticated and arrives at the dashboard page.

**Exceptions (Alternate Flow of Events):**

- **Invalid Credentials:**
  - The System detects that the credentials do not match any valid account.
  - An error message is displayed indicating an incorrect username or password.
  - The User is prompted to re-enter credentials or reset the password.
  - Flow returns to step 1 of the Normal Flow if the User attempts to log in again.

- **System Error:**
  - If there is a technical issue (e.g., database unavailable), the System displays an error message.
  - The User may retry.

---

### Use Case: User Logout

**Figure 1.1**

![Logout UML Diagram](/Charts/Logout.png)

**Use Case Name:** User Logout  
**Actors:** User, Authenticator  
**User:** Requests to log out of the dashboard.  
**System:** Processes the logout request and manages redirection.

**Entry Conditions:**
- The User is currently logged into the dashboard.
- The User has accessed the logout option from the dashboard.

**Normal Flow of Events:**

1. **User Input:**
   - The User clicks the logout button on the dashboard.
   - The System receives the logout request.

2. **Validate Input:**
   - 2.1 The System verifies the logout request.
   - 2.2 The System invalidates the user session.
   - 2.3 If the logout request is valid, proceed to step 3; otherwise, handle exceptions.

3. **Redirect to Login Page:**
   - 3.1 The System includes the "Redirect to Login Page" flow.
   - 3.2 The User is redirected to the login page upon successful logout.

**Exit Flow:**
- The User is successfully logged out and redirected to the login page.

**Exceptions (Alternate Flow of Events):**

- **Invalid Credentials:**
  - If an invalid session is detected during logout, the System displays an error message indicating session expiration.
  - The User is redirected to the login page.

- **System Error:**
  - If there is a technical issue (e.g., server error), the System displays an error message.
  - The User may retry the logout process.

**Special Requirements:**
- **Audit Logging:** The System must log each logout event with a timestamp, user ID, and session details for auditing purposes.
- **Session Timeout Handling:** If the User’s session times out due to inactivity, the System should automatically log the User out and redirect them to the login page.

---

### Use Case: Request Engagement Metrics

**Figure 1.2**

![Dashboard UML Diagram](/Charts/Dashboard.png)

**Use Case Name:** Request Engagement Metrics  
**Actors:** User, GA4 API, ChatGPT AI, System API, Dashboard  
**User:** Interacts with the dashboard to view engagement metrics and AI-powered insights.  
**System:** Integrates the GA4 API and ChatGPT AI to retrieve and analyze data.

**Entry Conditions:**
- The User is logged into the system with valid ARGO credentials.
- The GA4 API is accessible for retrieving engagement data.
- ChatGPT AI is available for analyzing insights.

**Normal Flow of Events:**

1. **User Request:** The User requests engagement metrics via the dashboard.
2. **System API Processing:** The System API fetches engagement data from the GA4 API.
3. **GA4 API Retrieval:** The GA4 API retrieves engagement data and sends it to the System.
4. **ChatGPT AI Analysis:** The System sends the retrieved data to ChatGPT AI for further insights.
5. **Displaying Data and Insights:** The dashboard displays the engagement metrics along with AI-generated insights.

**Additional Details:**
- The User may specify filters such as date range, metric type, or engagement category.
- The System validates the input to ensure correct metric names, formats, and filters.

**Exit Flow:**
- The User successfully views engagement metrics and insights on the dashboard.

**Exceptions (Alternate Flow of Events):**

- **Invalid Input:** If the User provides incorrect filters or metric names, the System prompts an error and requests valid input.
- **API Unavailability:** If the GA4 API is down, the System displays an error message and suggests retrying later.
- **AI Processing Failure:** If ChatGPT AI fails to generate insights, the dashboard displays only raw engagement metrics.
- **Authentication Failure:** If the User is not logged in, the System redirects to the login page.

---

### Use Case: Report Download

**Figure 1.3**

![Downloading Reports UML Diagram](/Charts/Report_Download.png)

**Use Case Name:** Report Download  
**Actors:**  
- **User:** ARGO marketing specialist  
- **System:** Intelligent marketing platform

**Entry Conditions:**
- The User is logged in.
- The User has defined specific metrics to view as a report.
- The System reflects the desired metrics.

**Normal Flow of Events:**

1. **User Interaction:**
   - 1.1 The User selects designated metrics to turn into a report.
   - 1.2 The User clicks on the ‘Generate Report’ button.

2. **Report View:**
   - 2.1 The System validates the fetched data and turns it into a report.
   - 2.2 The User sees a preview of the generated report.
   - 2.3 If the report is accurate and responsive, the User may download it.

3. **Report Download:**
   - 3.1 The User clicks on the ‘Download’ button.
   - 3.2 The User is presented with options to download the report as PDF (.pdf) or Excel (.xlsx).
   - 3.3 The report is downloaded to the User’s device.

**Exit Flow:**
- The User has successfully downloaded the report.
- The System prompts the User to return to the main page via a button.

**Exceptions (Alternate Flow of Events):**

- **No Report Preview:** If the generated report is not visible:
  - The System displays an error message.
  - The User can re-generate the report.
  - The page is refreshed, allowing the User to run the report again.

**Special Requirements:**
- **Report Availability Time:** The report must download in less than 5 seconds after the User clicks the generation button, and the download must be registered as an event.
- **Customizable Report Parameters:** The report must reflect the User’s selected parameters and metrics to meet various analytic needs.

---

### Use Case: GPT Insights

**Figure 1.4**

![GPT Insights UML Diagram](/Charts/GPT_Insights.png)

**Use Case Name:** GPT Insights  
**Actors:**
- **User:** Requests insights and views the response.
- **GPT API:** External service providing AI-generated responses based on the User's query.

**Entry Conditions:**
- The User has access to the system.
- The System is online and operational.
- The User provides a valid query for insights.

**Normal Flow of Events:**

1. The User initiates a request for insights (Request Insight).
2. The System processes the request before sending it to the GPT API (Process Request).
3. The System fetches insights from the GPT service (Fetch GPT Insights).
4. Once the response is received, the System processes and formats it (Process Response).
5. The insights are displayed to the User (Display Response).

**Exit Flow:**
- The User successfully receives and views the insights.
- The System completes the request.

**Exceptions (Alternate Flow of Events):**

- **Invalid Query:** If the User submits an empty or malformed query, the System prompts for valid input.
- **API Failure:** If the GPT API does not respond, the System notifies the User and suggests retrying later.
- **Processing Error:** If an internal error occurs, the System displays an error message.
- **Slow Response:** If the API takes too long, the System shows a loading indicator or allows the User to cancel the request.

**Special Requirements:**
- The System must provide responses within a reasonable time frame.
- The UI should be user-friendly and support easy query submission.
- The System should handle API failures gracefully with fallback mechanisms.

---

## Rationale for Your Use Case Model

Referencing guidelines outlined by Lucidchart, we chose a UML use case diagram to visually represent the system's functional requirements. This approach illustrates interactions between external actors (users or systems) and the system's services, clarifies system boundaries, and captures user goals. This high-level, user-oriented view serves as a foundation for more detailed analysis and design, ensuring all parties have a clear understanding of what the system is expected to do.

- **User Login Use Case Model:** Ensures that only verified employees can access sensitive data.
- **Logout Use Case Model:** Allows verified users to log out easily and supports automatic logout for inactive sessions.
- **Dashboard Use Case Model:** Provides a centralized view of key performance metrics, enhancing decision-making with real-time and historical insights.
- **Report Download Use Case Model:** Details the interaction for creating and downloading reports for future company use and marketing endeavors.
- **GPT Insights Use Case Model:** Outlines the process for obtaining AI-generated insights through the integration of a GPT API.

---

## Non-Functional Requirements

- The site must remain functional as long as the GA4 API is operational.
- Search results should be returned in under 5 seconds.
- The system must support 5 to 10 concurrent users without performance degradation.
- UI components must comply with ARGO QUADS design requirements.

---

## Evidence of Configuration Management

Please find the template from this [link](https://course.techconf.org/se4485/Template/CM-Tool.pdf).

---

## Engineering Standards and Multiple Constraints

- **IEEE Std 830-1998:** Software Requirements [pdf]
- **IEEE Std 29148:** Requirements Engineering [pdf]
- **ISO/IEC/IEEE Std 29148-2018:** Systems and Software Engineering  
  - Life Cycle Processes  
  - Requirements Engineering [pdf]
- Additional standards as suggested by the sponsor(s).

---

## Additional References

- Lamsweerde, A.V., 2009. *Requirements Engineering: From System Goals to UML Models to Software Specifications*. John Wiley.
- “UML Use Case Diagram Tutorial.” Lucidchart, [https://www.lucidchart.com/pages/uml-use-case-diagram](https://www.lucidchart.com/pages/uml-use-case-diagram). Accessed 21 Feb. 2025.
- [IEEE Std 830-1998-Software-Requirements.pdf](https://course.techconf.org/se4485/IEEE/IEEE%20Std%20830-1998-Software-Requirements.pdf)
- [IEEE 29148 (2011) - Requirements Engineering.pdf](https://course.techconf.org/se4485/IEEE/IEEE%2029148%20(2011)%20-%20Requirements%20Engineering.pdf)
- [ISO/IEC/IEEE 29148-2018.pdf](https://course.techconf.org/se4485/IEEE/ISO-IEC-IEEE-29148-2018.pdf)

---

## List of Figures (Recap)

- **Figure 1.0:** Use Case Model for User Log In  
- **Figure 1.1:** Use Case Model for User Logout  
- **Figure 1.2:** Use Case Model for Request Engagement Metrics  
- **Figure 1.3:** Use Case Model for Report Download  
- **Figure 1.4:** Use Case Model for GPT Insights

