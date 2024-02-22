const https = require('https');
const fs = require('fs');

// Defina a lista de URLs dos arquivos que deseja baixar
const urls = [
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/favicon-main-128x128.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/mobirise2.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/mobirise-icons.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/bootstrap.min.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/bootstrap-grid.min.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/bootstrap-reboot.min.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/animate.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/style.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/styles.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/style(1).css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/mbr-additional.css",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/untitled-200-120-px-2-500x300.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/untitled-200-120-px-1-500x300.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/untitled-200-120-px-500x300.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/untitled-200-120-px-3-500x300.png",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/m1-730x383.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/stars-3-400x60.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/m2-730x383.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/stars-3-400x60.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/m3-730x383.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/stars-3-400x60.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic-buy.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic-price.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/untitled-design-46-680x450.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic-price.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/emperorsvigortonic.png" ,
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/bootstrap.bundle.min.js.download",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/smooth-scroll.js.download",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/index.js.download",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/navbar-dropdown.js.download",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/mbr-switch-arrow.js.download",
"https://emperorsvigortonic.colibrim.com/emperorsvigortonic/script.js.download",
];

// Função para baixar um único arquivo
function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve(true));
            });
        }).on('error', error => {
            fs.unlink(destination, () => reject(error));
        });
    });
}

// Função para baixar vários arquivos
async function downloadFiles(urls) {
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filename = url.split('/').pop();
        console.log(`Baixando ${filename}...`);
        try {
            await downloadFile(url, filename);
            console.log(`${filename} baixado com sucesso.`);
        } catch (error) {
            console.error(`Erro ao baixar ${filename}: ${error.message}`);
        }
    }
}

// Chamada da função para baixar os arquivos
downloadFiles(urls);