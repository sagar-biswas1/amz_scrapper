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

function extractJson(text) {
  console.log(text);

  // Use a regular expression to extract everything between the first { and the last }
  const regex = /{[\s\S]*}/;
  const match = text.match(regex);

  if (match) {
    try {
      return JSON.parse(match[0]); // Parse the extracted JSON
    } catch (error) {
      console.error("Error parsing JSON:", error);
      console.error("Problematic JSON String:", match[0]);
      return null; // Handle error properly
    }
  } else {
    console.error("No JSON found in the text.");
    return null;
  }
}
const saveProductDetails = (data: any) => {
  if (!data) {
    console.log(data);
    return { message: "Invalid product data. Missing required fields." };
  }

  console.log("saving product in db", data);



  return { message: "string", status: 6, product: "any" };
};
const tools = {
  saveProductDetails: saveProductDetails,
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

async function generateProductDetails(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Attempt to parse the JSON response.  Crucially important for agent to use the data.
    try {
      const jsonResponse = extractJson(responseText);
      console.log("Parsed JSON:", jsonResponse); // Log the parsed JSON
      if (jsonResponse) return saveProductDetails(jsonResponse);
      else return jsonResponse;

      return jsonResponse; // Return the parsed JSON object
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      console.error("Raw response text:", responseText); // Log raw text for debugging
      return {
        type: "output",
        message: "Invalid JSON response from the model.",
      }; // Return error object
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      type: "output",
      message: "Error communicating with Gemini API.",
    }; // Return error object
  }
}

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

// const SYSTEM_PROMPT = `
//     You are an AI Assistant with START and states. Your task is to extract product details following ${schema} strictly and following this schema is very important to keep consistency in database.
  
//    **ACTION**: Execute the function (e.g., 'saveProductDetails') to save the data to the database. Important:  Return ONLY the valid JSON object. Do not include any surrounding text, backticks, or code formatting.  The response should be directly parsable by JSON.parse().**


//   ### **Rules & Guidelines:**
//   -never assume missing data.
//   - Handle errors gracefully and notify the user if data is incomplete.
//   - Provide structured **JSON responses** for seamless DB storage.
//   - Strictly follow the JSON output formet 


//   ### **AVAILABLE TOOLS:**
//   - function saveProductDetails: (data: typeof schema) => {message:string, status?:number, product?:any}
//   saveProductDetails is a function that recieve an object and save it to database and returns an object.
//   - SAMPLE_INPUT 
//   - SAMPLE_OBSERVATION

//   EXAMPLE-
//   START
//  {"type":"user","user":"Hey, extract product details from this raw text."}
//  {"type":"action", "function":"saveProductDetails", "input": ${sampleInput}}
//   ---
  
//   ### **Error Handling**
//   - If **product details are missing**, notify the user:
    
//     {"type": "output", "message": "Some details were missing. Available data: {...}"}
    
//   - If **no product data** is found, return:
    
//     {"type": "output", "message": "No valid product details found in the provided text."}
  
//   - If **database error** occurs:
  
//     {"type": "output", "message": "Database error occurred. Please try again later."}
    
  
//   ---
  
//   Follow this structured execution process for every request.  **Ensure that the JSON you return in the "output" state conforms to the provided schema.**
// `;


const SYSTEM_PROMPT=`
You are an AI Assistant responsible for extracting structured product details and ensuring consistency in database storage. Your task is to strictly follow the given JSON schema **without assumptions or omissions**. 

---
### **Execution Process**
1. **START**: Receive a raw text dataset for processing.
2. **ACTION**: Extract product details and execute ${saveProductDetails}.
3. **OUTPUT**: Return a structured response confirming the action.

---
### **Strict JSON Schema**
✅ Always return a **valid JSON object** that can be parsed by JSON.parse().  
✅ Do **NOT** include extra text, Markdown formatting, or backticks.  
✅ Ensure responses strictly conform to this **schema**:  

{
  "type": "output",
  "message": "Descriptive message",
  "product": {
    "product_title": "string",
    "brand": "string",
    "rating": "number",
    "price": "number",
    "list_price": "number",
    "discount_percentage": "number",
    "category": "string",
    "color": "string",
    "size": "string",
    "material": "string",
    "package_information": "string",
    "included_components": "string",
    "unit_count": "number",
    "description": "string"
  }
}
`
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
      const details = document.querySelector("#prodDetails")?.textContent;
      const fullDetails = {
        details1: element ? element?.textContent?.trim() : "Element not found",
        details2: details,
      };

      return fullDetails;
    });

   console.log( await generateProductDetails(
    JSON.stringify(productDetails) +
      ` ${SYSTEM_PROMPT}
        `
  ))
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
  "https://www.amazon.com/Sewing-Needle-Thread-Kit-Adults/dp/B0BFG59594/?_encoding=UTF8&pd_rd_w=MBNtw&content-id=amzn1.sym.730a4fb4-1f7f-4520-9e50-8136d347aedd%3Aamzn1.symc.abfa8731-fff2-4177-9d31-bf48857c2263&pf_rd_p=730a4fb4-1f7f-4520-9e50-8136d347aedd&pf_rd_r=0JFJ8PZGB5HEJR1Y5FRY&pd_rd_wg=X96OP&pd_rd_r=4045669d-8ffd-44cc-853b-a114b01a4a1a&ref_=pd_hp_d_btf_ci_mcx_mr_ca_id_hp_d"
); // Replace with actual product URL

// ... (Example Usage remains the same)

