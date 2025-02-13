import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route exact path="/" Component={Dashboard} />
      </Routes>
    </BrowserRouter>
  );

}

export default App;
