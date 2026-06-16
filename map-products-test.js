import fs from 'fs';
import path from 'path';

const dbPath = './thebridie/db.json';
const dataPath = './thebridie/public/api/data.json';

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// User mapping rule:
// • Kitchen Roll 23m— # - 2 - 3 - 25
// • Toilet Roll (25m x 10cm) 25m— 9 - 8 - 24
// • Boutique 150 sheets — 209 - 12 -
// • Cube White  100 sheets— 13 - 14 -
// • Jawhara 150 sheets— 15 - 16 - Dsc 01820
// • Jawhara 200 sheets— 200 - 104 - 99 - 203
// • Hand Towels 100 sheets— 17 - 18
// • Plastic: Nice 600 sheets — 204 - 205
// • Plastic: Jawhara 200 sheets — 208 - 207
// • Maxi Roll Jawhara 350 mtr / 2 ply — 19 - 20
// • Maxi Roll Hyrain 300 mtr / 2 ply — 21 - 22
// • Wet Wipes — 27

const rules = [
  {
    nameEn: "Kitchen Roll 23m",
    nameAr: "رول مطبخ 23 متر",
    numbers: ["1", "2", "3", "25"] // # is 1
  },
  {
    nameEn: "Toilet Roll (25m x 10cm) 25m",
    nameAr: "رول تويلت (25 متر × 10 سم) 25 متر",
    numbers: ["9", "8", "24"]
  },
  {
    nameEn: "Boutique 150 sheets",
    nameAr: "مناديل بوتيك 150 ورقة",
    numbers: ["209", "12"]
  },
  {
    nameEn: "Cube White 100 sheets",
    nameAr: "مناديل مكعب أبيض 100 ورقة",
    numbers: ["13", "14"]
  },
  {
    nameEn: "Jawhara 150 sheets",
    nameAr: "مناديل الجوهرة 150 ورقة",
    numbers: ["15", "16", "DSC01820"]
  },
  {
    nameEn: "Jawhara 200 sheets",
    nameAr: "مناديل الجوهرة 200 ورقة",
    numbers: ["200", "104", "99", "203"]
  },
  {
    nameEn: "Hand Towels 100 sheets",
    nameAr: "مناشف يد 100 ورقة",
    numbers: ["17", "18"]
  },
  {
    nameEn: "Plastic: Nice 600 sheets",
    nameAr: "بلاستيك: نايس 600 ورقة",
    numbers: ["204", "205"]
  },
  {
    nameEn: "Plastic: Jawhara 200 sheets",
    nameAr: "بلاستيك: الجوهرة 200 ورقة",
    numbers: ["208", "207"]
  },
  {
    nameEn: "Maxi Roll Jawhara 350 mtr / 2 ply",
    nameAr: "ماكسي رول الجوهرة 350 متر / 2 طبقة",
    numbers: ["19", "20"]
  },
  {
    nameEn: "Maxi Roll Hyrain 300 mtr / 2 ply",
    nameAr: "ماكسي رول هايرين 300 متر / 2 طبقة",
    numbers: ["21", "22"]
  },
  {
    nameEn: "Wet Wipes",
    nameAr: "مناديل مبللة",
    numbers: ["27"]
  }
];

// Map products:
db.products = db.products.map(p => {
  // Extract number from image path, e.g. "/products-image/1.png" -> "1"
  // or "/products-image/DSC01820.ARW" -> "DSC01820"
  const imgName = path.basename(p.image, path.extname(p.image));
  
  const rule = rules.find(r => r.numbers.some(num => num.toLowerCase() === imgName.toLowerCase()));
  if (rule) {
    // We append a design or index suffix if there are multiple? Or just the same name?
    // Wait, let's keep the name as is, or we can add "- Design X" or similar?
    // The user said: "انا عاوز اسامى المنتجات تمشي على حسب الارقام اللى بعتها دى"
    // Let's set the name and nameEn to the new names.
    // If there are multiple, let's see. For example, Kitchen Roll 23m has 4 designs/models (1, 2, 3, 25).
    // Let's check how the previous ones were: "رول مطبخ الجوهرة - موديل 1", "Al-Jawhara Kitchen Roll - Model 1"
    // We can name them: "رول مطبخ 23 متر - موديل {imgName}" / "Kitchen Roll 23m - Model {imgName}"
    // Or just the exact name + image name suffix so they are distinguishable.
    // Wait! Let's check the current names to see if they had model numbers.
    // Yes: "رول مطبخ الجوهرة - موديل 1", "Al-Jawhara Kitchen Roll - Model 1"
    // So using the exact name and English name with a model suffix is perfect.
    // For example:
    // "Kitchen Roll 23m - Model 2" / "رول مطبخ 23 متر - موديل 2"
    // "Boutique 150 sheets - Model 12" / "مناديل بوتيك 150 ورقة - موديل 12"
    // Let's do that!
    p.name = `${rule.nameAr} - موديل ${imgName}`;
    p.nameEn = `${rule.nameEn} - Model ${imgName}`;
  } else {
    console.log(`No rule for product: id=${p.id}, name=${p.name}, image=${p.image}`);
  }
  return p;
});

console.log(JSON.stringify(db.products.slice(0, 10), null, 2));
