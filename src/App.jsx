import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/RegisterPage';
import AuctionPage from './components/AuctionPage';
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

          

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


// import { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import RegisterPage from './components/RegisterPage';
// import AuctionPage from './components/AuctionPage';
// import RankingsPage from './components/RankingPage';
// import ThankYouPage from './components/ThankYouPage';

// function App() {
//   // Check if user is authenticated on initial load
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return localStorage.getItem('group2_id') !== null;
//   });

//   const [teamData, setTeamData] = useState({
//     name: localStorage.getItem('username') || '',
//     purchasedPlayers: [],
//     budget: 10000
//   });

//   // Update authentication state when localStorage changes
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const group2_id = localStorage.getItem('group2_id');
//       const username = localStorage.getItem('username');
      
//       setIsAuthenticated(group2_id !== null);
//       setTeamData(prev => ({
//         ...prev,
//         name: username || ''
//       }));
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const handleLogin = (username) => {
//     setIsAuthenticated(true);
//     setTeamData(prev => ({
//       ...prev,
//       name: username
//     }));
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('group2_id');
//     localStorage.removeItem('username');
//     setIsAuthenticated(false);
//     setTeamData({
//       name: '',
//       purchasedPlayers: [],
//       budget: 10000
//     });
//   };

//   // Protected Route component
//   const ProtectedRoute = ({ children }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" replace />;
//     }
//     return children;
//   };

//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//         <Routes>
//           {/* Public Routes */}
//           <Route 
//             path="/login" 
//             element={
//               isAuthenticated ? 
//                 <Navigate to="/auction" replace /> : 
//                 <LoginPage onLogin={handleLogin} />
//             } 
//           />
          
//           <Route 
//             path="/register" 
//             element={
//               isAuthenticated ? 
//                 <Navigate to="/auction" replace /> : 
//                 <RegisterPage onLogin={handleLogin} />
//             } 
//           />

//           <Route path="/thank-you" element={<ThankYouPage />} />

//           {/* Protected Routes */}
//           <Route
//             path="/auction"
//             element={
//               <ProtectedRoute>
//                 <AuctionPage 
//                   teamData={teamData} 
//                   onLogout={handleLogout}
//                 />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/rankings"
//             element={
//               <ProtectedRoute>
//                 <RankingsPage 
//                   teamData={teamData}
//                   onLogout={handleLogout}
//                 />
//               </ProtectedRoute>
//             }
//           />

//           {/* Default Routes */}
//           <Route 
//             path="/" 
//             element={
//               isAuthenticated ? 
//                 <Navigate to="/auction" replace /> : 
//                 <Navigate to="/login" replace />
//             } 
//           />
          
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { useState, useEffect } from 'react';
// import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import LoginPage from './components/LoginPage';
// import RegisterPage from './components/RegisterPage';
// import AuctionPage from './components/AuctionPage';
// import RankingsPage from './components/RankingPage';
// import ThankYouPage from './components/ThankYouPage';

// function App() {
//   // Initialize authentication state from localStorage
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     const group2_id = localStorage.getItem('group2_id');
//     const username = localStorage.getItem('username');
//     return !!(group2_id && username); // Convert to boolean
//   });

//   // Initialize team data from localStorage
//   const [teamData, setTeamData] = useState(() => ({
//     name: localStorage.getItem('username') || '',
//     purchasedPlayers: [],
//     budget: 10000
//   }));

//   // Check authentication on mount and localStorage changes
//   useEffect(() => {
//     const checkAuthStatus = () => {
//       const group2_id = localStorage.getItem('group2_id');
//       const username = localStorage.getItem('username');
      
//       if (group2_id && username) {
//         setIsAuthenticated(true);
//         setTeamData(prev => ({
//           ...prev,
//           name: username
//         }));
//       } else {
//         setIsAuthenticated(false);
//         setTeamData(prev => ({
//           ...prev,
//           name: ''
//         }));
//       }
//     };

//     // Check on mount
//     checkAuthStatus();

//     // Listen for changes in other tabs/windows
//     window.addEventListener('storage', checkAuthStatus);
    
//     return () => {
//       window.removeEventListener('storage', checkAuthStatus);
//     };
//   }, []);

//   const handleLogin = (username) => {
//     setIsAuthenticated(true);
//     setTeamData(prev => ({
//       ...prev,
//       name: username
//     }));
//   };

//   const handleLogout = () => {
//     // Clear localStorage
//     localStorage.removeItem('group2_id');
//     localStorage.removeItem('username');
    
//     // Reset state
//     setIsAuthenticated(false);
//     setTeamData({
//       name: '',
//       purchasedPlayers: [],
//       budget: 10000
//     });
//   };

//   // Protected Route component with persistent login check
//   const ProtectedRoute = ({ children }) => {
//     const group2_id = localStorage.getItem('group2_id');
//     const username = localStorage.getItem('username');
    
//     if (!group2_id || !username) {
//       return <Navigate to="/login" replace />;
//     }
    
//     return children;
//   };

//   // Public Route component that redirects to auction if already logged in
//   const PublicRoute = ({ children }) => {
//     const group2_id = localStorage.getItem('group2_id');
//     const username = localStorage.getItem('username');
    
//     if (group2_id && username) {
//       return <Navigate to="/auction" replace />;
//     }
    
//     return children;
//   };

//   return (
//     <BrowserRouter>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//         <Routes>
//           {/* Public routes with automatic redirect if logged in */}
//           <Route 
//             path="/login" 
//             element={
//               <PublicRoute>
//                 <LoginPage onLogin={handleLogin} />
//               </PublicRoute>
//             } 
//           />
          
//           <Route 
//             path="/register" 
//             element={
//               <PublicRoute>
//                 <RegisterPage onLogin={handleLogin} />
//               </PublicRoute>
//             } 
//           />

//           <Route path="/thank-you" element={<ThankYouPage />} />

//           {/* Protected routes with persistent login check */}
//           <Route
//             path="/auction"
//             element={
//               <ProtectedRoute>
//                 <AuctionPage 
//                   teamData={teamData} 
//                   onLogout={handleLogout}
//                 />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/rankings"
//             element={
//               <ProtectedRoute>
//                 <RankingsPage 
//                   teamData={teamData}
//                   onLogout={handleLogout}
//                 />
//               </ProtectedRoute>
//             }
//           />

//           {/* Root route with automatic redirect */}
//           <Route 
//             path="/" 
//             element={
//               isAuthenticated ? 
//                 <Navigate to="/auction" replace /> : 
//                 <Navigate to="/login" replace />
//             } 
//           />
          
//           {/* Catch all route */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;