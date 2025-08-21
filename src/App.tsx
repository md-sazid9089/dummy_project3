import React from 'react';

function App() {
  const options = ['Housing', 'Maid'];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ul className="space-y-4 text-xl">
        {options.map((label) => (
          <li key={label} className="text-blue-600 hover:underline">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
