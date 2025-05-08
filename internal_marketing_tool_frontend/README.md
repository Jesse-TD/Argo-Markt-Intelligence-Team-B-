# Internal Marketing Tool 

A React-based project for internal marketing analytics, powered by GA4 and OpenAI.

##  Features

-  Dynamic data visualizations with MUI and Highcharts
-  AI-generated insights with OpenAI and LlamaIndex
-  Google Analytics 4 (GA4) reporting
-  Exportable dashboards (PDF, screenshots)
-  Firebase authentication

##  Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm (comes with Node.js)

### Install Dependencies
```bash
npm ci
```

### Start the Backend Server
```bash
cd internal_marketing_tool_frontend\src\backend
node server.js
```

### Start the Development Server
```bash
cd internal_marketing_tool_frontend
npm start
```
The app will be available at `http://localhost:3000`

## Environment Variables

Place the following files in `src/backend/`:
- `credentials.json` – contains your Google Analytics 4 credentials
- `openAi_creds.json` – contains your OpenAI API key

##  Folder Structure
```plaintext
src/
  backend/          # backend components
  dashboard/        # UI components
  pages/            # Main views
  App.js            # routing page
  firebase.js
  index.js
```

##  Key Dependencies

- @babel/plugin-proposal-private-property-in-object@7.21.11  
- @emotion/react@11.14.0  
- @emotion/styled@11.14.0  
- @fontsource/roboto@5.1.1  
- @google-analytics/data@4.12.1  
- @mui/icons-material@6.4.6  
- @mui/material@6.4.6  
- @mui/x-charts@7.26.0  
- @mui/x-data-grid@7.26.0  
- @mui/x-date-pickers@7.26.0  
- @mui/x-tree-view@7.26.0  
- @react-spring/web@9.7.5  
- axios@1.8.1  
- body-parser@2.2.0  
- cors@2.8.5  
- dayjs@1.11.13  
- dotenv@16.5.0  
- firebase@11.4.0  
- highcharts@12.1.2  
- highcharts-react-official@3.2.1  
- html2canvas@1.4.1  
- jspdf@3.0.1  
- llamaindex@0.9.19  
- node-cache@5.1.2  
- openai@4.93.0  
- react@18.3.1  
- react-dom@18.3.1  
- react-markdown@10.1.0  
- react-router-dom@7.1.5  
- react-scripts@5.0.1  
- remark-gfm@4.0.1  
- web-vitals@4.2.4  
- zod@3.24.3  
