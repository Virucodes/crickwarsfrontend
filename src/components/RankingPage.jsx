import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { CardContent } from "./ui/card";
import { Trophy, Medal } from 'lucide-react';
import axios from 'axios';

const RankingsPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/users/leaderboard');
        setLeaderboard(response.data);
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalColor = (rank) => {
    switch (rank) {
      case 0: return "text-yellow-500";  // Gold
      case 1: return "text-gray-400";    // Silver
      case 2: return "text-amber-600";   // Bronze
      default: return "text-gray-600";   // Others
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Trophy className="h-6 w-6" />
              <span>Leaderboard - Top Teams</span>
            </CardTitle>
          </CardHeader>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">Loading leaderboard...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : (
          leaderboard.map((entry, index) => (
            <Card 
              key={entry.username} 
              className={index === 0 ? "border-2 border-yellow-500 transform hover:scale-102 transition-transform" : "hover:bg-gray-50"}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                    <span className="text-xl">{entry.username}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-700">
                      #{index + 1}
                    </span>
                    <span className="text-xl font-semibold text-blue-600">
                      {entry.score.toFixed(1)}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Home Stadium: {entry.stadium}
                </p>
              </CardContent>
            </Card>
          ))
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No teams found in the leaderboard yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RankingsPage;