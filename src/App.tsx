import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import PlacementPage from './pages/PlacementPage';
import QuizPage from './pages/QuizPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="quiz/:level" element={<QuizPage />} />
          <Route path="placement" element={<PlacementPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
