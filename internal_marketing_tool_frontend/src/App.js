import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
