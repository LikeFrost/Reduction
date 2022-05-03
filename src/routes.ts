import { IRouterConfig, lazy } from 'ice';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const routerConfig: IRouterConfig[] = [
  {
    path: '/',
    exact: true,
    component: Dashboard,
  },
];
export default routerConfig;
