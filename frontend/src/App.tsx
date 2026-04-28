import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-900 text-slate-100">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            {/* Additional routes can be added here */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
