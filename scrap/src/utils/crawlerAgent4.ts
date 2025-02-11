import "dotenv/config";
import axios from "axios";
const puppeteer = require("puppeteer");

import { GoogleGenerativeAI } from "@google/generative-ai";

const schema = {
  description: "Product details in JSON format",
  type: Object,
  properties: {
    productDetails: {
      type: Object,
      properties: {
        title: { type: String, description: "Product title" },
        brand: { type: String, description: "Product brand" },
        price: { type: Number, description: "Product price" },
        discountPercentage: {
          type: Number,
          description: "Discount percentage",
        },
        originalPrice: {
          type: Number,
          description: "Original price",
        },
        shippingAndImportFees: {
          type: Number,
          description: "Shipping and import fees",
        },
        color: { type: String, description: "Product color" },
        size: { type: String, description: "Product size" },
        material: {
          type: String,
          description: "Product material",
        },
        packageInformation: {
          type: String,
          description: "Package information",
        },
        includedComponents: {
          type: Array,
          items: {
            type: String,
            description: "Included component",
          },
          description: "List of included components",
        },
        unitCount: { type: Number, description: "Unit count" },
        aboutItem: {
          type: Array,
          items: {
            type: String,
            description: "About item description",
          },
          description: "About item descriptions",
        },
        productDimensions: {
          type: String,
          description: "Product dimensions",
        },
        itemModelNumber: {
          type: String,
          description: "Item model number",
        },
        asin: { type: String, description: "ASIN" },
        customerReviews: {
          type: Object,
          properties: {
            rating: {
              type: Number,
              description: "Customer rating",
            },
            count: {
              type: Number,
              description: "Number of ratings",
            },
          },
          description: "Customer reviews",
        },
        bestSellersRank: {
          type: Object,
          properties: {
            category: {
              type: String,
              description: "Best seller category",
            },
            rank: {
              type: Number,
              description: "Best seller rank",
            },
            subCategory: {
              type: String,
              description: "Best seller subcategory",
            },
            subCategoryRank: {
              type: Number,
              description: "Best seller subcategory rank",
            },
          },
          description: "Best seller rank",
        },
        itemWeight: { type: String, description: "Item weight" },
        manufacturer: {
          type: String,
          description: "Manufacturer",
        },
        dateFirstAvailable: {
          type: String,
          description: "Date first available",
        },
      },
      required: [
        "title",
        "brand",
        "price",
        "includedComponents",
        "aboutItem",
        "customerReviews",
        "bestSellersRank", // Add other required fields as needed
      ],
      description: "Details about the product",
    },
  },
  required: ["productDetails"],
};
async function generateProductDetails(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash", // or "gemini-1.5-flash" if suitable
  });

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  console.log(result.response);
  console.log("-------------------------------------------------");
  // console.log(JSON.stringify(JSON.parse(result.response.text()), null, 2)); // Pretty print the JSON
}

const db = new Map<string, any>();

// Save product details to the database
const saveProductDetails = (data: any) => {
  if (!data) {
    return { message: "Invalid product data. Missing required fields." };
  }

  // const { asin } = data.product;

  // if (db.has(asin)) {
  //   return {
  //     message: `Product with ASIN: ${asin} is already saved in the database.`,
  //   };
  // }

  // db.set(asin, data);
  // return {
  //   status: 201,
  //   message: "Data saved in DB successfully.",
  //   product: data.product,
  // };

  return { message: "string", status: 6, product: "any" };
};

const sampleInput = {
  product_name:
    "Coquimbo Sewing Kit Gifts for Mom Grandma Women Men Adults Kids Teens Beginner Kids Traveler, Portable Sewing Supplies Accessories Contains Thread, Needles, Scissors, Dorm Room Essentials (Black, M)",
  brand: "Coquimbo",
  rating: 4.5,
  number_of_ratings: 55551,
  best_seller_rank: "#1 Best Seller in Sewing Project Kits",
  units_sold_past_month: "20K+",
  price: 5.99,
  discount: "-40%",
  list_price: 9.99,
  shipping_and_import_fees_to_bangladesh: 170.39,
  color: "Black",
  size: "M",
  material: "Oxford cloth",
  package_information: "Bag",
  included_components:
    "1 measuring tape, 1 scissors, 18 color spools of thread, 30 quality needles, 1 metal thimble",
  unit_count: 1.0,
  description:
    "This sewing kit includes all the necessary tools for basic sewing - thread, needles, scissors, buttons, thimbles, measuring tape, threader, seam ripper, safety pins, and other sewing accessories - all neatly packaged and ready for use. Whether you're a beginner or a professional tailor, you can easily use this kit. With this sewing tool kit, you don't have to go to a tailor for basic repairs – you can be self-sufficient and handle small repairs on your own, saving you money and time and making your life easier. All sewing accessories are securely fastened with elastic bands in a convenient zippered case to keep everything tidy and you can use it whenever you need it. The compact and lightweight design makes it easy to carry, and you can put the travel sewing kit in your handbag or suitcase for emergencies. This sewing kit is a terrific gift for people who travel frequently, mothers, grandmothers, backpackers, and girls! The kit is also suitable for both men and women, beginners and professionals alike, and it is definitely something that everyone needs in their life. You can use this mini sewing kit with your child to sew their stuffed toys or cute pet clothes by hand. You can also use it to teach your kids to make beautiful handicrafts, unleash their creativity, and enjoy happy family time in their spare time",
  product_dimensions: "5.63 x 4.53 x 1.34 inches",
  item_model_number: "SK-001",
  asin: "B0BXKB7QF6",
  item_weight: "5 ounces",
  manufacturer: "Coquimbo",
  date_first_available: "April 1, 2023",
  arts_crafts_and_sewing_rank: "#18 in Arts, Crafts & Sewing",
};

const SYSTEM_PROMPT = `
  You are an AI Assistant with START, PLAN, ACTION, OBSERVATION, and OUTPUT states. 
  
  1. **START**: Receive a raw text dataset for processing.
  2. **PLAN**: Identify the best way to extract structured product details from the raw text. You will follow the ${schema} format strictly.
  3. **ACTION**: Execute the function (e.g., 'saveProductDetails') to save the data to the database.
  4. **OBSERVATION**: Receive structured data and verify completeness, following the schema format.
  5. **OUTPUT**: Return a response based on the START prompt and observations.

  ### **Rules & Guidelines:**
  - Always **plan before taking action**.
  - Choose the **most relevant function dynamically** (e.g., 'saveProductDetails' for saving the product). Follow the schema format strictly.
  - Strictly rely on 'OBSERVATION'; **never assume missing data**.
  - Handle errors gracefully and notify the user if data is incomplete.
  - Provide structured **JSON responses** for seamless DB storage.
  - Strictly follow the JSON output formet 
  ---
  ### **AVAILABLE TOOLS:**
  - function saveProductDetails: (data: typeof schema) => {message:string, status?:number, product?:any}
  saveProductDetails is a function that recieve an object and save it to database and returns an object.
  - SAMPLE_INPUT 
  - SAMPLE_OBSERVATION

  EXAMPLE-
  START
 {"type":"user","user":"Hey, extract product details from this raw text."}
 {"type":"plan","plan":"I will extract structured product details from the raw text and follow the SAMPLE_OBSERVATION format strictly."}
 {"type":"action", "function":"saveProductDetails", "input": ${sampleInput}}
 {"type":"observation", "observation": {"status": 201, "message": "Data saved in DB successfully.", "product": {"key":"value"} } }
 {
    "type": "output",
    "message": "Here are the extracted product details...",
    "product": {"key":"value"}
  }
  
  ---
  
  ### **Error Handling**
  - If **product details are missing**, notify the user:
    
    {"type": "output", "message": "Some details were missing. Available data: {...}"}
    
  - If **no product data** is found, return:
    
    {"type": "output", "message": "No valid product details found in the provided text."}
  
  - If **database error** occurs:
  
    {"type": "output", "message": "Database error occurred. Please try again later."}
    
  
  ---
  
  Follow this structured execution process for every request.
`;

async function scrapeWithAxiosAndPuppeteer(url) {
  try {
    // Fetch the HTML using Axios
    const { data: htmlContent } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set the raw HTML content in Puppeteer
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

    // Extract text from the #centerCol inside #ppd
    const productDetails = await page.evaluate(() => {
      const element = document.querySelector("#ppd #centerCol");
      const details = document.querySelector("#prodDetails").innerText;
      const fullDetails = {
        details1: element ? element?.innerText?.trim() : "Element not found",
        details2: details,
      };

      return fullDetails;
    });

    generateProductDetails(
      JSON.stringify(productDetails) +
        ` ${SYSTEM_PROMPT}
        `
    );
    // console.log({ productDetails });

    await browser.close();
    return productDetails;
  } catch (error) {
    console.error("❌ Error:", error);
    return "";
  }
}

// // Example Usage
scrapeWithAxiosAndPuppeteer(
  "https://www.amazon.com/Futricy-Beginner-Traveler-Emergency-Accessories/dp/B0BXKB7QF6?th=1"
); // Replace with actual product URL

// what kind of info can you collect from from?it would be better if you give in json formet .
//         follow the ${schema} strictly for your output response. don't go beyond it.
