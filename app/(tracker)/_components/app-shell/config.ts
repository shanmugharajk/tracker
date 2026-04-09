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
    title: 'Tracker',
    url: '/',
    items: [
      {
        title: 'Add Transaction',
        url: '/add-transaction',
      },
      {
        title: 'Recent transactions',
        url: '/recent-transactions',
      },
    ],
  },
];
