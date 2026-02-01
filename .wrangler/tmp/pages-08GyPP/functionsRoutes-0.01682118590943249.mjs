import { onRequestPost as __api_admin_login_ts_onRequestPost } from "/home/user/level-custom-apparel/functions/api/admin/login.ts"
import { onRequestGet as __api_admin_seed_ts_onRequestGet } from "/home/user/level-custom-apparel/functions/api/admin/seed.ts"
import { onRequestGet as __api_data__key__ts_onRequestGet } from "/home/user/level-custom-apparel/functions/api/data/[key].ts"
import { onRequestPost as __api_data__key__ts_onRequestPost } from "/home/user/level-custom-apparel/functions/api/data/[key].ts"
import { onRequestPost as __api_gemini_ts_onRequestPost } from "/home/user/level-custom-apparel/functions/api/gemini.ts"
import { onRequestPost as __api_quotes_ts_onRequestPost } from "/home/user/level-custom-apparel/functions/api/quotes.ts"
import { onRequestPost as __api_subscriptions_ts_onRequestPost } from "/home/user/level-custom-apparel/functions/api/subscriptions.ts"

export const routes = [
    {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/seed",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_seed_ts_onRequestGet],
    },
  {
      routePath: "/api/data/:key",
      mountPath: "/api/data",
      method: "GET",
      middlewares: [],
      modules: [__api_data__key__ts_onRequestGet],
    },
  {
      routePath: "/api/data/:key",
      mountPath: "/api/data",
      method: "POST",
      middlewares: [],
      modules: [__api_data__key__ts_onRequestPost],
    },
  {
      routePath: "/api/gemini",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_gemini_ts_onRequestPost],
    },
  {
      routePath: "/api/quotes",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_quotes_ts_onRequestPost],
    },
  {
      routePath: "/api/subscriptions",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscriptions_ts_onRequestPost],
    },
  ]