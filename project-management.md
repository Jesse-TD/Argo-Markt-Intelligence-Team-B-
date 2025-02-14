# Project Management Plan

**SE 4485: Software Engineering Projects**  
**Spring 2025**

**Project Title:** Marketing Intelligence Platform Team B  
**Group Number:** 12  
**Sponsoring Company:** ARGO  

**Sponsor(s):**  
- Ponchai Reainthong  
- Raisa Gonzalez  
- Goitom Kassaye  

**Students:**  
- Jesse Incoom  
- Jon Grimes  
- Eric Medina  
- Nicolas De la Cruz Velasquez  
- Zara Iqbal

---

## Abstract

A brief summary of the entire document.

---

## Table of Contents

- [List of Figures](#list-of-figures)
- [List of Tables](#list-of-tables)
- [Project Organization](#project-organization)
- [Lifecycle Model Used](#lifecycle-model-used)
- [Risk Analysis](#risk-analysis)
- [Software and Hardware Resource Requirements](#software-and-hardware-resource-requirements)
- [Deliverables and Schedule](#deliverables-and-schedule)
  - [Phase 1: February 3 – March 17](#phase-1-february-3--march-17)
  - [Phase 2: March 18 – April 28](#phase-2-march-18--april-28)
- [Monitoring, Reporting, and Controlling Mechanisms](#monitoring-reporting-and-controlling-mechanisms)
- [Professional Standards](#professional-standards)
- [Evidence the Document Has Been Placed Under Configuration Management](#evidence-the-document-has-been-placed-under-configuration-management)
- [Engineering Standards and Multiple Constraints](#engineering-standards-and-multiple-constraints)
- [Additional References](#additional-references)
- [Appendix A](#appendix-a)

---

## Introduction

This document serves as a means to record and log the project plan as it develops throughout its life cycle while serving as a reference for all stakeholders. It provides a clear roadmap for implementation, resource allocation, and risk management. The document ensures alignment between technical and business goals while facilitating data-driven decision making.

The product will serve as an advanced marketing analytics platform for ARGO. Users will be able to see data gathered by GA4 in a clean and digestible manner and will gain real-world insight into the data’s significance with the help of Chat-GPT integration.

---

## Project Organization

- **Jesse** – Back-end / ML engineer  
- **Jon** – Back-end / ML engineer  
- **Eric** – Head of Front-end engineering  
- **Nicolas** – Back-end / ML engineer  
- **Zara** – Head of UI/UX, Front-end engineer

---

## Lifecycle Model Used

- **Agile Model** is chosen for this project due to its alignment with the fast-paced timeline, enabling iterative development, quick adaptability, and continuous feedback.
- This approach ensures efficient prioritization, parallel workstreams, and risk mitigation by delivering functional increments early and refining them based on stakeholder input.
- Overall, the Agile model maximizes productivity, minimizes last-minute surprises, and maintains flexibility for any changes in requirements, ensuring the project stays on track and delivers value efficiently.

---

## Risk Analysis

- **Risk:** Non-ARGO employees being able to access the website.  
  **Prevention:** Implement Single Sign-On (SSO).

- **Risk:** Unauthorized API access.  
  **Prevention:** Use a secure `.env` file to hide API keys.

- **Risk:** Scope creep.  
  **Prevention:** Utilize agile project management and clearly define the project scope.

---

## Software and Hardware Resource Requirements

**Hardware:**  
- Desktop Computer/Laptop

**Software:**  
- **Operating System:** Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+)  
- **Code Editor/IDE:** VS Code  
- **Version Control:** Git & GitHub  
- **API Development:** TBD  
- **Testing Frameworks:** TBD

**Programming Languages & Libraries:**  
- **Frontend Development:** React.js, MaterialUI, Highcharts  
- **Backend Development:** Node.js, Express.js  
- **Authentication & Security:** Building a custom SSO integration  
- **UI/UX Design:** Figma

---

## Deliverables and Schedule

### Phase 1: February 3 – March 17

#### Deep Dive into GA4 API (February 3 – February 10)
- **Objective:** Gain a comprehensive understanding of the GA4 API.
- **Tasks:**
  - Research and document the core functionalities of the GA4 API.
  - Identify key analytics and metrics that will drive the project.

#### Data Extraction & Analysis (February 11 – February 24)
- **Objective:** Learn to effectively query the API and analyze the data.
- **Tasks:**
  - Develop and test API queries to retrieve valuable data.
  - Analyze the raw data to uncover actionable insights.

#### Visualization & Reporting (February 25 – March 17)
- **Objective:** Transform raw data into engaging, user-friendly visual representations.
- **Tasks:**
  - Design and build charts that clearly illustrate key trends and insights.
  - Prepare reports that effectively communicate the findings from the data analysis.

### Phase 2: March 18 – April 28

#### Dynamic Search Implementation (March 18 – March 31)
- **Objective:** Integrate a dynamic search function powered by Chat-GPT.
- **Tasks:**
  - Set up and configure the Chat-GPT environment for the search functionality.
  - Begin integration with the existing data analytics framework.

#### Intuitive Query Capability (April 1 – April 14)
- **Objective:** Enable users to perform natural language queries for a more intuitive data exploration.
- **Tasks:**
  - Refine the Chat-GPT integration to handle conversational queries.
  - Test the dynamic search feature to ensure it returns accurate and useful results.

#### Enhanced User Experience (April 15 – April 28)
- **Objective:** Streamline the data retrieval process and make analytics more accessible.
- **Tasks:**
  - Optimize the user interface to support the new dynamic search function.
  - Gather user feedback and make final adjustments to enhance usability and engagement.

---

## Monitoring, Reporting, and Controlling Mechanisms

- **Project Status & Sprint Reports:** Ensure that development is progressing on schedule and blockers are identified early.
- **Risk Assessment Reports:** Help mitigate potential technical or business risks before they become major issues.
- **API Performance Reports:** Ensure system stability and highlight inefficiencies in data retrieval.
- **User Feedback Reports:** Ensure that the platform meets user expectations and usability needs.
- **Budget & Resource Reports:** Help control costs and avoid overspending.
- **Final Reports:** Provide insights for future projects and company-wide improvements.

---

## Professional Standards

- Team members should have a complete understanding of the work they produce.
- Team members are expected to attend all scheduled meetings.
- Plagiarism, unauthorized code copying, or falsification of results is strictly prohibited.
- Any external code, tools, or libraries must be properly documented and comply with open-source licenses (refer to Appendix A for more details).

---

## Evidence the Document Has Been Placed Under Configuration Management

- **Configuration Management Tool (CV):** Google Docs
- **Versioning:**  
  - Each document’s version is recorded both before check-out and after check-in.
- **Change Documentation:**  
  - The difference between consecutive versions is tracked.
  - Each change undergoes at least two reviews (by team members other than the author) and receives “ship-it” approval to ensure correctness.
- **Additional Information:** Any other details that help in understanding each change are documented.

---

## Engineering Standards and Multiple Constraints

- **IEEE 12207:2017:** Systems and Software Engineering – Software Life Cycle Processes  
- **IEEE 29148:2018:** Systems and Software Engineering – Requirements Engineering  
- **IEEE Std 1016-2009:** IEEE Recommended Practice for Software Design Descriptions  
- **IEEE P3123:** Standard for Artificial Intelligence and Machine Learning (AI/ML) Terminology and Data Formats

---

## Additional References

- [IEEE Standards](https://standards.ieee.org/)
- [ARGO Data Quads](https://quads.argodata.com/)
- [IEEE/ISO/IEC 12207:2017](https://standards.ieee.org/standard/12207-2017.html)
- [IEEE/ISO/IEC 29148:2018](https://standards.ieee.org/standard/29148-2018.html)
- [IEEE Std 1016-2009](https://standards.ieee.org/standard/1016-2009.html)
- [IEEE P3123](https://standards.ieee.org/ieee/3123/10744/)

---

## Appendix A

### Guideline

- **First Occurrence:** Determine the circumstances involved, resolve the problem, and document the event in the meeting minutes.
- **Second Occurrence:** Notify the instructor of the problem. A meeting will be set up to evaluate and resolve the situation.
- **Third Occurrence:** Again notify the instructor. A meeting will be arranged to evaluate the issue. At this point, the team may opt to remove the team member. If removed, the team member receives a pro-rated grade based on the number of weeks they participated.

**Examples of Unacceptable Behavior:**  
- Not delivering work on time  
- Delivering poor quality work  
- Missing team meetings  
- Being unprepared for meetings  
- Disrespectful or rude behavior

**Unacceptable Excuses:**  
- “Too busy”  
- “I forgot”  
- “My dog ate my design model”

**Valid Reasons:**  
- Illness  
- Death in the family  
- Travel for business or academic reasons
