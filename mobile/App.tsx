import React from 'react';

import { AppContent } from './src/components/AppContent';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
