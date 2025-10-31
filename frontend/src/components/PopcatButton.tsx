'use client';

import { useState, useEffect } from 'react';
import { PopcatApiClient } from '@/lib/api/PopcatApiClient';
import { GameStateManager } from '@/lib/state/GameStateManager';

export default function PopcatButton() {
  const [clicks, setClicks] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);

  const apiClient = PopcatApiClient.getInstance();
  const stateManager = GameStateManager.getInstance();

  useEffect(() => {
    
    const unsubscribe = stateManager.subscribe((state) => {
      setClicks(state.clicks);
      setIsClicking(state.isClicking);
    });

    
    loadTotalClicks();
    loadSessionClicks();

    
    const interval = setInterval(loadSessionClicks, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadTotalClicks = async () => {
    try {
      const response = await apiClient.getTotalClicks();
      if (response.success && response.total !== undefined) {
        setTotalClicks(response.total);
      }
    } catch (error) {
      console.error('Failed to load total clicks:', error);
    }
  };

  const loadSessionClicks = async () => {
    try {
      const state = stateManager.getState();
      const response = await apiClient.getClicksBySession(state.sessionId);
      if (response.success && response.data?.count !== undefined) {
        stateManager.setState({ clicks: response.data.count });
      }
    } catch (error) {
      console.error('Failed to load session clicks:', error);
    }
  };

  const handleClick = async () => {
    stateManager.incrementClick();

    try {
      const state = stateManager.getState();
      await apiClient.recordClick(state.sessionId);
      await loadTotalClicks();

      if (state.username) {
        await apiClient.updateLeaderboard(state.username, state.clicks);
        window.dispatchEvent(new CustomEvent('leaderboard-update'));
      }
    } catch (error) {
      console.error('Failed to record click:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        onClick={handleClick}
        className={`
          relative w-64 h-64 rounded-full bg-gradient-to-br from-orange-400 to-orange-600
          shadow-2xl transform transition-all duration-100 hover:scale-105 active:scale-95
          ${isClicking ? 'scale-95' : 'scale-100'}
          flex items-center justify-center text-8xl
        `}
      >
        {isClicking ? '😺' : '😸'}
      </button>

      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-gray-800">
          Your Clicks: <span className="text-orange-600">{clicks}</span>
        </p>
        <p className="text-lg text-gray-600">
          Total Global: <span className="text-orange-500">{totalClicks.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}
