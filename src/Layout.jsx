import { Routes, Route } from 'react-router-dom';
import { routes } from '@/config/routes';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
            index={route.index}
          />
        ))}
      </Routes>
    </div>
  );
};

export default Layout;