# SE 4485: Software Engineering Projects

**Spring 2025**

# Architecture Documentation

## Group Information

- **Group Number:** Group 12
- **Project Title:** Marketing Intelligence Platform Team B
- **Sponsoring Company:** ARGO
- **Sponsor(s):** Ponchai Reainthong, Raisa Gonzalez, Goitom Kassaye

## Students

1. Jon Grimes
2. Zara Iqbal
3. Eric Medina
4. Nicolas De la Cruz Velasquez
5. Jesse Incoom

---

## Title Page

Marketing Intelligence Platform - Architecture Documentation

---

## Abstract

This document outlines the architecture of the Marketing Intelligence Platform developed for ARGO. The platform is designed to provide comprehensive analytics and insights through a modern web application interface. It integrates with Google Analytics 4 (GA4) to deliver real-time and historical marketing data visualization, user behavior analysis, and performance metrics.

---

## Table of Contents

1. Introduction
2. Architectural Style(s) Used
3. Architectural Model
4. Technology Stack
5. System Components
6. Data Flow
7. Security Considerations
8. Deployment Architecture
9. Future Considerations

---

## Introduction

The Marketing Intelligence Platform is a web-based application designed to provide ARGO with comprehensive marketing analytics and insights. The platform integrates with Google Analytics 4 to deliver real-time and historical data visualization, user behavior analysis, and performance metrics.

### Purpose and Scope

The purpose of this document is to provide a comprehensive overview of the system's architecture, including:
- System components and their interactions
- Technology choices and rationale
- Data flow and processing
- Security considerations
- Deployment architecture

### Document Structure

This document is organized to provide a clear understanding of the system's architecture, from high-level concepts to specific implementation details.

---

## Architectural Style(s) Used

The application follows a modern web architecture with the following key characteristics:

1. **Frontend-Backend Separation**
   - React-based frontend for user interface
   - Node.js backend for API handling and data processing
   - Clear separation of concerns between presentation and business logic

2. **Component-Based Architecture**
   - Modular React components for UI elements
   - Reusable components for common functionality
   - Clear component hierarchy and data flow

3. **RESTful API Design**
   - Standardized API endpoints for data retrieval
   - Stateless communication between frontend and backend
   - Clear API versioning and documentation

4. **Microservices Architecture**
   - Separate services for analytics processing
   - Independent deployment of frontend and backend
   - Scalable and maintainable system design

---

## Architectural Model

The system is divided into the following major subsystems:

1. **Frontend Subsystem**
   - User Interface Components
   - State Management
   - API Integration Layer
   - Theme Management

2. **Backend Subsystem**
   - API Handler
   - Data Processing
   - Authentication Service
   - Analytics Integration

3. **Data Storage Subsystem**
   - Google Analytics 4 Integration
   - Local Storage Management
   - Cache Management

4. **Security Subsystem**
   - Authentication
   - Authorization
   - API Security
   - Data Encryption

---

## Technology, Software, and Hardware Used

### Frontend Technologies
- React.js (v18.3.1)
- Material-UI (v6.4.6)
- Highcharts (v12.1.2)
- React Router (v7.1.5)
- Axios (v1.8.1)

### Backend Technologies
- Node.js
- Express.js
- Google Analytics Data API
- Firebase Authentication

### Development Tools
- VS Code
- Git & GitHub
- npm/yarn package manager

### Hardware Requirements
- Modern web browser
- Internet connection

### Communication Architecture
- RESTful API communication between frontend and backend
- Secure WebSocket connections for real-time updates
- OAuth 2.0 for authentication
- HTTPS for secure data transmission

---

## Rationale for Architectural Style and Model

The chosen architecture provides several key benefits:

1. **Scalability**
   - Microservices architecture allows independent scaling
   - Component-based design enables easy feature additions
   - Modular structure supports future enhancements

2. **Maintainability**
   - Clear separation of concerns
   - Standardized coding practices
   - Comprehensive documentation

3. **Performance**
   - Efficient data processing
   - Optimized frontend rendering
   - Caching mechanisms

4. **Security**
   - Secure authentication flow
   - Protected API endpoints
   - Data encryption

---

## Traceability from Requirements to Architecture

The architecture directly maps to the following key requirements from the Requirements Documentation:

1. **User Authentication Requirements**
   - **Requirement:** User needs to log in with ARGO credentials
   - **Architectural Implementation:**
     - Frontend: Login component with Material-UI form elements
     - Backend: Firebase Authentication service integration
     - Security: OAuth 2.0 implementation for secure authentication
     - State Management: Session handling and token management
     - Routing: Protected route implementation for authenticated users

2. **Dashboard and Analytics Requirements**
   - **Requirement:** Request Engagement Metrics
   - **Architectural Implementation:**
     - Frontend Components:
       - Dashboard layout with responsive grid system
       - Highcharts integration for data visualization
       - Custom data grid for metric display
       - Real-time data update mechanisms
     - Backend Services:
       - GA4 API integration for data retrieval
       - Data processing and aggregation services
       - Caching layer for performance optimization
     - API Layer:
       - RESTful endpoints for metric retrieval
       - WebSocket connections for real-time updates
       - Rate limiting and request validation

3. **Report Generation Requirements**
   - **Requirement:** Report Download functionality
   - **Architectural Implementation:**
     - Frontend Components:
       - Report configuration interface
       - Preview component
       - Download options (PDF/Excel)
     - Backend Services:
       - Report generation service
       - File format conversion service
       - Storage management for generated reports
     - Performance Optimization:
       - Asynchronous report generation
       - Caching of frequently requested reports
       - Background processing for large reports

4. **AI Integration Requirements**
   - **Requirement:** GPT Insights functionality
   - **Architectural Implementation:**
     - Frontend Components:
       - Query input interface
       - Loading state management
       - Response display component
     - Backend Services:
       - GPT API integration service
       - Query processing and validation
       - Response formatting service
     - Error Handling:
       - Fallback mechanisms
       - Retry logic
       - Error state management

5. **Non-Functional Requirements**
   - **Performance Requirements:**
     - Implemented through:
       - Frontend optimization (React.memo, useMemo, useCallback)
       - Backend caching strategies
       - Database query optimization
       - Load balancing configuration
   
   - **Scalability Requirements:**
     - Implemented through:
       - Microservices architecture
       - Containerization support
       - Horizontal scaling capabilities
       - Database sharding support

   - **Security Requirements:**
     - Implemented through:
       - Authentication service
       - API security layer
       - Data encryption
       - Input validation
       - XSS protection
       - CSRF protection

   - **UI/UX Requirements:**
     - Implemented through:
       - Material-UI component library
       - Responsive design system
       - Theme management
       - Accessibility compliance
       - ARGO QUADS design system integration

6. **System Integration Requirements**
   - **GA4 Integration:**
     - Implemented through:
       - GA4 API client service
       - Data transformation layer
       - Error handling and retry logic
       - Rate limiting implementation

   - **Firebase Integration:**
     - Implemented through:
       - Authentication service
       - User management
       - Session handling
       - Security rules

7. **Data Management Requirements**
   - **Data Storage:**
     - Implemented through:
       - Local storage for user preferences
       - Cache management for frequently accessed data
       - Session storage for temporary data
       - IndexedDB for offline capabilities

   - **Data Processing:**
     - Implemented through:
       - Data transformation services
       - Aggregation pipelines
       - Real-time processing capabilities
       - Batch processing for large datasets

This traceability matrix ensures that each requirement from the Requirements Documentation is properly implemented in the system architecture, with clear mapping between requirements and their architectural components.

---

## Evidence the Document Has Been Placed Under Configuration Management

This document is version controlled using Git and stored in the project repository. Changes are tracked and documented through commit history.

---

## Engineering Standards and Multiple Constraints

The project adheres to the following standards:

1. **IEEE Std 1471-2000: Software Architecture**
   - Clear architectural documentation
   - Stakeholder concerns addressed
   - System context defined

2. **ISO/IEC/IEEE Std 42030-2019**
   - Architecture evaluation framework
   - Quality attributes assessment
   - Trade-off analysis

---

## Additional References

- Lattanze, A.J., 2008. *Architecting Software Intensive Systems: A Practitioner's Guide*. CRC Press.
- Bass, L., Clements, P. and Kazman, R., 2003. *Software Architecture in Practice*. Addison-Wesley.
- [IEEE Std 1471-2000: Software Architecture](https://course.techconf.org/se4485/IEEE/IEEE-Std-1471-2000-Software-Architecture.pdf)
- [ISO/IEC/IEEE 42030-2019](https://course.techconf.org/se4485/IEEE/ISO-IEC-IEEE-42030-2019.pdf)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Google Analytics Documentation](https://developers.google.com/analytics)
