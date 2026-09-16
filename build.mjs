import {readFile,writeFile} from 'node:fs/promises';
const parts=await Promise.all(['data','engine','animations','render','app'].map(n=>readFile(new URL(`src/${n}.mjs`,import.meta.url),'utf8')));
const bundle='(()=>{\n"use strict";\n'+parts.map(s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n')+'\n})();';
new Function(bundle);
await writeFile(new URL('dist/game.bundle.js',import.meta.url),bundle);
console.log('Built Infinity Defense. JavaScript syntax validated.');
