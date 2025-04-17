import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Login from "./pages/Login";
import Reports from './dashboard/Reports';
import Assistant from './dashboard/AnalyticsAssistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/data-insights" element={<Assistant/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
