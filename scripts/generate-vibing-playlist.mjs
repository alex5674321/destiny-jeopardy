import { readdir, writeFile } from 'node:fs/promises';
const folder = new URL('../vibing/', import.meta.url);
const audio = /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i;
const files = (await readdir(folder)).filter(file => audio.test(file)).sort((a,b) => a.localeCompare(b));
const tracks = files.map(file => ({ file, title: file.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') }));
await writeFile(new URL('playlist.json', folder), JSON.stringify({ tracks }, null, 2) + '\n');
console.log('Vibing playlist:', tracks.length, 'track(s)');
