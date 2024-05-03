import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Leaderboard = () => {
  const { gameCode } = useParams();
  const [playerScores, setPlayerScores] = useState([]);

  useEffect(() => {
    const fetchPlayerScores = async () => {
      try {
        const response = await fetch(`http://103.235.73.11:4001/api/player-score/${gameCode}`);
        if (!response.ok) {
          throw new Error("Failed to fetch player scores");
        }
        const data = await response.json();
        setPlayerScores(data.data);
      } catch (error) {
        console.error("Error fetching player scores:", error);
      }
    };

    fetchPlayerScores();
  }, [gameCode]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Leaderboard</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Player Name</th>
            <th scope="col">Score</th>
            <th scope="col">Total Correct Answers</th>
          </tr>
        </thead>
        <tbody>
          {playerScores.map((player, index) => (
            <tr key={index} className={index === 0 ? 'table-warning' : ''}>
              <th scope="row">{index + 1}</th>
              <td>{player.player_name}</td>
              <td>{player.player_score !== null ? player.player_score : 0}</td>
              <td>{player.total_correct_answers}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-5 d-flex justify-content-center">
        <button className="btn btn-lg btn-info">Finish</button>
      </div>
    </div>
  );
};

export default Leaderboard;
