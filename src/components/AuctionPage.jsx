import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, UserPlus, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STADIUMS = {
  1: { name: "Narendra Modi Stadium, Ahmedabad", currentUsers: 0, maxRating: 65 },
  2: { name: "Wankhede Stadium, Mumbai", currentUsers: 0, maxRating: 65 },
  3: { name: "Chepauk (M. A. Chidambaram Stadium), Chennai", currentUsers: 0, maxRating: 65 },
  4: { name: "Eden Gardens, Kolkata", currentUsers: 0, maxRating: 65 },
  5: { name: "M. Chinnaswamy Stadium, Bengaluru", currentUsers: 0, maxRating: 65 }
};

const TEAM_CONSTRAINTS = {
  Bat: 3,
  Bowl: 3,
  All: 1
};

const SCORE_WEIGHTS = {
  RATING_WEIGHT: 10,           // Base weight for player rating
  STADIUM_EFFECT_WEIGHT: 0.5,  // Weight for stadium effect
  SYNERGY_BONUS: 5,           // Bonus for having full team
  HIGH_RATING_BONUS: 0.1,     // Bonus percentage for ratings >= 8
  DR_WEIGHT: 2                // Weight for backend DR value
};

const PlayersRatingPage = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stadiumName, setStadiumName] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [userScore, setUserScore] = useState(0);
  const [stadiumId, setStadiumId] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [totalTeamRating, setTotalTeamRating] = useState(0);
  const [isTeamComplete, setIsTeamComplete] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.keyCode === 123) {
        e.preventDefault();
      }

      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 85)) {
        e.preventDefault();
      }

      // Prevent Ctrl+S
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
      }
    };

    // Disable copy paste
    const handleCopy = (e) => {
      e.preventDefault();
    };

    // Add event listeners for security
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    document.addEventListener('paste', handleCopy);

    const fetchPlayers = async () => {
      try {
        const group2_id = localStorage.getItem('group2_id');
        
        if (!group2_id) {
          setError("Group ID not found. Please register first.");
          setLoading(false);
          return;
        }

        setStadiumId(group2_id);
        const stadium = STADIUMS[group2_id];
        if (stadium) {
          setStadiumName(stadium.name);
        }

        const response = await axios.get(`https://crickwarsbackend.onrender.com/players/group/${group2_id}`);
        
        const playersWithDR = response.data.map(player => ({
          ...player,
          dr: player.dr || 0 // Use backend DR value
        }));
        
        setPlayers(playersWithDR);
      } catch (err) {
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();


    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
      document.removeEventListener('paste', handleCopy);
    };
  }, []);

  const calculatePlayerScore = (player, rating) => {
    if (!player || !rating) return 0;

    let score = rating * SCORE_WEIGHTS.RATING_WEIGHT;
    score += player.dr * SCORE_WEIGHTS.DR_WEIGHT;

    if (rating >= 8) {
      score += score * SCORE_WEIGHTS.HIGH_RATING_BONUS;
    }

    return score;
  };

  const calculateTotalTeamRating = (currentSelection) => {
    return currentSelection.reduce((total, playerId) => {
      return total + (ratings[playerId] || 0);
    }, 0);
  };

  const calculateTeamScore = () => {
    if (selectedPlayers.length === 0) return 0;

    let totalScore = selectedPlayers.reduce((total, playerId) => {
      const player = players.find(p => p._id === playerId);
      const rating = ratings[playerId];
      return total + calculatePlayerScore(player, rating);
    }, 0);

    const teamStatus = getTeamStatus();
    if (teamStatus.batters === TEAM_CONSTRAINTS.Bat &&
        teamStatus.bowlers === TEAM_CONSTRAINTS.Bowl &&
        teamStatus.allRounders === TEAM_CONSTRAINTS.All) {
      totalScore += SCORE_WEIGHTS.SYNERGY_BONUS;
      setShowThankYou(true);
    } else {
      setShowThankYou(false);
    }

    return totalScore;
  };

  const checkTeamConstraints = (playerId) => {
    const player = players.find(p => p._id === playerId);
    if (!player) return false;

    if (selectedPlayers.includes(playerId)) {
      return true;
    }

    const currentTeamRating = calculateTotalTeamRating(selectedPlayers);
    const newRating = ratings[playerId] || 0;
    if (currentTeamRating + newRating > STADIUMS[stadiumId].maxRating) {
      alert(`Cannot add player. Team rating would exceed maximum of ${STADIUMS[stadiumId].maxRating}`);
      return false;
    }

    const currentTeam = selectedPlayers.map(id => players.find(p => p._id === id));
    const currentCounts = {
      Bat: currentTeam.filter(p => p?.role === "Bat").length,
      Bowl: currentTeam.filter(p => p?.role === "Bowl").length,
      All: currentTeam.filter(p => p?.role === "All").length
    };

    return currentCounts[player.role] < TEAM_CONSTRAINTS[player.role];
  };

  const checkTeamCompletion = (status) => {
    return (
      status.batters === TEAM_CONSTRAINTS.Bat &&
      status.bowlers === TEAM_CONSTRAINTS.Bowl &&
      status.allRounders === TEAM_CONSTRAINTS.All
    );
  };

  const togglePlayerSelection = (playerId) => {
    const isSelected = selectedPlayers.includes(playerId);
    const player = players.find(p => p._id === playerId);
    
    if (isSelected) {
      setSelectedPlayers(prev => {
        const newSelection = prev.filter(id => id !== playerId);
        const newTeamRating = calculateTotalTeamRating(newSelection);
        setTotalTeamRating(newTeamRating);
        
        const newTeamStatus = getTeamStatus();
        setIsTeamComplete(checkTeamCompletion(newTeamStatus));
        
        setTimeout(() => {
          const newScore = calculateTeamScore();
          setUserScore(newScore);
        }, 0);
        return newSelection;
      });
    } else {
      if (!ratings[playerId]) {
        alert("Please rate the player before adding them to your team!");
        return;
      }

      if (checkTeamConstraints(playerId)) {
        setSelectedPlayers(prev => {
          const newSelection = [...prev, playerId];
          const newTeamRating = calculateTotalTeamRating(newSelection);
          setTotalTeamRating(newTeamRating);
          
          const newTeamStatus = {
            batters: newSelection.filter(id => players.find(p => p._id === id)?.role === "Bat").length,
            bowlers: newSelection.filter(id => players.find(p => p._id === id)?.role === "Bowl").length,
            allRounders: newSelection.filter(id => players.find(p => p._id === id)?.role === "All").length
          };
          setIsTeamComplete(checkTeamCompletion(newTeamStatus));
          
          setTimeout(() => {
            const newScore = calculateTeamScore();
            setUserScore(newScore);
          }, 0);
          return newSelection;
        });
      } else {
        if (!player) return;
        const roleLimit = TEAM_CONSTRAINTS[player.role];
        const roleName = player.role.toLowerCase();
        alert(`Cannot add more ${roleName}s. Maximum limit is ${roleLimit}.`);
      }
    }
  };

  const handleRatingChange = (id, value) => {
    const rating = Math.min(Math.max(value, 1), 10);
    
    setRatings(prev => {
      const otherPlayersRating = selectedPlayers
        .filter(playerId => playerId !== id)
        .reduce((sum, playerId) => sum + (prev[playerId] || 0), 0);
      
      const projectedTotalRating = otherPlayersRating + rating;
      
      if (selectedPlayers.includes(id) && projectedTotalRating > STADIUMS[stadiumId].maxRating) {
        const maxAllowedForThisPlayer = STADIUMS[stadiumId].maxRating - otherPlayersRating;
        const boundedMaxAllowed = Math.min(Math.max(maxAllowedForThisPlayer, 1), 10);
        
        if (confirm(
          `Team rating cannot exceed ${STADIUMS[stadiumId].maxRating}!\n\n` +
          `Current team rating (without this player): ${otherPlayersRating}\n` +
          `Maximum allowed rating for this player: ${boundedMaxAllowed.toFixed(1)}\n\n` +
          `Would you like to set the rating to ${boundedMaxAllowed.toFixed(1)}?\n` +
          `Click OK to adjust or Cancel to keep previous rating (${prev[id] || 0})`
        )) {
          const adjustedRatings = { ...prev, [id]: boundedMaxAllowed };
          const newTeamRating = otherPlayersRating + boundedMaxAllowed;
          setTotalTeamRating(newTeamRating);
          
          setTimeout(() => {
            const newScore = calculateTeamScore();
            setUserScore(newScore);
          }, 0);
          
          return adjustedRatings;
        } else {
          return prev;
        }
      }
      
      if (selectedPlayers.includes(id)) {
        setTotalTeamRating(projectedTotalRating);
        setTimeout(() => {
          const newScore = calculateTeamScore();
          setUserScore(newScore);
        }, 0);
      }
      
      return { ...prev, [id]: rating };
    });
  };

  const handleFinalizeTeam = async () => {
    try {
      setIsFinalizing(true);
      
      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('User not found. Please login again.');
      }

      await axios.put(`https://crickwarsbackend.onrender.com/users/score/${username}`, {
        score: userScore
      });

      navigate('/thank-you', { 
        state: { 
          score: userScore,
          teamMembers: selectedPlayers.map(id => {
            const player = players.find(p => p._id === id);
            return {
              name: player.name,
              role: player.role,
              rating: ratings[id]
            };
          })
        }
      });
    } catch (error) {
      setError(`Failed to finalize team: ${error.message}`);
    } finally {
      setIsFinalizing(false);
    }
  };

  const getTeamStatus = () => {
    const currentTeam = selectedPlayers.map(id => players.find(p => p._id === id));
    return {
      batters: currentTeam.filter(p => p?.role === "Bat").length,
      bowlers: currentTeam.filter(p => p?.role === "Bowl").length,
      allRounders: currentTeam.filter(p => p?.role === "All").length
    };
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "Bat": return "text-blue-600";
      case "Bowl": return "text-green-600";
      case "All": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const teamStatus = getTeamStatus();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">
          {stadiumName || "Your Stadium"}
        </h1>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Team Requirements: {TEAM_CONSTRAINTS.Bat} Batters, {TEAM_CONSTRAINTS.Bowl} Bowlers, 
            and {TEAM_CONSTRAINTS.All} All-Rounder. Maximum Team Rating: {STADIUMS[stadiumId]?.maxRating || 65}
          </AlertDescription>
        </Alert>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <h2 className="text-xl font-bold mb-2">Team Status</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-blue-600">
              <p>Batters: {teamStatus.batters}/{TEAM_CONSTRAINTS.Bat}</p>
            </div>
            <div className="text-green-600">
              <p>Bowlers: {teamStatus.bowlers}/{TEAM_CONSTRAINTS.Bowl}</p>
            </div>
            <div className="text-purple-600">
              <p>All-Rounders: {teamStatus.allRounders}/{TEAM_CONSTRAINTS.All}</p>
            </div>
            <div className="text-orange-600">
              <p>Total Rating: {totalTeamRating}/{STADIUMS[stadiumId]?.maxRating || 65}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-bold text-primary mb-4">
              Current Team Score: {userScore.toFixed(2)}
            </p>
            {isTeamComplete && (
              <Button 
                className="w-full"
                onClick={handleFinalizeTeam}
                disabled={isFinalizing}
              >
                <Check className="mr-2 h-4 w-4" />
                {isFinalizing ? 'Finalizing...' : 'Finalize Team'}
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading players...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <Card 
                key={player._id} 
                className={`shadow-lg rounded-xl overflow-hidden ${
                  selectedPlayers.includes(player._id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <img
                 src={player.img || "https://i.imgur.com/kFQtkEb.jpeg"}
                 alt={player.name}
                 className="h-38 w-full object-cover"
                 onError={(e) => (e.target.src = "https://i.imgur.com/zEVIMak.jpeg")}
               />
               <CardHeader className="p-4">
                 <div className="flex justify-between items-center">
                   <CardTitle className="text-xl font-bold">{player.name}</CardTitle>
                   <Button
                     variant={selectedPlayers.includes(player._id) ? "destructive" : "outline"}
                     size="sm"
                     onClick={() => togglePlayerSelection(player._id)}
                   >
                     <UserPlus className="h-4 w-4 mr-1" />
                     {selectedPlayers.includes(player._id) ? 'Remove' : 'Select'}
                   </Button>
                 </div>
                 <p className={`font-semibold ${getRoleStyle(player.role)}`}>
                   Role: {player.role}
                 </p>
                 <p className="text-green-600 font-semibold">Price: ₹{player.price} CR</p>
               </CardHeader>
               <CardContent className="p-4 space-y-3">
                 <div className="flex items-center space-x-2">
                   <Star className="text-yellow-500 w-5 h-5" />
                   <span className="font-medium">Rate (1-10):</span>
                 </div>
                 <Input
                   type="number"
                   min="1"
                   max="10"
                   value={ratings[player._id] || ""}
                   onChange={(e) => handleRatingChange(player._id, Number(e.target.value))}
                   className="w-full border-gray-300 rounded-md"
                 />
               </CardContent>
             </Card>
           ))}
         </div>
       )}
     </div>
   </div>
 );
};

export default PlayersRatingPage;
