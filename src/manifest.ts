import type { Manifest } from 'webextension-polyfill-ts'
import pkg from '../package.json'
import { isDev, port } from '../scripts/utils'

export async function getManifest(): Promise<Manifest.WebExtensionManifest> {
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
          "./assets/style.css"
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
          "dist/assets/vendor.js",
          "dist/assets/windi.js",
        ],
        matches: [ 
          "https://*.ogame.gameforge.com/*"
        ]
      }
    ],
  }
}
