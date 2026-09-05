import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { AssetDetailView } from '../views/AssetDetailView';
import { CollectionView } from '../views/CollectionView';
import { HomeView } from '../views/HomeView';
import { NotFoundView } from '../views/NotFoundView';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomeView />} />
        <Route path="all" element={<CollectionView all />} />
        <Route path="library/:type" element={<CollectionView />} />
        <Route path="asset/:id" element={<AssetDetailView />} />
        <Route path="library" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundView />} />
      </Route>
    </Routes>
  );
}
