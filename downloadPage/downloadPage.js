const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

async function downloadPage(url, outputPath) {
    try {
        // Baixa o conteúdo da página
        const response = await axios.get(url);
        const html = response.data;

        // Cria uma instância do cheerio para analisar o HTML
        const $ = cheerio.load(html);

        // Função para criar diretórios recursivamente
        async function createDirectoryRecursive(directory) {
            try {
                await mkdirAsync(directory, { recursive: true });
            } catch (error) {
                console.error(`Erro ao criar diretório ${directory}: ${error}`);
            }
        }

        // Garante que o diretório de saída exista
        await createDirectoryRecursive(outputPath);

        // Função para baixar um asset e atualizar seu link no HTML
        async function downloadAsset(assetUrl, assetType) {
            try {
                const assetResponse = await axios.get(url + assetUrl, { responseType: 'arraybuffer' });

                // Obter o caminho do asset local baseado na estrutura de diretórios original
                // const assetPath = path.join(outputPath, path.relative(url, assetUrl));
                const assetPath = assetUrl;

                // Extrair o diretório do caminho do asset
                const assetDir = path.dirname(assetPath);
                
                // Criar o diretório (e seus pais, se necessário) localmente
                await createDirectoryRecursive(assetDir);

                // Salvar o asset localmente
                await writeFileAsync(assetPath, assetResponse.data);

                // Atualizar o link do asset no HTML
                // const relativeAssetPath = path.relative(outputPath, assetPath).replace(/\\/g, '/'); // Substituir barras invertidas por barras normais para sistemas Windows
                // $(`[src="${assetUrl}"], [href="${assetUrl}"]`).attr('src', relativeAssetPath);
            } catch (error) {
                console.error(`Erro ao baixar asset ${assetUrl}: ${error}`);
            }
        }

        // Baixa todos os assets (imagens, folhas de estilo, scripts)
        const assetPromises = [];
        $('img').each((index, element) => {
            const imgUrl = $(element).attr('src');
            assetPromises.push(downloadAsset(imgUrl, 'image'));
        });
        $('link[rel="stylesheet"]').each((index, element) => {
            const styleUrl = $(element).attr('href');
            assetPromises.push(downloadAsset(styleUrl, 'style'));
        });
        $('script').each((index, element) => {
            const scriptUrl = $(element).attr('src');
            if (scriptUrl) {
                assetPromises.push(downloadAsset(scriptUrl, 'script'));
            }
        });

        // Analisar o CSS para encontrar URLs de fontes específicas
        $('link[rel="stylesheet"]').each(async (index, element) => {
          const cssLinkUrl = $(element).attr('href');
          if (cssLinkUrl) {
              try {
                  const cssUrl = url + cssLinkUrl;
                  
                  const cssResponse = await axios.get(cssUrl);
                  const cssText = cssResponse.data;
                  const fontUrls = cssText.match(/url\(([^)]+)\)/g);
                  if (fontUrls) { 
                      fontUrls.forEach((fontUrl) => {
                          const urlMatch = fontUrl.match(/url\(["']?(.+?)["']?\)/);
                          if (urlMatch && urlMatch[1]) {
                              const fontSourceUrl = urlMatch[1];
                              const absoluteFontUrl = new URL(fontSourceUrl, url + cssLinkUrl).toString();
                              if (absoluteFontUrl.includes('.eot') || absoluteFontUrl.includes('.ttf') || absoluteFontUrl.includes('.woff') || absoluteFontUrl.includes('.svg')) {
                                const cleanUrl = absoluteFontUrl.replace(url, '').split('?')[0];
                                assetPromises.push(downloadAsset(cleanUrl, 'font'));
                              }
                          }
                      });
                  }
              } catch (error) {
                  console.error(`Erro ao baixar o fontes de ${cssLinkUrl}: ${error}`);
              }
          }
      });

        // Espera o download de todos os assets ser concluído
        await Promise.all(assetPromises);

        // Salva o HTML com os links dos assets atualizados
        await writeFileAsync(path.join(outputPath, 'index.html'), $.html());
        console.log('Página e assets baixados com sucesso!');
    } catch (error) {
        console.error(`Erro ao baixar a página: ${error}`);
    }
}

// Exemplo de uso:
const url = 'https://wellnessonlineeveryday.net/blood-sugar-blaster';
const outputPath = './downloaded_page';
downloadPage(url, outputPath);
