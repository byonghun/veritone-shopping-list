export const ROUTES = {
  home: "/",
  items: "/items"
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];