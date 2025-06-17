import { STAGE, STAGES } from '.';

export const chatRoutes = ['chat.reflect.now'];

export enum ROUTE_NAMES {
  HOME = 'HOME',
  CHAT = 'CHAT',
  TERMINAL = 'TERMINAL',
  FAQ = 'FAQ',
  AUTH_TOKENS = 'AUTH_TOKENS',
  TOS = 'TOS',
  PP = 'PP',
}

export enum DeprecatedDevRoutes {
  DASHBOARD = '/dashboard',
}

export enum DeprecatedProdRoutes {
  DASHBOARD = '/dashboard',
}

export const PLAIN_ROUTES: Record<ROUTE_NAMES, string> = {
  [ROUTE_NAMES.HOME]: '/',
  [ROUTE_NAMES.CHAT]: '/chats-demo',
  [ROUTE_NAMES.TERMINAL]: '/terminal',
  [ROUTE_NAMES.FAQ]: '/faq',
  [ROUTE_NAMES.AUTH_TOKENS]: '/auth-tokens',
  [ROUTE_NAMES.TOS]: '/terms-of-use',
  [ROUTE_NAMES.PP]: '/privacy-policy',
};

const developmentRoutes: Record<ROUTE_NAMES, string> = {
  [ROUTE_NAMES.HOME]: PLAIN_ROUTES[ROUTE_NAMES.HOME],
  [ROUTE_NAMES.CHAT]: PLAIN_ROUTES[ROUTE_NAMES.CHAT],
  [ROUTE_NAMES.TERMINAL]: PLAIN_ROUTES[ROUTE_NAMES.TERMINAL],
  [ROUTE_NAMES.FAQ]: PLAIN_ROUTES[ROUTE_NAMES.FAQ],
  [ROUTE_NAMES.AUTH_TOKENS]: PLAIN_ROUTES[ROUTE_NAMES.AUTH_TOKENS],
  [ROUTE_NAMES.TOS]: PLAIN_ROUTES[ROUTE_NAMES.TOS],
  [ROUTE_NAMES.PP]: PLAIN_ROUTES[ROUTE_NAMES.PP],
};

const productionRoutes: Record<ROUTE_NAMES, string> = {
  [ROUTE_NAMES.HOME]: 'https://reflect.now/',
  [ROUTE_NAMES.CHAT]: 'https://chat.reflect.now',
  [ROUTE_NAMES.TERMINAL]: 'https://chat.reflect.now/terminal',
  [ROUTE_NAMES.FAQ]: 'https://chat.reflect.now/faq',
  [ROUTE_NAMES.AUTH_TOKENS]: 'https://chat.reflect.now/auth-tokens',
  [ROUTE_NAMES.TOS]: 'https://reflect.now/terms-of-use',
  [ROUTE_NAMES.PP]: 'https://reflect.now/privacy-policy',
};

export const routes: Record<STAGES, Record<ROUTE_NAMES, string>> = {
  development: developmentRoutes,
  staging: developmentRoutes,
  production: productionRoutes,
};

export const ROUTES = routes[STAGE];
