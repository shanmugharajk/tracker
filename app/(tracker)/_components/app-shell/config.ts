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
    title: 'Home expenses',
    url: '/',
    items: [
      {
        title: 'Dashboard',
        url: '/',
      },
      {
        title: 'View all expenses',
        url: '/all-expenses',
      },
      {
        title: 'Add expense',
        url: '/add-expense',
      },
    ],
  },
];
