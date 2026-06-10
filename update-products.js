const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'jawhara', 'db.json');
const dataPath = path.join(__dirname, 'jawhara', 'public', 'api', 'data.json');

const rules = [
  {
    nameEn: "Kitchen Roll 23m",
    nameAr: "رول مطبخ 23 متر",
    numbers: ["1", "2", "3", "25"]
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

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!content.products) {
    console.log(`No products field in ${filePath}`);
    return;
  }
  
  content.products = content.products.map(p => {
    if (!p.image) return p;
    const imgName = path.basename(p.image, path.extname(p.image));
    const rule = rules.find(r => r.numbers.some(num => num.toLowerCase() === imgName.toLowerCase()));
    
    if (rule) {
      p.name = `${rule.nameAr} - موديل ${imgName}`;
      p.nameEn = `${rule.nameEn} - Model ${imgName}`;
      p.status = 'active';
    } else {
      p.status = 'inactive';
      console.log(`Disabled unmatched product: id=${p.id}, image=${p.image}`);
    }
    return p;
  });
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

updateFile(dbPath);
updateFile(dataPath);
