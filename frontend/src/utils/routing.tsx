import React, { useSyncExternalStore } from 'react';

const navigationEvent = 'app:navigate';

const subscribe = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  window.addEventListener(navigationEvent, callback);

  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener(navigationEvent, callback);
  };
};

const getPathname = () => window.location.pathname;

export const usePathname = () =>
  useSyncExternalStore(subscribe, getPathname, () => '/');

type NavLinkProps = {
  to: string;
  className: (state: { isActive: boolean }) => string;
  children: React.ReactNode;
};

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  className,
  children,
}) => {
  const pathname = usePathname();

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (pathname !== to) {
      window.history.pushState(null, '', to);
      window.dispatchEvent(new Event(navigationEvent));
    }
  };

  return (
    <a
      href={to}
      className={className({ isActive: pathname === to })}
      onClick={navigate}
    >
      {children}
    </a>
  );
};
