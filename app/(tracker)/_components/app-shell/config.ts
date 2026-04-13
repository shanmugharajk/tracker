export type NavItem = {
  title: string;
  url: string;
  match?: 'exact' | 'startsWith';
};

export type NavGroup = {
  title: string;
  url: string;
  items: NavItem[];
};

export const sidebarData: NavGroup[] = [
  {
    title: 'Expenses',
    url: '/',
    items: [
      {
        title: 'Dashboard',
        url: '/',
      },
      {
        title: 'All expenses',
        url: '/all-expenses',
      },
    ],
  },
];
