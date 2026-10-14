fx_version 'cerulean'
game 'gta5'

author 'Starlight Developments'
description 'Cinematic Vinewood FiveM loading screen with real loading progress'
version '1.0.0'

loadscreen 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/config.js',
    'html/app.js',
    'html/assets/vinewood.webp'
}

-- FiveM will close the loading screen automatically when it is ready.
-- Deliberately do not enable loadscreen_manual_shutdown here.
