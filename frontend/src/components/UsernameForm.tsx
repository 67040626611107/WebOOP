'use client';

import { useState, useEffect } from 'react';
import { PopcatApiClient } from '@/lib/api/PopcatApiClient';
import { GameStateManager } from '@/lib/state/GameStateManager';

export default function UsernameForm() {
  const [username, setUsername] = useState('');
  const [previousUsername, setPreviousUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [clicks, setClicks] = useState(0);

  const apiClient = PopcatApiClient.getInstance();
  const stateManager = GameStateManager.getInstance();

  useEffect(() => {
    stateManager.loadUsername();
    const state = stateManager.getState();

    if (state.username) {
      setUsername(state.username);
      setPreviousUsername(state.username);
      setIsSubmitted(true);
    }

    const unsubscribe = stateManager.subscribe((newState) => {
      setClicks(newState.clicks);
    });

    return unsubscribe;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    try {
      const state = stateManager.getState();

      // Get the actual click count from the backend for this session
      const clickResponse = await apiClient.getClicksBySession(state.sessionId);
      const actualClicks = clickResponse.data?.count || 0;

      // If changing username and previous username had clicks, remove the old entry
      if (previousUsername && previousUsername !== username && actualClicks > 0) {
        // Delete the old username from the leaderboard
        try {
          await apiClient.removeFromLeaderboard(previousUsername);
        } catch (err) {
          // Ignore errors if the user doesn't exist
          console.log(`Could not remove ${previousUsername} from leaderboard`);
        }
      }

      // Update to new username
      stateManager.setUsername(username);
      setPreviousUsername(username);

      if (actualClicks > 0) {
        await apiClient.updateLeaderboard(username, actualClicks);
        // Force refresh the leaderboard
        window.dispatchEvent(new CustomEvent('leaderboard-update'));
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit username:', error);
      alert('Failed to save username. Please try again.');
    }
  };

  const handleChange = () => {
    // Store the current username as previous before allowing changes
    setPreviousUsername(username);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
        <p className="text-lg text-gray-600 mb-2">Playing as</p>
        <p className="text-2xl font-bold text-orange-600 mb-4">{username}</p>
        <button
          onClick={handleChange}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors"
        >
          Change Username
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-center">Enter Your Name</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your username"
          maxLength={20}
          className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Save & Play
        </button>
      </form>
    </div>
  );
}
