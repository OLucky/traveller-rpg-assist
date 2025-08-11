import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import React from 'react';
import { Button } from 'react-aria-components';

import { Route as IndexRoute } from '../../routes/index';
import { Route as UWPParserRoute } from '../../routes/uwp-parser';
import s from './RootNav.module.css';

const RootNav: React.FC = () => {
  return (
    <div className={s.nav}>
      <Link to={IndexRoute.to}>
        <Button data-testid="nav-home-btn" className={clsx('react-aria-Button', s.navBtn)}>
          Home
        </Button>
      </Link>
      <Link to={UWPParserRoute.to}>
        <Button data-testid="nav-uwp-parser-btn" className={clsx('react-aria-Button', s.navBtn)}>
          UWP Parser
        </Button>
      </Link>
    </div>
  );
};

export default RootNav;
