const fs = require('fs');
const path = require('path');
const util = require('util');
const sharp = require('sharp');

const base = process.argv[2].replace('--base=', '') || 'img';
const output = process.argv[3].replace('--output=', '') || 'minify';
const quality = process.argv[4].replace('--quality=', '') || 50;
const compressionLevel = process.argv[5].replace('--compression-level=', '') || 9;

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);

let sizeBeforeTreatment = 0;
let sizeAfterTreatment = 0;
let directories = [];

(async () => {
    if(!fs.existsSync(output)) await mkdir(output);
    
    do {
        const currentDir = directories.length > 0 ? directories.shift() : '';
        const files = await readdir(`${base}/${currentDir}`);
        
        for(let file of files) {
            const fsStat = await stat(`${base}/${currentDir}/${file}`);
            
            sizeBeforeTreatment += fsStat.size;
            
            if(fsStat.isDirectory()) {
                if(!fs.existsSync(`${output}/${currentDir}/${file}`)) mkdir(`${output}/${currentDir}/${file}`);
                
                directories.push(`${currentDir}/${file}`);
                continue;
            }
            
            await compress(`${base}/${currentDir}/${file}`, `${output}/${currentDir}/${file}`);
        }
    } while(directories.length > 0);
    
    console.log('Compression successfully completed', convertBytes(sizeBeforeTreatment), convertBytes(sizeAfterTreatment));
})();

compress = async (path, destination) => {
    if(path.slice(-4).toLowerCase() !== '.png') return;
    
    try {
        const compression = await sharp(path)
        .png({
            quality: parseInt(quality),
            compressionLevel: parseInt(compressionLevel),
            force: true
        })
        .toFile(destination);
        
        sizeAfterTreatment += compression.size;
    } catch(err) {
        console.log(err, path);
    }
}

const convertBytes = function(bytes) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    
    if (bytes == 0) {
        return "n/a"
    }
    
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    
    if (i == 0) {
        return bytes + " " + sizes[i]
    }
    
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}