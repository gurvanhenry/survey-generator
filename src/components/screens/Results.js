import React from 'react';

function Results(props) {
  const { scores } = props;
  if (!scores || scores.length === 0) {
    return <div>No score</div>;
  }
  return (
    <div>
      <div>Scores</div>
      <ul>
        {scores.map((score) => (
          <li key={score.name}>
            {score.name} : {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Results;
