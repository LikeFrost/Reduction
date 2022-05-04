import { runApp, IAppConfig } from 'ice';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    type: 'browser',
    modifyRoutes: (routes) => {
      return routes;
    },
  },
};

runApp(appConfig);
