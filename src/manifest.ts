import type { Manifest } from 'webextension-polyfill-ts'
import pkg from '../package.json'
import { isDev, port } from '../scripts/utils'

type MpManifest = {
  externally_connectable: {
    matches: string[],
    accepts_tls_channel_id: boolean
  }
} & Manifest.WebExtensionManifest

export async function getManifest(): Promise<MpManifest> {
  // update this file to update this manifest.json
  // can also be conditional based on your need
  return {
    manifest_version : 3,

    name             : pkg.displayName || pkg.name,
    version          : pkg.version,
    description      : pkg.description,

    action: {
      default_icon: './assets/icon_128.png',
      default_popup: './dist/popup/index.html',
    },

    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
    },

    background: {
      service_worker: './background.js',
    },

    content_scripts: [
      {
        matches: [
          'https://*.ogame.gameforge.com/game/*'
        ],
        js: [
          './dist/content/index.global.js',
        ],
        css: [
          "./assets/style.css",
          "dist/assets/main.css",
          "dist/assets/content_app.css",
        ]
      },
    ],

    icons: {
      16:   "./assets/icon_16.png",
      32:   "./assets/icon_32.png",
      48:   "./assets/icon_48.png",
      128:  "./assets/icon_128.png"
    },

    permissions: [
      'tabs',
      'storage',
      'activeTab',
      "declarativeContent",
    ],

    // this is required on dev for Vite script to load
    content_security_policy: {
      extension_pages: isDev
        ? `script-src \'self\' http://localhost:${port}; object-src \'self\'`
        : undefined,
    },
    
    // host_permissions: [
    //   "http://*.ogame.gameforge.com/*",
    // ]

    web_accessible_resources: [
      {
        resources: [ 
          "assets/icon_32.png",

          "dist/assets/content_app.js",
          "dist/assets/main.js",
          "dist/assets/main.css",
          "dist/assets/vendor.js",
          "/dist/mp_ogame/index.global.js",
          "/dist/mp_ogame/mp_consts.global.js",
          "/dist/mp_ogame/mp_fleet_dispatcher.global.js",
          "/dist/mp_ogame/mp_mission.d.global.js",
          "/dist/mp_ogame/mp_statistics.global.js",
          "/dist/mp_ogame/mp_utils.global.js",
        ],
        matches: [ 
          "https://*.ogame.gameforge.com/*"
        ]
      }
    ],

    externally_connectable: {
      matches: [
        "https://*.ogame.gameforge.com/*"
      ],
      accepts_tls_channel_id: true,
    },
  }
}
