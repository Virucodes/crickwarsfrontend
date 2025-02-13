import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
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
        username: formData.username.trim(),
        password: formData.password
      };
      
      const response = await fetch('http://localhost:4000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store group2_id and other user data
      localStorage.setItem('group2_id', data.group2_id);
      localStorage.setItem('username', data.username);
      
      // For debugging
      console.log('Stored group2_id:', data.group2_id);
      console.log('Stored username:', data.username);

      // Redirect to auction page
      window.location.href = '/auction';
      
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
              Create your account to start building your dream team
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
                  Teamname
                </label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-primary hover:underline"
                >
                  Sign in here
                </a>
              </div>
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
            Join thousands of cricket enthusiasts in building and managing your
            dream cricket team through our real-time auction platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;