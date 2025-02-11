import "dotenv/config";

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_AI_KEY,
});

// Define the product details interface
interface ProductDetails {
  product: {
    name: string;
    brand: string;
    category: string;
    asin: string;
    description: string;
    features: string[];
    specifications: {
      dimensions: string;
      weight: string;
      material: string;
      included_components: string[];
    };
  };
  pricing: {
    current_price: number;
    original_price: number;
    discount: string;
    currency: string;
    shipping_cost: number;
    shipping_destination: string;
    availability: string;
  };
  seller: {
    sold_by: string;
    ships_from: string;
    return_policy: string;
  };
  variants: {
    color: string;
    sizes: string[];
  };
  customer_reviews: {
    average_rating: number;
    total_reviews: number;
    best_sellers_rank: {
      category: string;
      rank: number;
    };
    top_reviews: {
      author: string;
      rating: number;
      date: string;
      review: string;
      verified_purchase: boolean;
    }[];
  };
  related_products: {
    name: string;
    price: number;
    discount: string;
    rating: number;
    total_reviews: number;
  }[];
  questions_and_answers: {
    question: string;
    answer: string;
  }[];
}

// Simulate a database using a Map
const db = new Map<string, ProductDetails>();

// Save product details to the database
const saveProductDetails = (data: ProductDetails) => {
  if (
    !data.product ||
    !data.product.name ||
    !data.product.brand ||
    !data.product.asin
  ) {
    return { message: "Invalid product data. Missing required fields." };
  }

  const { asin } = data.product;

  if (db.has(asin)) {
    return {
      message: `Product with ASIN: ${asin} is already saved in the database.`,
    };
  }

  db.set(asin, data);
  return {
    status: 201,
    message: "Data saved in DB successfully.",
    product: data.product,
  };
};

// Preprocess the input to extract relevant sections
const preprocessInput = (input: string) => {
  const productName = input.match(/Product Name: (.+)/)?.[1];
  const description = input.match(/Description: (.+)/)?.[1];
  return { productName, description };
};
const SAMPLE_INPUT = `Skip to\nMain content\nKeyboard shortcuts\nSearch\nalt\n+\n/\nCart\nshift\n+\nalt\n+\nc\nHome\nshift\n+\nalt\n+\nh\nOrders\nshift\n+\nalt\n+\no\nShow/hide shortcuts, shift, alt, z\nShow/Hide shortcuts\nshift\n+\nalt\n+\nz\nDeliver to\nBangladesh\nAll\nAll Departments\nArts & Crafts\nAutomotive\nBaby\nBeauty & Personal Care\nBooks\nBoys' Fashion\nComputers\nDeals\nDigital Music\nElectronics\nGirls' Fashion\nHealth & Household\nHome & Kitchen\nIndustrial & Scientific\nKindle Store\nLuggage\nMen's Fashion\nMovies & TV\nMusic, CDs & Vinyl\nPet Supplies\nPrime Video\nSoftware\nSports & Outdoors\nTools & Home Improvement\nToys & Games\nVideo Games\nWomen's Fashion\nEN\nHello, sign in\nAccount & Lists\nReturns\n& Orders\n0\nCart\nWe're showing you items that ship to Bangladesh. To see items that ship to a different country, change your delivery address.\nDismiss\n \nChange Address\nAll\nToday's Deals\nCustomer Service\nRegistry\nGift Cards\nSell\nDisability Customer Support\nSponsored \nArts, Crafts & Sewing\n›\nSewing\n›\nSewing Project Kits\n$6.99\n$6\n.\n99\n$174.88 Shipping & Import Fees Deposit to Bangladesh Details \n\nDelivery February 14 - 19\nDeliver to Bangladesh\nIn Stock\n\nQuantity:\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\nQuantity:1\nAdd to Cart\nBuy Now\nShips from\nAmazon\nSold by\nPerPing\nReturns\n30-day refund/replacement\nPayment\nSecure transaction\nAdd a gift receipt for easy returns\nAdd to List\nOther sellers on Amazon\nNew (4) from   \n$6.99\n$6\n.\n99\nSponsored \n3+\n7 VIDEOS\nRoll over image to zoom in\n\t\n\t\nCoquimbo Sewing Kit Gifts for Mom Grandma Women Men Adults Kids Teens Beginner Kids Traveler, Portable Sewing Supplies Accessories Contains Thread, Needles, Scissors, Dorm Room Essentials (Black, M)\nVisit the Coquimbo Store\n4.5 \n4.5 out of 5 stars\n    55,513 ratings | Search this page\n#1 Best Seller in Sewing Project Kits\n30K+ bought in past month\n$6.99 with 30 percent savings\n-30% \n$6\n.\n99\nList Price: $9.99\nList Price: \n$9.99\n$9.99 \n$174.88 Shipping & Import Fees Deposit to Bangladesh Details \n\nColor: Black\n$6.99 with 30 percent savings\n$6.99\n$9.99\n$9.99\nDelivery Wed, Feb 19\n$9.99 with 9 percent savings\n$9.99\n$10.99\n$10.99\nDelivery Wed, Feb 12\n$9.99\n$9.99\nDelivery Thu, Feb 13\n$9.99\n$9.99\nDelivery Wed, Feb 12\n$9.99\n$9.99\nDelivery Thu, Feb 13\nSize: M\nM\nS\nL\nMaterial\tOxford cloth\nBrand\tCoquimbo\nPackage Information\tBag\nIncluded Components\t1 measuring tape, 1 scissors, 18 color spools of thread, 30 quality needles, 1 metal thimble\nUnit Count\t1.0 Count\nAbout this item\n𝑴𝒆𝒆𝒕 𝒀𝒐𝒖𝒓 𝑩𝒂𝒔𝒊𝒄 𝑺𝒆𝒘𝒊𝒏𝒈 𝑵𝒆𝒆𝒅𝒔: This sewing kit includes all the necessary tools for basic sewing - thread, needles, scissors, buttons, thimbles, measuring tape, threader, seam ripper, safety pins, and other sewing accessories - all neatly packaged and ready for use\n𝑺𝒊𝒎𝒑𝒍𝒆 𝑺𝒆𝒘𝒊𝒏𝒈 𝑺𝒕𝒂𝒓𝒕𝒆𝒓 𝑲𝒊𝒕: Whether you're a beginner or a professional tailor, you can easily use this kit. With this sewing tool kit, you don't have to go to a tailor for basic repairs – you can be self-sufficient and handle small repairs on your own, saving you money and time and making your life easier\n𝑻𝒓𝒂𝒗𝒆𝒍 𝑬𝒔𝒔𝒆𝒏𝒕𝒊𝒂𝒍 𝑪𝒐𝒎𝒑𝒂𝒏𝒊𝒐𝒏: All sewing accessories are securely fastened with elastic bands in a convenient zippered case to keep everything tidy and you can use it whenever you need it. The compact and lightweight design makes it easy to carry, and you can put the travel sewing kit in your handbag or suitcase for emergencies\n𝑨 𝑼𝒔𝒆𝒇𝒖𝒍 𝑮𝒊𝒇𝒕 𝑪𝒉𝒐𝒊𝒄𝒆: This sewing kit is a terrific gift for people who travel frequently, mothers, grandmothers, backpackers, and girls! The kit is also suitable for both men and women, beginners and professionals alike, and it is definitely something that everyone needs in their life\n𝑬𝒏𝒋𝒐𝒚 𝑻𝒉𝒆 𝑭𝒖𝒏 𝒐𝒇 𝑯𝒂𝒏𝒅 𝑺𝒆𝒘𝒊𝒏𝒈: You can use this mini sewing kit with your child to sew their stuffed toys or cute pet clothes by hand. You can also use it to teach your kids to make beautiful handicrafts, unleash their creativity, and enjoy happy family time in their spare time\n   Report an issue with this product or seller\nSponsored \nCustomers also bought\nBased on products customers bought together\n\n\nThis item: Coquimbo Sewing Kit Gifts for Mom Grandma Women Men Adults Kids Teens Beginner Kids Traveler, Portable Sewing Supplies Accessories Contains Thread, Needles, Scissors, Dorm Room Essentials (Black, M)\n4.5\n4.5 out of 5 stars\n 55,513\n-30% \n$6.99\n$6\n.\n99\nList: $9.99\n+\nSponsored\nWenrook 300 Pack Safety Pins Assorted, 4 Different Sizes, Strong Nickel Plated Steel, Safety Pins for Clothes, Crafts, Pinning and More\n4.5\n4.5 out of 5 stars\n 8,588\n$5.97\n$5\n.\n97 ($0.02/Count)\nTotal price:$12.96\nAdd both to Cart\nThese items are shipped from and sold by different sellers.\nShow details\n4 stars and above\nSponsored \nVellostar Sewing Kit for Adults - A Portable Needle and Thread Kit with Essential S...\n 21,707\n$17.97\n$17\n.\n97\nSave 15% with coupon\n \nJUNING Sewing Kit with Case 168pcs Portable Sewing Accessories and Supplies for Hom...\n 28,534\nEnds in 03:40:49\n-10%\n$13.49\n$13\n.\n49\nTypical:\n$14.99\n$14.99\n \nTopus Extra Strong Upholstery Repair Sewing Thread Kit and Heavy Duty Household…\n 2,306\n$9.99\n$9\n.\n99(\n$0.02\n$0.02 / Foot)\n \nOKOMER Sewing Kit, Sewing Kit for Adults, Needle and Thread Kit, Travel Sewing Kit ...\n 4,520\n$5.99\n$5\n.\n99(\n$0.06\n$0.06 / Count)\n \nSewing Kit, 200 Premium Sewing Supplies, 41 XL Thread Spools, Suitable for…\n 2,370\n$19.99\n$19\n.\n99\n \nSewing Kit with Case Portable Sewing Supplies for Home Traveler, Adults,…\n 271\n$7.99\n$7\n.\n99\n \nAmrules Sewing Kit for Adults,Emergency Small Mini Sewing Supplies for Grandma, Mom...\n 55\n$5.29\n$5\n.\n29\nProducts related to this item\nSponsored \nJUNING Sewing Kit with Case 168pcs Portable Sewing Accessories and Supplies for Hom...\n 28,534\nEnds in 03:40:49\n-10%\n$13.49\n$13\n.\n49\nTypical:\n$14.99\n$14.99\n \nSewing Kit, 200 Premium Sewing Supplies, 41 XL Thread Spools, Suitable for…\n 2,370\n$19.99\n$19\n.\n99\n \nGoeveo Sewing Kit for Adults, Newly Upgraded Needle and Thread Kit Gifts for Mom Gr...\n 9\n$17.69\n$17\n.\n69\nSave 10% with coupon\n \nCoquimbo Sewing Kit Valentines Day Gifts for Mom Mama Women, Portable Sewing Suppli...\n 16\n$6.99\n$6\n.\n99(\n$3.50\n$3.50 / Item)\n \nVellostar Sewing Kit for Adults - A Portable Needle and Thread Kit with Essential S...\n 21,707\n$17.97\n$17\n.\n97\nSave 15% with coupon\n \nTopus Extra Strong Upholstery Repair Sewing Thread Kit and Heavy Duty Household…\n 2,306\n$9.99\n$9\n.\n99(\n$0.02\n$0.02 / Foot)\n \nOKOMER Sewing Kit, Sewing Kit for Adults, Needle and Thread Kit, Travel Sewing Kit ...\n 4,520\n$5.99\n$5\n.\n99(\n$0.06\n$0.06 / Count)\nProduct information\nProduct Dimensions\t5.63 x 4.53 x 1.34 inches\nItem model number\tSK-001\nASIN\tB0BXKB7QF6\nCustomer Reviews\t4.5 \n4.5 out of 5 stars\n    55,513 ratings\n4.5 out of 5 stars\nBest Sellers Rank\t#6 in Arts, Crafts & Sewing (See Top 100 in Arts, Crafts & Sewing)\n#1 in Sewing Project Kits\n\nItem Weight\t5 ounces\nManufacturer\tCoquimbo\nDate First Available\tApril 1, 2023\nWarranty & Support\nProduct Warranty: For warranty information about this product, please click here\nFeedback\nWould you like to tell us about a lower price? \n\n\nWARNING: California’s Proposition 65\nFrom the brand\n \n \n \n \n \nProduct Description\n\nCoquimbo\n\nTravel Sewing Kit\n\nTake it with you on your trip! It won't take up too much space for you to solve your urgent needs.\n\n \n\nCoquimbo\n\nHome Sewing Kit\n\nAlways have a sewing kit at home! It will take care of some simple fixes for you.\n\n \n\nCoquimbo\n\nMini Sewing Kit\n\nLightweight and compact, it fits right into your handbag and you won't feel tired carrying it.\n\n \n\nCoquimbo\n\nSchool Sewing Kit\n\nIt can be packed directly into backpacks to solve students' repair in case of campus emergency.\n\nLuggage Storage Drawer Storage Handbag Storage Backpack Storage\nHow To Use Sewing Kit Accessories\nEasy to use, children, women, men, and elderly can use the sewing kit\n \n \n \n   \n\nStart with Coquimbo.\n\nTop\nAbout this item\nSimilar\nProduct information\nQuestions\nReviews\nBased on your recent shopping trends\nJUNING Sewing Kit with Case Portable Sewing Supplies for Home Traveler, Adults, Beginner, Emergency, Kids Contains Thread, Scissors, Needles,Measuring Tape\n4.6 out of 5 stars\n 28,534\n-15%\n$6.79\n$6\n.\n79\nEnds in 03:40:50\nTypical: $7.99\nGet it as soon as Wednesday, Feb 12\n$26.61 shipping\nDUSCS Large Sewing Kit for Adults, 235 Pcs Needle and Thread Kit with Basic Sewing Supplies and Accessories for Travel Small Fixes, Emergency Repairs, Hand Sewing, Beginners, Starter\n4.7 out of 5 stars\n 115\n$21.99\n$21\n.\n99 ($0.09/Item)\nGet it as soon as Thursday, Feb 13\n$30.89 shipping\nSewing Kit for Adults,Maxfanay Needle and Thread Kit for Sewing,Professional Sewing Supplies Accessories with Tailor Scissors,43XL Thread,30 Needles,Thread Snips and More for Travel Home Beginners\n4.7 out of 5 stars\n 1,462\nAmazon's\nChoice\n-12%\n$19.99\n$19\n.\n99 ($2.86/Item)\nList: $22.65\nGet it as soon as Wednesday, Feb 12\n$30.15 shipping\nSewing Kit for Traveler, Adults, Beginner, Emergency, DIY Sewing Supplies Organizer Filled with Scissors, Thimble, Thread, Elastic,Sewing Needles, storage,Tape Measure etc (Black, X) Great gift\n4.5 out of 5 stars\n 734\n$9.99\n$9\n.\n99\nGet it as soon as Wednesday, Feb 12\n$27.09 shipping\nSewing Kit,Sewing Bag Set, Portable Sewing Kit - DIY Supplies with Accessories, Ideal for Adults, Beginners, Travelers and More. Includes Black Handbag.\n4.2 out of 5 stars\n 208\n$4.99\n$4\n.\n99\nGet it as soon as Thursday, Feb 13\n$25.88 shipping\nARTIKA Sewing Kit for Adults and Kids (106 PCS) - Small Beginner Set w/Multicolor Thread, Needles, Scissors, Thimble & Clips - Emergency Repair and Travel Kits - Sewing Accessories and Supplies\n4.6 out of 5 stars\n 54,981\n-49%\n$9.99\n$9\n.\n99\nList: $19.49\nGet it as soon as Thursday, Feb 13\n$27.38 shipping\nWhat's in the box\n18 color spools of thread\n30 quality needles\n1 scissors\n1 measuring tape\n1 metal thimble\nProducts related to this item\nSponsored \nPLANTIONAL Upholstery Repair Sewing Kit: 47 Pieces Heavy Duty Sewing Kit with Sewin...\n 3,167\n-23%\n$9.99\n$9\n.\n99(\n$0.21\n$0.21 / Count)\nList:\n$12.99\n$12.99\n \nJUNING Sewing Kit with Case Portable Sewing Supplies for Home Traveler, Adults, Beg...\n 28,534\nEnds in 03:40:49\n-10%\n$7.19\n$7\n.\n19\nTypical:\n$7.99\n$7.99\n \nSewing Kit with Case Portable Sewing Supplies for Home Traveler, Adults,…\n 271\n$7.99\n$7\n.\n99\n \nAmrules Sewing Kit for Adults,Emergency Small Mini Sewing Supplies for Grandma, Mom...\n 55\n$5.29\n$5\n.\n29\n \nVellostar Sewing Kit for Adults - A Portable Needle and Thread Kit with Essential S...\n 21,707\n$17.97\n$17\n.\n97\nSave 15% with coupon\n \nTopus Extra Strong Upholstery Repair Sewing Thread Kit and Heavy Duty Household…\n 2,306\n$9.99\n$9\n.\n99(\n$0.02\n$0.02 / Foot)\n \nINSCRAFT Sewing Kit, 200 Premium Sewing Supplies, 41 XL Thread Spools, Suitable for...\n 2,370\n$19.99\n$19\n.\n99\nVideos\nVideos for this product\n\n1:42\n\n\t\nMaterials quality? Enough supplies for beginners? My sewing kit 2 pack thoughts\n\nMichelle\n\n1:27\n\n\t\nSewing Kit in a pouch\n\nExploring Me and Top Deals\n\n3:01\n\n\t\nCustomer Review: Small Kit\n\n4 Lil Lambs\n\n3:40\n\n\t\nUnbox - Why I'm Sure This Sewing Kit Will Always be On Me!\n\nMichelle Broad Guzzo\n\n0:17\n\n\t\nGreat Sewing Kit for Home\n\nWhitney Willis\n\n1:29\n\n\t\nCustomer Review: Perfect little kit\n\nTopNotchTips\n\n0:24\n\n\t\nThis sewing kit is going to have everything you need\n\nBrittany Shaw\n\n0:53\n\n\t\nNice little sewing kit\n\n"Add to Cart " Says Nikki\n\n1:09\n\n\t\nHonest Review of the Coquimbo Sewing Kit\n\nbethy\n\n0:51\n\n\t\nPerfect All-in-One Sewing Kit for Beginners and Travelers!\n\nRoo Crew Family Reviews\n\nUpload your video\nSponsored\nSewing Needle Thread Kit Adults: Newly Upgraded 232 Pcs Professional Hand Sewing Supplies Kits - Large Sewing Kit for Adults Basic Starter Beginners Travel Emergency Sew Repair Set\n4.7\n4.7 out of 5 stars\n540\n$29.99\n$29.99List:\n$39.99\n$39.99\nLarge Sewing Kit for Adults: YUANHANG Newly Upgraded 251 Pcs Premium Sewing Supplies Set - Complete Sew Kit of Needle and Thread for Beginners - Travel Emergency - Basic Home Hand Sewing Repair Kits\n4.8\n4.8 out of 5 stars\n2,572\nAutomatic Needle Threader,New Sewing Machine Needle Threader,Sewing Needle Threaders,Plastic Needle Threaders,Automatic Needle Threading Device (3 PCS)\n3.2\n3.2 out of 5 stars\n328\nFNV Sewing kit, 229 pcs Sewing Accessories, Friendly for Beginner and Professional for Worker, Suitable for Travel, Home, School and DIY Gift, Needles, Scissors, 41XL Thread Spools\n4.6\n4.6 out of 5 stars\n89\n$20.99\n$20.99\nPLANTIONAL Upholstery Repair Sewing Kit: 47 Pieces Heavy Duty Sewing Kit with Sewing Awl, Seam Ripper, Leather Hand Sewing Stitching Needles, Sewing Thread for Car, Sofa, Backpack, Shoe, Craft DIY\n4.7\n4.7 out of 5 stars\n3,167\n$9.99\n$9.99List:\n$12.99\n$12.99\nLooking for specific info?\nCustomer reviews\n4.5 out of 5 stars\n4.5 out of 5\n55,513 global ratings\n5 star\n71%\n4 star\n16%\n3 star\n8%\n2 star\n2%\n1 star\n3%\nHow customer reviews and ratings work\nReview this product\nShare your thoughts with other customers\nWrite a customer review\nSponsored \nCustomers say\n\nCustomers find the sewing kit has everything they need to mend clothes and make quick repairs. They find it practical and useful for their sewing needs. The kit is compact and easy to carry, making it a valuable addition to their household. Many appreciate its value for money and portability. However, some customers dislike the thread quality and have mixed opinions on the size and overall quality.\n\nAI-generated from the text of customer reviews\n\nSelect to learn more\nKit quality\nFunctionality\nSewing needs\nValue for money\nTravelability\nSize\nQuality\nThread quality\nReviews with images\nSee all photos\nPrevious page\nNext page\nSort by reviews type\nTop reviews\nMost recent\nTop reviews\nTop reviews from the United States\n\tKeegan\n5.0 out of 5 stars\n Compact, Well-Organized, and Perfect for Any Sewing Need\nReviewed in the United States on January 11, 2025\nColor: BlackSize: MVerified Purchase\nThis sewing kit is a lifesaver! It has everything you could need for quick fixes or small projects, all neatly packed in a compact, portable case. The variety of thread colors is impressive, and the included tools – like needles, scissors, and a measuring tape – are sturdy and practical.\n\nThe size makes it perfect for travel or keeping in a dorm room, and it’s super easy to store without taking up much space. I love that it’s designed with beginners and casual users in mind, but it’s also handy for more experienced sewers.\n\nThis would make a thoughtful gift for anyone, whether they’re a beginner, a traveler, or someone who just wants to be prepared for wardrobe emergencies. Highly recommend it for its quality, convenience, and value!\n\nHelpful\nReport\n\tNexialist02\n5.0 out of 5 stars\n As Expected for the Price - good for traveling and small fixes\nReviewed in the United States on February 22, 2023\nColor: BlackSize: SVerified Purchase\nArrived today, so I cant yet say how strong the thread is (I will add to this review if any problems arise), but it is a decent little kit - for the price - for taking on vaca for small jobs. Referring to some points made by other reviewers:\nyes, the thread coils are quite small. But they appear to have more than enough thread to do a few simple jobs each. And there are two each of black and white, and three of light beige, which somewhat compensates for the lack of length. You will eventually need to buy more thread. By small jobs I mean re-attaching buttons, hopefully sewing a hatband onto a felt fedora (why I got it), but I wouldn't expect it to sew up a large rip in pants. As to difficulty in opening the case with the needles, there is a tiny piece of hard-to-see transparent tape securing it in place. This must be removed. After that, the black back piece is pretty easy to remove from the transparent part that actually holds the needles. When you remove that back piece, make sure it is/was on the top side, and hold the case perfectly flat, so no needles will not fall out even if the "hole" happens to be aligned with a needle "slot". Assuming needles dont start falling out, look at the side edge of the transparent part (it is opaque in places, but not the black backing.) You will see a gap at one point. To remove needles you need to rotate the transparent piece until the gap is over the "exit" slot for the needles you want to use. It is fairly difficult to rotate, use two opposing thumbs to turn it. Keep the whole thing level horizontally while you are turning the plastic, because whenever the "gap" goes over an "exit slot", if it's not perfectly level a bunch of needles will fall out.\nAs a beginner, the hardest part is getting the thread into the needle. This kit comes with two threaders, which help a little but its still difficult for an old fogey like me with shaky hands and non perfect eyesight to do. The biggest help for me is this very useful device I got somewhere a long time ago, maybe at a surplus store, a jewelers loupe (?) which is a thing with a strap that goes around your head, a little light, and a strong magnifying glass that goes down over you eyes. That brings intense magnification to bear while leaving your hands free. But you probably wont take that on vacation, so, get a pair of strong reading/magnifying gasses (get them at a dollar store, they are way too expensive elsewhere). Also, the thimble is a ring with no top, which may actually be more useful than a regular one since I push the needles with my finger tip, not the top of my finger. We'll see.\nThats a pretty long review for a $7 item, and I will add to it after I actually try it.\nOK,adding now after first use, sewing a hatband onto a felt hat. First, the thread is weak. It broke on me once when pulling through the felt. Thread is fuzzy, obviously not a strong polyester. Also, I was wrong about their 'ring' thimble being OK. A real thimble works much better. You get what you pay for.\n\nRead more\n28 people found this helpful\nHelpful\nReport\n\tTahir Haneef\n4.0 out of 5 stars\n Seamstress's Companion: A Review of the Coquimbo Sewing Kit\nReviewed in the United States on March 26, 2024\nColor: BlackSize: MVerified Purchase\nAs someone who values the art of sewing, I recently had the pleasure of using the Coquimbo Sewing Kit, and it has quickly become an essential companion in my crafting endeavors. This compact and comprehensive sewing kit offers everything a seamstress or tailor could need, all neatly packed into a portable case.\n\nOne of the most impressive aspects of the Coquimbo Sewing Kit is its versatility. Despite its small size, it contains a wide array of sewing essentials, including needles, threads, buttons, pins, scissors, and various other accessories. Whether I'm mending a tear, hemming a garment, or undertaking a more intricate sewing project, I can trust that this kit has me covered with the right tools at my fingertips.\n\nThe quality of the materials included in the kit is also commendable. The needles are sturdy and sharp, ensuring smooth and precise stitching, while the threads are durable and come in a variety of colors to match any fabric. Additionally, the buttons and pins are of good quality, with no flimsy or easily breakable components.\n\nOrganization is another strong suit of the Coquimbo Sewing Kit. The case features multiple compartments and elastic holders that keep each item securely in place, preventing them from jostling around and becoming tangled or lost. This thoughtful design not only makes it easy to locate the desired item quickly but also ensures that the kit remains compact and portable for on-the-go sewing needs.\n\nI also appreciate the inclusion of a pair of small scissors in the kit. While they may not be suitable for heavy-duty cutting tasks, they are perfect for trimming threads and making small, precise cuts during sewing projects. Their compact size makes them convenient to carry, eliminating the need to search for scissors separately.\n\nAnother noteworthy feature of this sewing kit is its affordability. Despite its comprehensive contents and durable construction, the Coquimbo Sewing Kit is reasonably priced, making it accessible to sewers of all skill levels and budgets. It represents excellent value for money, especially considering the convenience and peace of mind it offers.\n\nIn conclusion, the Coquimbo Sewing Kit is a must-have for anyone who enjoys sewing, whether as a hobby or a profession. Its compact size, comprehensive contents, quality materials, and affordable price make it a standout choice among sewing kits on the market. Whether you're a beginner learning the basics or a seasoned seamstress tackling advanced projects, this kit is sure to enhance your sewing experience. Highly recommended.\n\nRead more\n20 people found this helpful\nHelpful\nReport\n\tWanda\n5.0 out of 5 stars\n Complete sewing kit\nReviewed in the United States on January 15, 2025\nColor: BlackSize: MVerified Purchase\nI am very impressed with this sewing kit. I expected needles and threads but this kit provides everything needed. It is compact but complete. I recommend for sure!!!\n\nHelpful\nReport\n\tTony Machardt\n5.0 out of 5 stars\n Wonderful set\nReviewed in the United States on January 20, 2025\nColor: BlackSize: LVerified Purchase\nHas a lot of threads,needles,and more. Really worth the price!\n\nHelpful\nReport\n\tEthan\n3.0 out of 5 stars\n Decent, you get what you pay for\nReviewed in the United States on January 18, 2025\nColor: BlackSize: MVerified Purchase\nThe needle dispenser gets stuck, and I broke the needle threader broke after only a few uses (of course the eyes of these cheap needles are really rough, so the threader got stuck, I probably should have tried pinching it to help it get out though?). But it's cheap so it's what you expect.\n\nOne person found this helpful\nHelpful\nReport\n\tBrandy Snader\n5.0 out of 5 stars\n Compact and easy to use\nReviewed in the United States on December 29, 2024\nColor: BlackSize: MVerified Purchase\nThis is very compact to take any where and easy to use when you need it. There are many different colors and thread that will work. It's organized so you can keep it all together.\n\nHelpful\nReport\n\tJanice J\n5.0 out of 5 stars\n Sewing kit\nReviewed in the United States on January 17, 2025\nColor: BlackSize: SVerified Purchase\nThis was a great Christmas gift, had everything included that was needed for travel. Great value.\n\nHelpful\nReport\nSee more reviews\nTop reviews from other countries\nTranslate all reviews to English\n\talianthia\n5.0 out of 5 stars\n Decent little kit\nReviewed in Canada on June 30, 2023\nColor: BlackSize: SVerified Purchase\nExcellent for clothing repairs ; has everything!\n\nReport\n\tDanaska\n5.0 out of 5 stars\n Super pratique\nReviewed in France on December 25, 2024\nColor: BlackSize: SVerified Purchase\nIl y a tout le nécessaire dans une toute petite trousse qui ne prend pas de place, quoi demander de mieux ? J’adore\n\nReport\nTranslate review to English\n\tP.K.Chowdhary\n1.0 out of 5 stars\n Scissors were missing\nReviewed in India on September 22, 2024\nColor: BlackSize: MVerified Purchase\nScissors shown in the picture at the time of purchase was not provided\n\nReport\n\tAnge.roma95\n5.0 out of 5 stars\n Comodo per i viaggi\nReviewed in Italy on August 9, 2023\nColor: BlackSize: SVerified Purchase\nOttimo per i viaggi perchè piccolo e comodo da portare con sè, non occupa per niente spazio. Ovviamente non è super fornito, ma le cose essenziali sono presenti.\n\nReport\nTranslate review to English\n\tDave Nice\n5.0 out of 5 stars\n Neat little travelling sewing kit\nReviewed in the United Kingdom on April 18, 2019\nColor: BlackSize: SVerified Purchase\nI like this little kit. It is lightweight and ideal for travelling with its varied and useful contents.\n\nI purchased it for when I travel for work and have the odd mishap, detached shirt button etc.\n\nSome of the items may not be of the highest quality (you can buy needles alone for as much as the entire kit) but the price obviously reflects this.\n\nGood value for money and 5 star based on this. I would reduce to 4 star if I were more concerned about quality but you cannot expect more for the price.\n\nReport\nSee more reviews\n­\n­\n­\n­\n\n\nGift ideas inspired by your shopping historyShow more\nPage 1 of 2\nPage 1 of 2\nPrevious set of slides\nCoquimbo Sewing Kit Gifts for Mom Grandma Women Men Adults Kids Teens Beginner Kids Traveler, Portable Sewing Supplies Accessories Contains Thread, Needles, Scissors, Dorm Room Essentials (Black, M)\n4.5 out of 5 stars\n 55,513\n30K+ bought in past month\n#1 Best Seller  in Sewing Project Kits\n$6.99\n$6.99\nGet it as soon as Friday, Feb 14\n$26.38 shipping\nSewing Kit for Adults,Maxfanay Needle and Thread Kit for Sewing,Professional Sewing Supplies Accessories with Tailor Scissors,43XL Thread,30 Needles,Thread Snips and More for Travel Home Beginners\n4.7 out of 5 stars\n 1,462\n6K+ bought in past month\n$19.99\n$19.99 ($2.86/Item)\nGet it as soon as Wednesday, Feb 12\n$30.15 shipping\nSewing Kit Gifts for Grandma, Mom, Friend, Traveler, Adults, Beginner, Emergency,Sewing Supplies Accessories with Scissors,Sewing Needles Thimble, Thread,Tape Measure etc (Black, S)\n4.6 out of 5 stars\n 2,254\n5K+ bought in past month\nAmazon's\nChoice\n$5.99\n$5.99\nGet it as soon as Wednesday, Feb 12\n$26.15 shipping\nSewing Kit with Case Portable Sewing Supplies for Home Traveler, Adults, Beginner, Emergency, Contains 18 Sewing Thread, Scissors, Needles, Measure etc\n4.7 out of 5 stars\n 271\n400+ bought in past month\n$7.99\n$7.99\nGet it as soon as Wednesday, Feb 12\n$26.75 shipping\nSINGER 01512 Beginner's Sewing Kit, 130 Pieces,\n4.4 out of 5 stars\n 3,155\n200+ bought in past month\n$14.88\n$14.88\n$27.59 shipping\nSINGER Polka Dot Small Sewing Basket with Sewing Kit Accessories\n4.5 out of 5 stars\n 2,259\n$19.95\n$19.95\n$32.36 shipping\nFiskars Sewing Kit with Scissors, Measuring Tape, Pins, Thread and More, 62-Piece Sewing Set with Case, Craft Supplies, Clear\n4.7 out of 5 stars\n 755\n100+ bought in past month\n$10.99\n$10.99\n$26.31 shipping\nMichley Sewing Kits with100 Pieces, 32 Bobbins in, 1.0-inches by 8.0-inches by 9.8-inches, Multi-Color\n4.3 out of 5 stars\n 2,059\n$9.99\n$9.99 ($0.10/Item)\nGet it as soon as Wednesday, Feb 12\n$28.58 shipping\nSINGER 07276 Sewing Basket with Sewing Kit Accessories, Pink & Black,\n4.7 out of 5 stars\n 3,043\n$23.36\n$23.36\nGet it as soon as Wednesday, Feb 12\n$42.27 shipping\nNext set of slides\nBest Sellers in Sewing Products\nPage 1 of 4\nPage 1 of 4\nPrevious set of slides\nGDMINLO Soft Tape Measure Double Scale Body Sewing Flexible Tailor Craft Vinyl Ruler for Weight Loss Medical Body Measurement, Has Centimetre Scale on Reverse Side 60-inch（White）\n4.8 out of 5 stars\n 63,343\n30K+ bought in past month\n#1 Best Seller  in Sewing Tape Measures\n$3.59\n$3.59\nGet it as soon as Wednesday, Feb 12\n$25.20 shipping\nHTVRONT HTV Vinyl Rolls Heat Transfer Vinyl - 12" x 8ft White HTV Vinyl for Shirts, Iron on Vinyl for All Cutting Machine - Easy to Cut & Weed for Heat Vinyl Design (White)\n4.5 out of 5 stars\n 37,851\n4K+ bought in past month\n#1 Best Seller  in Sewing Heat Transfer Film\n$8.99\n$8.99 ($1.12/Foot)\nGet it as soon as Wednesday, Feb 12\n$27.02 shipping\nKlangfeiler® Hemming Tape - 3/4 INCH x 32 Yards - 60GSM Thickness - Extra Strong - Iron-On Hem Tape Adhesive\n4.3 out of 5 stars\n 7,056\n10K+ bought in past month\n#1 Best Seller  in Sewing Fusible & Hem Tape\n$7.99\n$7.99\nGet it as soon as Wednesday, Feb 12\n$25.39 shipping\nJUNING Sewing Kit with Case Portable Sewing Supplies for Home Traveler, Adults, Beginner, Emergency, Kids Contains Thread, Scissors, Needles,Measuring Tape\n4.6 out of 5 stars\n 28,534\n6K+ bought in past month\nAmazon's\nChoice\n15% off\nEnds in 03:40:49\n$6.79\n$6.79\nTypical: $7.99\nGet it as soon as Wednesday, Feb 12\n$26.61 shipping\nOtylzto Premium Plastic Clips, 100 Pcs with Box, Sewing Notions for Sewing Quilting Supplies Crafting Tools, Assorted Colors for Craft\n4.7 out of 5 stars\n 8,396\n10K+ bought in past month\n#1 Best Seller  in Quilting Notions\n$6.89\n$6.89\nGet it as soon as Wednesday, Feb 12\n$26.75 shipping\nanezus Self Healing Sewing Mat, 12inch x 18inch Rotary Cutting Mat Double Sided 5-Ply Craft Cutting Board for Sewing Crafts Hobby Fabric Precision Scrapbooking Project\n4.7 out of 5 stars\n 15,701\n10K+ bought in past month\n#1 Best Seller  in Quilting Cutting Mats\n$8.99\n$8.99\nGet it as soon as Wednesday, Feb 12\n$30.54 shipping\nHuhuhero 340 Pack Safety Pins Assorted, 5 Different Sizes Small and Large Pins, Safety Pin for Clothes Costume Sewing, Nickel Plated Steel Bulk, Arts and Crafts Supplies, Silver\n4.5 out of 5 stars\n 6,981\n10K+ bought in past month\n#1 Best Seller  in Safety Pins\n5 offers from $5.99\nZEFFFKA Denim Iron-on Patches Inside & Outside Strongest Glue 100% Cotton Black and White Repair Decorating Kit 12 Pieces Shades of Blue Size 3" by 4-1/4" (7.5 cm x 10.5 cm)\n4.3 out of 5 stars\n 31,307\n9K+ bought in past month\n#1 Best Seller  in Iron-on Transfers\n$7.99\n$7.99 ($0.67/Count)\nGet it as soon as Wednesday, Feb 12\n$25.19 shipping\n9Pcs Tshirt-Ruler Guide to Center Vinyl, Transparent V-Neck/Round PVC Ruler for Alignment, Heat Press, Children Youth Adult, Front and Back Measurement (10in)\n4.6 out of 5 stars\n 7,779\n9K+ bought in past month\n#1 Best Seller  in Sewing Rulers\n26% off\nEnds in 03:40:50\n$5.94\n$5.94\nTypical: $7.99\nGet it as soon as Thursday, Feb 13\n$26.31 shipping\nNext set of slides\nSee personalized recommendations\nSign in\nNew customer? Start here.\n\n\nBack to top\nGet to Know Us\nCareers\nBlog\nAbout Amazon\nInvestor Relations\nAmazon Devices\nAmazon Science\n\t\t\nMake Money with Us\nSell products on Amazon\nSell on Amazon Business\nSell apps on Amazon\nBecome an Affiliate\nAdvertise Your Products\nSelf-Publish with Us\nHost an Amazon Hub\n›See More Make Money with Us\n\t\t\nAmazon Payment Products\nAmazon Business Card\nShop with Points\nReload Your Balance\nAmazon Currency Converter\n\t\t\nLet Us Help You\nAmazon and COVID-19\nYour Account\nYour Orders\nShipping Rates & Policies\nReturns & Replacements\nManage Your Content and Devices\nHelp\n \nEnglish $USD - U.S. Dollar United States\nAmazon Music\nStream millions\nof songs\nAmazon Ads\nReach customers\nwherever they\nspend their time\n6pm\nScore deals\non fashion brands\nAbeBooks\nBooks, art\n& collectibles\nACX\nAudiobook Publishing\nMade Easy\nSell on Amazon\nStart a Selling Account\nVeeqo\nShipping Software\nInventory Management\nAmazon Business\nEverything For\nYour Business\nAmazonGlobal\nShip Orders\nInternationally\nAmazon Web Services\nScalable Cloud\nComputing Services\nAudible\nListen to Books & Original\nAudio Performances\nBox Office Mojo\nFind Movie\nBox Office Data\nGoodreads\nBook reviews\n& recommendations\nIMDb\nMovies, TV\n& Celebrities\nIMDbPro\nGet Info Entertainment\nProfessionals Need\nKindle Direct Publishing\nIndie Digital & Print Publishing\nMade Easy\nPrime Video Direct\nVideo Distribution\nMade Easy\nShopbop\nDesigner\nFashion Brands\nWoot!\nDeals and\nShenanigans\nZappos\nShoes &\nClothing\nRing\nSmart Home\nSecurity Systems\n \neero WiFi\nStream 4K Video\nin Every Room\nBlink\nSmart Security\nfor Every Home\nNeighbors App\nReal-Time Crime\n& Safety Alerts\nAmazon Subscription Boxes\nTop subscription boxes – right to your door\nPillPack\nPharmacy Simplified\n \nConditions of Use\nPrivacy Notice\nConsumer Health Data Privacy Disclosure\nYour Ads Privacy Choices\n© 1996-2025, Amazon.com, Inc. or its affiliates`;

// const SAMPLE_INPUT = purifiedText.replace(/\s+/g, " ").trim();

const SAMPLE_OBSERVATION = {
  product: {
    name: "Coquimbo Sewing Kit Gifts for Mom Grandma Women Men Adults Kids Teens Beginner Kids Traveler, Portable Sewing Supplies Accessories Contains Thread, Needles, Scissors, Dorm Room Essentials (Black, M)",
    brand: "Coquimbo",
    category: "Sewing Project Kits",
    asin: "B0BXKB7QF6",
    description:
      "This sewing kit includes all the necessary tools for basic sewing - thread, needles, scissors, buttons, thimbles, measuring tape, threader, seam ripper, safety pins, and other sewing accessories.",
    features: [
      "Compact and portable",
      "Includes essential sewing tools",
      "Suitable for beginners and professionals",
      "Ideal for travel, home, or dorm room use",
      "Elastic bands secure accessories in a zippered case",
    ],
    specifications: {
      dimensions: "5.63 x 4.53 x 1.34 inches",
      weight: "5 ounces",
      material: "Oxford cloth",
      included_components: [
        "1 measuring tape",
        "1 scissors",
        "18 color spools of thread",
        "30 quality needles",
        "1 metal thimble",
      ],
    },
  },
  pricing: {
    current_price: 6.99,
    original_price: 9.99,
    discount: "30%",
    currency: "USD",
    shipping_cost: 174.88,
    shipping_destination: "Bangladesh",
    availability: "In Stock",
  },
  seller: {
    sold_by: "PerPing",
    ships_from: "Amazon",
    return_policy: "30-day refund/replacement",
  },
  variants: {
    color: "Black",
    sizes: ["S", "M", "L"],
  },
  customer_reviews: {
    average_rating: 4.5,
    total_reviews: 55513,
    best_sellers_rank: {
      category: "Arts, Crafts & Sewing",
      rank: 6,
    },
    top_reviews: [
      {
        author: "Keegan",
        rating: 5,
        date: "January 11, 2025",
        review: "Compact, Well-Organized, and Perfect for Any Sewing Need.",
        verified_purchase: true,
      },
      {
        author: "Nexialist02",
        rating: 5,
        date: "February 22, 2023",
        review:
          "As Expected for the Price - good for traveling and small fixes.",
        verified_purchase: true,
      },
      {
        author: "Ethan",
        rating: 3,
        date: "January 18, 2025",
        review:
          "Decent, you get what you pay for. The needle dispenser gets stuck.",
        verified_purchase: true,
      },
    ],
  },
  related_products: [
    {
      name: "JUNING Sewing Kit with Case",
      price: 13.49,
      discount: "10%",
      rating: 4.6,
      total_reviews: 28534,
    },
    {
      name: "Vellostar Sewing Kit for Adults",
      price: 17.97,
      discount: "15%",
      rating: 4.5,
      total_reviews: 21707,
    },
    {
      name: "OKOMER Sewing Kit",
      price: 5.99,
      discount: "6%",
      rating: 4.5,
      total_reviews: 4520,
    },
  ],
  questions_and_answers: [
    {
      question: "Is this sewing kit good for beginners?",
      answer: "Yes, it's designed for beginners and professionals alike.",
    },
    {
      question: "Does it include a thimble?",
      answer: "Yes, it includes a metal thimble.",
    },
  ],
};

const SYSTEM_PROMPT = `
  You are an AI Assistant with START, PLAN, ACTION, OBSERVATION, and OUTPUT states. 
  
  1. **START**: Receive a large raw text dataset for processing.
  2. **PLAN**: Identify the best way to extract structured product details from the raw text. I will follow the SAMPLE_OBSERVATION format strictly.
  3. **ACTION**: Execute the function (e.g., 'saveProductDetails') to save the data to the database.
  4. **OBSERVATION**: Receive structured data and verify completeness, following the SAMPLE_OBSERVATION format.
  5. **OUTPUT**: Return a response based on the START prompt and observations.

  ### **Rules & Guidelines:**
  - Always **plan before taking action**.
  - Choose the **most relevant function dynamically** (e.g., 'saveProductDetails' for saving the product). Follow the SAMPLE_OBSERVATION format strictly.
  - Strictly rely on 'OBSERVATION'; **never assume missing data**.
  - Handle errors gracefully and notify the user if data is incomplete.
  - Provide structured **JSON responses** for seamless DB storage.

  ---
  ### **AVAILABLE TOOLS:**
  - function saveProductDetails: (data: typeof SAMPLE_OBSERVATION) => {message:string, status?:number, product?:any}
  saveProductDetails is a function that recieve an object and save it to database and returns an object.
  - SAMPLE_INPUT 
  - SAMPLE_OBSERVATION

  ### **EXAMPLE EXECUTION:**
  
  #### **START**
  \`\`\`json
  {"type":"user","user":"Hey, extract product details from this raw text."}
  \`\`\`
  
  #### **PLAN**
  \`\`\`json
  {"type":"plan","plan":"I will extract structured product details from the raw text and follow the SAMPLE_OBSERVATION format strictly."}
  \`\`\`
  
  #### **ACTION**
  \`\`\`json
  {"type":"action", "function":"saveProductDetails", "input": ${SAMPLE_INPUT}}
  \`\`\`
  
  #### **OBSERVATION**
  \`\`\`json
  {"type":"observation", "observation": {"status": 201, "message": "Data saved in DB successfully.", "product": ${SAMPLE_OBSERVATION}} }
  \`\`\`
  
  #### **OUTPUT**
  \`\`\`json
  {
    "type": "output",
    "message": "Here are the extracted product details...",
    "product_details": ${SAMPLE_OBSERVATION}
  }
  \`\`\`
  
  ---
  
  ### **Error Handling**
  - If **product details are missing**, notify the user:
    \`\`\`json
    {"type": "output", "message": "Some details were missing. Available data: {...}"}
    \`\`\`
  - If **no product data** is found, return:
    \`\`\`json
    {"type": "output", "message": "No valid product details found in the provided text."}
    \`\`\`
  - If **database error** occurs:
    \`\`\`json
    {"type": "output", "message": "Database error occurred. Please try again later."}
    \`\`\`
  
  ---
  
  Follow this structured execution process for every request.
`;

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "developer",
          content:
            '{"type": "plan", "plan": "Extract key product attributes including title, price, brand, category, specifications, description, ratings, images, availability, and shipping details. Follow the SAMPLE_OBSERVATION format strictly."}',
        },
        {
          role: "developer",
          content: `"type":"action","function": "saveProductDetails","input":'{
    "title": "Coquimbo Sewing Kit Gifts for Mom Grandma Women Men Adults Kids Teens Beginner Kids Traveler, Portable Sewing Supplies Accessories Contains Thread, Needles, Scissors, Dorm Room Essentials (Black, M)",
    "price": "$6.99",
    "listPrice": "$9.99",
    "savings": "30%",
    "brand": "Coquimbo",
    "category": ["Arts, Crafts & Sewing", "Sewing", "Sewing Project Kits"],
    "specifications": {
      "Product Dimensions": "5.63 x 4.53 x 1.34 inches",
      "Item Model Number": "SK-001",      
      "ASIN": "B0BXKB7QF6",
      "Item Weight": "5 ounces",
      "Manufacturer": "Coquimbo",
      "Date First Available": "April 1, 2023"
    },
    "description": "Includes thread, needles, scissors, buttons, thimbles, measuring tape, and accessories in a portable zippered case. Designed for travel/emergency repairs.",
    "ratings": {
      "stars": "4.5/5",
      "count": "55,513 ratings",
      "bestSellerRank": "#1 in Sewing Project Kits"
    },
    "images": ["Roll-over zoom image", "7 product videos"],
    "includedComponents": [
      "1 measuring tape",
      "1 scissors",  
      "18 color spools of thread",
      "30 quality needles",
      "1 metal thimble"
    ],
    "availability": "In Stock | Delivery Feb 14-19 to Bangladesh",
    "shipping": "$174.88 Shipping & Import Fees Deposit to Bangladesh"
  }'`,
        },
        {
          role: "developer",
          content: `
  "type": "observation",
  "observation": {
    "status": 201,
    "message": "Product data saved successfully",
    "product": "[object Object]"
  }`,
        },
        {
          role: "user",
          content: `Extract the product details from ${SAMPLE_INPUT}`,
        },
      ],
    });

    console.log("Extracted product details:", completion.choices[0].message);
  } catch (e) {
    console.log(e);
  }
}
main();
