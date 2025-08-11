import { Outlet, Link } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import React from 'react';
import s from './root.module.css';
import { Route as UWPParserRoute } from '../../routes/uwp-parser';
import { Route as IndexRoute } from '../../routes/index';
import { Button } from 'react-aria-components';
import clsx from 'clsx';

const RootLayout: React.FC = () => {
  return (
    <div className={s.appContainer}>
      <div className={s.nav}>
        <Link to={IndexRoute.to}>
          <Button className={clsx('react-aria-Button', s.navBtn)}>Home</Button>
        </Link>
        <Link to={UWPParserRoute.to}>
          <Button className={clsx('react-aria-Button', s.navBtn)}>UWP Parser</Button>
        </Link>
      </div>
      <div className={s.content}>
        <h1>Traveller RPG Assistant</h1>
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </div>
  );
};

export default RootLayout;
