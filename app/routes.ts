import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("password-reset", "routes/password-reset.tsx"),
  layout("routes/layout.tsx", [
    index("routes/dashboard.tsx"),
    route("projects", "routes/projects.tsx"),
    route("service-requests", "routes/service-requests.tsx"),
    route("contacts", "routes/contacts.tsx"),
    route("password-change", "routes/password-change.tsx"),
  ])
] satisfies RouteConfig;
