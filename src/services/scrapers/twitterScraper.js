const { chromium } = require("playwright");

async function scrapeTweetMedia(url, timeout = 15000) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "networkidle" });

    // Espera pelo container do tweet, que geralmente é uma tag article
    await page.waitForSelector("article", { timeout });

    // Tenta pegar vídeo dentro do tweet
    const videoUrl = await page.$eval(
      "article video",
      video => video.currentSrc
    ).catch(() => null);

    if (videoUrl) {
      return {
        type: "video",
        urls: [videoUrl],
        count: 1
      };
    }

    // Se não achou vídeo, tenta pegar imagens do tweet
    const imageUrls = await page.$$eval(
      "article img",
      imgs => imgs
        // Filtrar imagens que provavelmente são mídia do tweet (excluir avatares e ícones)
        .map(img => img.src)
        .filter(src => src && !src.includes("profile_images") && !src.includes("emoji"))
    );

    if (imageUrls.length > 0) {
      return {
        type: "images",
        urls: imageUrls,
        count: imageUrls.length
      };
    }

    throw new Error("Nenhuma mídia encontrada no tweet.");

  } finally {
    await browser.close();
  }
}

module.exports = { scrapeTweetMedia };

