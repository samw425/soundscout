import { onRequest as __og_artist_image__name__js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/og/artist-image/[name].js"
import { onRequest as __og_artist__name__js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/og/artist/[name].js"
import { onRequestOptions as __api_feedback_ts_onRequestOptions } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/api/feedback.ts"
import { onRequestPost as __api_feedback_ts_onRequestPost } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/api/feedback.ts"
import { onRequestOptions as __api_waitlist_ts_onRequestOptions } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/api/waitlist.ts"
import { onRequestPost as __api_waitlist_ts_onRequestPost } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/api/waitlist.ts"
import { onRequest as __api_itunes_ts_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/api/itunes.ts"
import { onRequest as __api_og_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/api/og.js"
import { onRequest as __artist___path___js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/artist/[[path]].js"
import { onRequest as __track___path___js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/track/[[path]].js"
import { onRequest as __hot_500_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/hot-500.js"
import { onRequest as __hot500_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/hot500.js"
import { onRequest as __launchpad_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/launchpad.js"
import { onRequest as __oldschool_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/oldschool.js"
import { onRequest as __releases_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/releases.js"
import { onRequest as __roster_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/roster.js"
import { onRequest as __tours_js_onRequest } from "/Users/sameeraziz/Documents/novai-intelligence (2)/stelar/web/functions/tours.js"

export const routes = [
    {
      routePath: "/og/artist-image/:name",
      mountPath: "/og/artist-image",
      method: "",
      middlewares: [],
      modules: [__og_artist_image__name__js_onRequest],
    },
  {
      routePath: "/og/artist/:name",
      mountPath: "/og/artist",
      method: "",
      middlewares: [],
      modules: [__og_artist__name__js_onRequest],
    },
  {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_feedback_ts_onRequestOptions],
    },
  {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_feedback_ts_onRequestPost],
    },
  {
      routePath: "/api/waitlist",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_waitlist_ts_onRequestOptions],
    },
  {
      routePath: "/api/waitlist",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_waitlist_ts_onRequestPost],
    },
  {
      routePath: "/api/itunes",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_itunes_ts_onRequest],
    },
  {
      routePath: "/api/og",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_og_js_onRequest],
    },
  {
      routePath: "/artist/:path*",
      mountPath: "/artist",
      method: "",
      middlewares: [],
      modules: [__artist___path___js_onRequest],
    },
  {
      routePath: "/track/:path*",
      mountPath: "/track",
      method: "",
      middlewares: [],
      modules: [__track___path___js_onRequest],
    },
  {
      routePath: "/hot-500",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__hot_500_js_onRequest],
    },
  {
      routePath: "/hot500",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__hot500_js_onRequest],
    },
  {
      routePath: "/launchpad",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__launchpad_js_onRequest],
    },
  {
      routePath: "/oldschool",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__oldschool_js_onRequest],
    },
  {
      routePath: "/releases",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__releases_js_onRequest],
    },
  {
      routePath: "/roster",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__roster_js_onRequest],
    },
  {
      routePath: "/tours",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__tours_js_onRequest],
    },
  ]