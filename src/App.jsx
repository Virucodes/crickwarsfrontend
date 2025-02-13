import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/RegisterPage';
import AuctionPage from './components/AuctionPage';
import RankingsPage from './components/RankingPage';
import ThankYouPage from './components/ThankYouPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teamData, setTeamData] = useState({
    name: '',
    purchasedPlayers: [],
    budget: 10000
  });

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setTeamData((prev) => ({
      ...prev,
      name: username
    }));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Routes>

        <Route path="/thank-you" element={<ThankYouPage />} />
          <Route 
            path="/" 
            element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/auction" replace />} 
          />

          

          <Route 
            path="/auction" 
            element= <AuctionPage teamData={teamData} />
          />

          <Route 
            path="/rankings" 
            element=<RankingsPage teamData={teamData} />  
          />

          <Route path="*" element={<Navigate to="/" replace />} />

          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
