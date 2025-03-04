import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Disable right click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Define allowed team names
  const allowedTeams = [
    "Gryffindor Guardians",
    "Slytherin Serpents",
    "Ravenclaw Riddles",
    "Hufflepuff Heralds",
    "Phoenix Flames",
    "Basilisk Behemoths",
    "Thestral Shadows",
    "Hippogriff Heroes",
    "Patronus Protectors",
    "Wingardium Wizards",
    "Polyjuice Pioneers",
    "Felix Felicis Force",
    "Marauder’s Mapmakers",
    "Dumbledore’s Army",
    "Golden Snitches",
    "Deathly Hallows",
    "Xenia",
    "Demo",
  ];

  // Constant password for all users
  const CONSTANT_PASSWORD = "cricwars123";

  const validateForm = () => {
    if (!username) {
      setError('Please enter a team name');
      return false;
    }

    // Check if team name is in allowed list
    if (!allowedTeams.includes(username.trim())) {
      setError('Please enter a valid magical team name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);

    try {
      const registerData = {
        username: username.trim(),
        password: CONSTANT_PASSWORD
      };
      
      const response = await fetch('https://crickwarsbackend.onrender.com/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('This team name is already registered');
        }
        throw new Error(data.message || 'Registration failed');
      }

      // Store group2_id and other user data
      localStorage.setItem('group2_id', data.group2_id);
      localStorage.setItem('username', data.username);
      
      // Navigate to auction page
      navigate('/auction');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Join CricWars</CardTitle>
            <CardDescription>
              Register your Magical team to start the round
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Team Name
                </label>
                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError('');
                  }}
                  required
                  className="w-full"
                  placeholder="Enter your magical team name: (Demo)"
                  autoComplete="username"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? 'Loading...take time!' : 'Lets Go!'}
              </Button>

              
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Themed Visual */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center text-primary-foreground">
        <div className="max-w-md text-center p-8">
          <div className="text-6xl mb-4">🏏</div>
          <h1 className="text-4xl font-bold mb-4">Welcome to CricWars</h1>
          <p className="text-lg">
            Register your team and compete in exciting player selection game to build
            your best cricket team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
