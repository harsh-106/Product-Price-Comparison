import express, { response } from "express";
import puppeteer from "puppeteer";
import cors from "cors";
import stringSimilarity from "string-similarity"; 

const app = express();
app.use(cors());



const flipkartUrl = (query) => `https://www.flipkart.com/search?q=${query}`;
const amazonUrl = (query) => `https://www.amazon.in/s?k=${query}`;

const fetchFlipkartData = async (query) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  );

  await page.goto(flipkartUrl(query), { waitUntil: "networkidle2" });

  await page.waitForSelector(".cPHDOP", { timeout: 5000 }).catch(() => {});

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".cPHDOP")).map((product) => ({
      title: product.querySelector(".KzDlHZ")?.innerText || "No title",
      price: product.querySelector(".Nx9bqj._4b5DiR")?.innerText || "No price",
      image: product.querySelector(".DByuf4")?.src || null,
      url: "https://www.flipkart.com" + (product.querySelector("a")?.getAttribute("href") || ""),
    }));
  });

  await browser.close();
  return products;
};



const fetchAmazonData = async (query) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  );

  await page.goto(amazonUrl(query), { waitUntil: "networkidle2" });

  await page.waitForSelector('[role="listitem"].sg-col-20-of-24', { timeout: 5000 }).catch(() => {});

  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="listitem"].sg-col-20-of-24')).map((product) => ({
      title:
        product.querySelector("h2")?.getAttribute("aria-label") ||
        product.querySelector("h2 span")?.innerText ||
        "No title",
      price: product.querySelector(".a-offscreen")?.innerText || "No price",
      image: product.querySelector(".s-image")?.src || null,
      url: "https://www.amazon.in" + (product.querySelector("a")?.getAttribute("href") || ""),
    }));
  });

  await browser.close();
  return products;
};




const mergeProductData = (flipkart, amazon) => {
  const mergedData = [];

  flipkart.forEach((fkProduct) => {
    let bestMatch = { index: -1, similarity: 0 };

    amazon.forEach((amProduct, index) => {
      const similarity = stringSimilarity.compareTwoStrings(
        fkProduct.title.toLowerCase(),
        amProduct.title.toLowerCase()
      );
      if (similarity > bestMatch.similarity) {
        bestMatch = { index, similarity };
      }
    });

    if (bestMatch.similarity > 0.6) {
      const matchedAmazon = amazon[bestMatch.index];

      const mergedItem = {
        itemName: fkProduct.title,
        image: fkProduct.image || matchedAmazon.image,
        details: {
          flipkart: fkProduct.price !== "No price" ? { price: fkProduct.price, url: fkProduct.url } : null,
          amazon: matchedAmazon.price !== "No price" ? { price: matchedAmazon.price, url: matchedAmazon.url } : null,
        },
      };

      amazon.splice(bestMatch.index, 1);

      if (mergedItem.itemName && (mergedItem.details.flipkart || mergedItem.details.amazon)) {
        mergedData.push(mergedItem);
      }
    } else {
      if (fkProduct.price !== "No price") {
        mergedData.push({
          itemName: fkProduct.title,
          image: fkProduct.image,
          details: {
            flipkart: { price: fkProduct.price, url: fkProduct.url },
            amazon: null,
          },
        });
      }
    }
  });

  amazon.forEach((amProduct) => {
    if (amProduct.price !== "No price") {
      mergedData.push({
        itemName: amProduct.title,
        image: amProduct.image,
        details: {
          flipkart: null,
          amazon: { price: amProduct.price, url: amProduct.url },
        },
      });
    }
  });

  return mergedData.filter((item) => item.details.flipkart || item.details.amazon);
};

app.get("/", (req, res) => {
  res.json("Hello world")
})

app.get("/api/v1/search/:query", async (req, res) => {
  const { query } = req.params;
  try {
    const [flipkartData, amazonData] = await Promise.all([fetchFlipkartData(query), fetchAmazonData(query)]);
    const mergedData = mergeProductData(flipkartData, amazonData);
    res.json(mergedData);
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
