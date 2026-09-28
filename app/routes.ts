import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  route("password-reset", "routes/password-reset.tsx"),
  layout("routes/layout.tsx", [
    index("routes/dashboard.tsx"),
    route("projects", "routes/projects.tsx"),
    route("service-requests", "routes/service-requests.tsx"),
    route("service-package-requests", "routes/service-package-requests.tsx"),
    route("contacts", "routes/contacts.tsx"),
    route("media", "routes/media.tsx"),
    route("posts", "routes/posts.tsx"),
    route("posts/new", "routes/posts-new.tsx"),
    route("posts/:id", "routes/posts-edit.tsx"),
    route("projects/new", "routes/projects-new.tsx"),
    route("projects/:id", "routes/projects-edit.tsx"),
    route("services", "routes/services.tsx"),
    route("services/new", "routes/services-new.tsx"),
    route("services/:id", "routes/services-edit.tsx"),
    route("service-packages", "routes/service-packages.tsx"),
    route("service-packages/new", "routes/service-packages-new.tsx"),
    route("service-packages/:id", "routes/service-packages-edit.tsx"),
    route("experiences", "routes/experiences.tsx"),
    route("experiences/new", "routes/experiences-new.tsx"),
    route("experiences/:id", "routes/experiences-edit.tsx"),
    route("password-change", "routes/password-change.tsx"),
  ])
] satisfies RouteConfig;
