import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ResourceAllocation from './pages/ResourceAllocation';
import Reports from './pages/Reports';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/resource-allocation" element={<ResourceAllocation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
