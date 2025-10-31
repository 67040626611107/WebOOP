'use client';

import { useState, useEffect } from 'react';
import { PopcatApiClient, LeaderboardEntry } from '@/lib/api/PopcatApiClient';

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const apiClient = PopcatApiClient.getInstance();

  useEffect(() => {
    loadLeaderboard();
    
    const interval = setInterval(loadLeaderboard, 2000);

    
    const handleUpdate = () => loadLeaderboard();
    window.addEventListener('leaderboard-update', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('leaderboard-update', handleUpdate);
    };
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await apiClient.getLeaderboard(10);
      if (response.success && response.data) {
        setEntries(response.data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number): string => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-500';
      default: return 'text-gray-600';
    }
  };

  const getRankEmoji = (rank: number): string => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        🏆 Leaderboard
      </h2>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No entries yet. Be the first!</p>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry._id || index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getRankEmoji(entry.rank)}</span>
                <div>
                  <p className="font-bold text-gray-800">{entry.username || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">Rank #{entry.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                  {entry.totalClicks.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">clicks</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
