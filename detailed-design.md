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

Provide a mapping between requirements and the detailed design model. Clearly describe how each requirement in the Requirements Documentation is captured in the design.


## ENGINEERING STANDARDS AND MULTIPLE CONSTRAINTS

- IEEE Std 1016-1998-(Revision-2009): Software Design [pdf]

---

## ADDITIONAL REFERENCES

- **Larman, C.** (2012). *Applying UML and Patterns: An Introduction to Object Oriented Analysis and Design and Iterative Development.* Pearson Education.
- **Hyman, B.** (1998). *Fundamentals of Engineering Design.* New Jersey: Prentice Hall.
- **Simon, H.A.** (2014). *A Student's Introduction to Engineering Design: Pergamon Unified Engineering Series (Vol. 21).* Elsevier.
