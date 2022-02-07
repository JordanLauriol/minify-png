# minify-png
Allows you to compress the images (.png) in a folder and its subfolders.

### How to use ?

```bash
npm install
node index.js --base=PATH --ouput=PATH
```

|  Parameters | Value  |
| ------------ | ------------ |
| --base   | Path to the folder to be compressed  |
| --output |   Path to the output folder |
| --quality | Default: 50  |
| --compression-level | Default: 9 (min: 1 / max: 9) |
