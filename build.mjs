import {readFile,writeFile,mkdir} from 'node:fs/promises';
const parts=await Promise.all(['data','engine','animations','render','presentation','app'].map(n=>readFile(new URL(`src/${n}.mjs`,import.meta.url),'utf8')));
const bundle='(()=>{\n"use strict";\n'+parts.map(s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n')+'\n})();';
new Function(bundle);
const dist=new URL('dist/',import.meta.url);
await mkdir(dist,{recursive:true});
await writeFile(new URL('game.bundle.js',dist),bundle);
console.log('Built Infinity Defense. JavaScript syntax validated.');