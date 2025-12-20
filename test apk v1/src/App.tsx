import { Routes, Route, Navigate } from 'react-router-dom';
import { TestProvider } from './contexts/TestContext';
import Login from './pages/Login';
import Test from './pages/Test';

function App() {
  return (
    <TestProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<Test />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </TestProvider>
  );
}

export default App;
