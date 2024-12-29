import { MainLayout } from './components/layout/MainLayout';
import { IdeProvider } from './context/IdeContext';
import './App.css';

function App() {
  return (
    <IdeProvider>
      <MainLayout />
    </IdeProvider>
  );
}

export default App;
