import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import React from 'react';

import RootNav from '../../components/RootNav/RootNav';
import s from './root.module.css';

const RootLayout: React.FC = () => {
  return (
    <div className={s.appContainer}>
      <RootNav />
      <div className={s.content}>
        <h1>Traveller RPG Assistant</h1>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </div>
  );
};

export default RootLayout;
