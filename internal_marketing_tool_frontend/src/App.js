import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Login from "./pages/Login";
import Reports from './dashboard/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
