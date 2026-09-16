import {readFile,writeFile,mkdir} from 'node:fs/promises';
const modules=['data','engine','animations','render','presentation','app'];
const parts=await Promise.all(modules.map(n=>readFile(new URL(`src/${n}.mjs`,import.meta.url),'utf8')));
const bundle='(()=>{\n"use strict";\n'+parts.map(s=>s.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'')).join('\n')+'\n})();';
new Function(bundle);
const styles=await Promise.all(['base','panel','modals','responsive'].map(n=>readFile(new URL(`src/styles/${n}.css`,import.meta.url),'utf8')));
const dist=new URL('dist/',import.meta.url);
await mkdir(dist,{recursive:true});
await Promise.all([
  writeFile(new URL('game.bundle.js',dist),bundle),
  writeFile(new URL('game-ui.css',dist),styles.join('\n'))
]);
console.log('Built Infinity Defense. JavaScript syntax validated and V3.1 comic UI assembled.');