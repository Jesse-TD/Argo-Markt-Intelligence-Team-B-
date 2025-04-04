# SE 4485: Software Engineering Projects

**Spring 2025**

# Detailed Design Documentation

---

## Group Information

- **Group Number:** Group 12
- **Project Title:** Marketing Intelligence Platform Team B
- **Sponsoring Company:** ARGO
- **Sponsor(s):** Ponchai Reainthong, Raisa Gonzalez, Goitom Kassaye
- **Students:**
  1. Jon Grimes
  2. Zara Iqbal
  3. Eric Medina
  4. Nicolas De la Cruz Velasquez
  5. Jesse Incoom

---

## ABSTRACT

This document presents the detailed design specifications for the Marketing Intelligence Platform developed by Team B for ARGO. It outlines the architectural structure, user interface layouts, and design models, including class and sequence diagrams. The design decisions are supported by a clear rationale and traceability from the original requirements. Standardization outlined by IEEE Std 1016-1998 has been followed, and configuration management has been implemented to ensure maintainability. This document serves as a bridge between requirements and implementation phases in order to ensure that the design meets functional expectations and aligns with industry standards.

---

## TABLE OF CONTENTS

- [ABSTRACT](#abstract)
- [TABLE OF CONTENTS](#table-of-contents)
- [LIST OF FIGURES](#list-of-figures)
- [LIST OF TABLES](#list-of-tables)
- [INTRODUCTION](#introduction)
- [GUI (Graphical User Interface) Design](#gui-graphical-user-interface-design)
- [STATIC MODEL CLASS DIAGRAMS](#static-model-class-diagrams)
- [DYNAMIC MODEL SEQUENCE DIAGRAMS](#dynamic-model-sequence-diagrams)
- [RATIONALE FOR YOUR DETAILED DESIGN MODEL](#rationale-for-your-detailed-design-model)
- [TRACEABILITY FROM REQUIREMENTS TO DETAILED DESIGN MODEL](#traceability-from-requirements-to-detailed-design-model)
- [EVIDENCE THE DESIGN MODEL HAS BEEN PLACED UNDER CONFIGURATION MANAGEMENT](#evidence-the-design-model-has-been-placed-under-configuration-management)
- [ENGINEERING STANDARDS AND MULTIPLE CONSTRAINTS](#engineering-standards-and-multiple-constraints)
- [ADDITIONAL REFERENCES](#additional-references)

---

## LIST OF FIGURES

*(List of figures, if applicable)*

---

## LIST OF TABLES

*(List of tables, if applicable)*

---

## INTRODUCTION

This document outlines the detailed design for the Marketing Intelligence Platform developed for ARGO. It builds upon the requirements specified in the Requirements Documentation and provides a comprehensive technical blueprint for implementation. The design encompasses architecture, interfaces, data models, security considerations, and interaction patterns to ensure a robust, scalable, and user-friendly marketing analytics platform.

---

## GUI (Graphical User Interface) Design

Screen designs (coded or using drawing tool):

- **Login Screen**
  ![GUI1](https://github.com/user-attachments/assets/e3650fa4-9ee4-47c7-94f2-2c357408100f)

- **Side Menu Screen**
![GUI2](https://github.com/user-attachments/assets/4d43bfbf-1c7f-4758-abcf-be59f095bc40)

- **Dashboard Screen**
![GUI3](https://github.com/user-attachments/assets/22eca680-d5e1-4576-b32b-917b22ca7a63)

- **Reports Screen**
![GUI4](https://github.com/user-attachments/assets/2e62e417-b701-49ea-9a9d-84d16b087864)

---

## STATIC MODEL CLASS DIAGRAMS

Captured in Rose (other tools are also allowed):

- **Class Diagram**
  - ![ClassDiagram](https://github.com/user-attachments/assets/e3bdb2a5-fb6b-49bc-bb0c-7418193ab198)


---

## DYNAMIC MODEL SEQUENCE DIAGRAMS

- **Query Info for Report Section**
  - ![Log In and Generate Graphs](https://github.com/user-attachments/assets/7d6b1d8b-f83d-481d-9eff-8db9cd4d3d7e)

- **Create Report**
  - ![Create Reports](https://github.com/user-attachments/assets/46296f8d-a1c7-462e-9ed4-f2419b5c45a2)

- **Chat With AI Assistant**
  - ![Chat with AI Assistant](https://github.com/user-attachments/assets/7ef7febf-907f-496f-875e-bc2082668974)


---

## RATIONALE FOR YOUR DETAILED DESIGN MODEL

- Designed to meet both functional and non-functional requirements (scalability, maintainability, usability).
- Uses modular, microservice-based architecture for separation of concerns.
- Integrates LlamaIndex (LLM) as a customizable, lightweight alternative to LangChain.
- Closely aligns data models with GA4 schema for seamless ingestion.
- Includes a chatbot UI to enable natural language interaction with marketing data.
- Supports real-time queries and scheduled report generation.
- Designed with extensibility in mind for adding future analytics or data sources.

---

## TRACEABILITY FROM REQUIREMENTS TO DETAILED DESIGN MODEL

The following table demonstrates how each requirement from the Requirements Documentation is addressed in the detailed design, ensuring complete requirements coverage:

| Requirement ID | Requirement Description | Design Component | Implementation Details |
|----------------|-------------------------|------------------|------------------------|
| REQ-1 | User needs to log in with ARGO credentials | - AuthController class<br>- Login UI component<br>- Authentication API endpoints<br>- Sequence diagram: Query Info for Report Section | - JWT-based authentication<br>- Login UI with error handling<br>- Google OAuth integration<br>- Authentication token validation |
| REQ-2 | User Logout | - AuthController class<br>- Logout UI component<br>- Session management service | - Token invalidation<br>- Session state cleanup<br>- Audit logging<br>- Redirect to login screen |
| REQ-3 | Request Engagement Metrics | - ApiHandler class<br>- QueryManager class<br>- Dashboard UI components<br>- MainGrid component<br>- Class diagram: Backend Classes | - GA4 API integration<br>- Data transformation services<br>- Metric visualization components<br>- Caching for frequently accessed data |
| REQ-4 | Report Download | - ReportGenerator class<br>- ReportManager class<br>- Export Service<br>- Sequence diagram: Create Report | - PDF/Excel export functionality<br>- Report templates<br>- Report caching<br>- Export formats with user selection |
| REQ-5 | GPT Insights | - AiService class<br>- ChatInterface component<br>- AI API endpoints<br>- Sequence diagram: Chat With AI Assistant | - OpenAI API integration<br>- Context-aware queries<br>- Natural language processing<br>- Fallback mechanisms for API failures |
| NF-REQ-1 | System operational when GA4 API is available | - ApiHandler error handling<br>- Monitoring services<br>- Fallback data caching | - Health check mechanisms<br>- Monitoring dashboards<br>- Graceful error handling<br>- Data caching strategies |
| NF-REQ-2 | Search results in under 5 seconds | - Query optimization<br>- Result caching<br>- Performance testing framework | - Indexed database queries<br>- Multi-tier caching strategy<br>- Load testing benchmarks<br>- Performance monitoring |
| NF-REQ-3 | Support 5-10 concurrent users | - Load balancing design<br>- Auto-scaling architecture<br>- Cloud infrastructure | - Elastic scaling policies<br>- Resource optimization<br>- Connection pooling<br>- Request queuing |
| NF-REQ-4 | UI compliant with ARGO QUADS | - Component library<br>- UI theme providers<br>- Design system integration | - Standardized component usage<br>- Theme consistency<br>- Design token implementation<br>- Responsive layouts |

### Requirement-to-Design Mapping Process

1. **Authentication Requirements (REQ-1, REQ-2)**
   - The design incorporates the AuthController class with specific methods for authenticating users, validating tokens, and revoking sessions
   - The login and logout sequence flows are clearly defined in the sequence diagrams
   - Security design includes JWT tokens and secure password handling as specified

2. **Data Processing Requirements (REQ-3)**
   - The ApiHandler and QueryManager classes are designed specifically to handle GA4 API integration
   - Data transformation components handle the conversion of raw analytics data into usable formats
   - Caching mechanisms are implemented to optimize performance for frequently accessed metrics

3. **Reporting Requirements (REQ-4)**
   - The ReportGenerator and ReportManager classes provide the functionality for generating and exporting reports
   - The sequence diagram for report creation shows the complete flow from user selection to delivery
   - Export options support both PDF and Excel formats as required

4. **AI Integration Requirements (REQ-5)**
   - The AiService class manages integration with the OpenAI GPT API
   - The Chat With AI Assistant sequence diagram outlines the process for natural language queries
   - Error handling mechanisms address potential API failures as specified

5. **Non-Functional Requirements**
   - Performance requirements (NF-REQ-2, NF-REQ-3) are addressed through caching, load balancing, and cloud architecture
   - UI compliance (NF-REQ-4) is ensured through the implementation of ARGO's QUADS design system
   - System availability (NF-REQ-1) is maintained through monitoring and fallback mechanisms

This traceability matrix ensures that every requirement identified in the Requirements Documentation is implemented in the detailed design, providing clear linkage between user needs and the technical solution.

## ENGINEERING STANDARDS AND MULTIPLE CONSTRAINTS

- IEEE Std 1016-1998-(Revision-2009): Software Design [pdf]

---

## ADDITIONAL REFERENCES

- **Larman, C.** (2012). *Applying UML and Patterns: An Introduction to Object Oriented Analysis and Design and Iterative Development.* Pearson Education.
- **Hyman, B.** (1998). *Fundamentals of Engineering Design.* New Jersey: Prentice Hall.
- **Simon, H.A.** (2014). *A Student's Introduction to Engineering Design: Pergamon Unified Engineering Series (Vol. 21).* Elsevier.
