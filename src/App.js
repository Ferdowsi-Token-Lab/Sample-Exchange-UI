import { TradeTable } from './lib/TradeTable';
import { COINS } from './tests/mock'
import React from 'react';

function App() {
  return (
    <TradeTable coins={COINS} />
  );
}

export default App;
