<?php
/**
 * update_egypt.php — Database Update Script for Egypt Transition
 * Updates product prices and site settings (shipping zones, payments) in MySQL.
 */
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // 1. Update Product Prices
    $products = [
        [
            'id' => 1,
            'price' => 950.00,
            'name' => 'الباقة الثلاثية (Trio) - تيشيرت العروس + 2 وصيفات',
            'nameEn' => 'The Trio - 1 Bride + 2 Bridesmaid Tees',
            'desc' => 'الباقة الأساسية للعروس وصديقاتها المقربات. تشمل تيشيرت العروس الكريمي بالإضافة إلى تيشيرتين لوصيفات العروس.',
            'descEn' => 'The essential set for the bride and her closest girls. Includes 1 Bride tee and 2 Bridesmaid tees.'
        ],
        [
            'id' => 2,
            'price' => 1450.00,
            'name' => 'باقة الشلة (Squad) - تيشيرت العروس + 4 وصيفات',
            'nameEn' => 'The Squad - 1 Bride + 4 Bridesmaid Tees',
            'desc' => 'الباقة الأكثر شعبية للمجموعات الكبيرة. تشمل تيشيرت العروس الكريمي بالإضافة إلى 4 تيشيرتات لوصيفات العروس.',
            'descEn' => 'Our most popular set for the whole party. Includes 1 Bride tee and 4 Bridesmaid tees.'
        ],
        [
            'id' => 3,
            'price' => 350.00,
            'name' => 'تيشيرت العروس (The Bride)',
            'nameEn' => 'The Bride Tee',
            'desc' => 'تيشيرت العروس الكريمي الناعم بقصته الفضفاضة الأنيقة والخط الجريء.',
            'descEn' => 'Soft cream Bride tee in a relaxed fit with elegant flirty script.'
        ],
        [
            'id' => 4,
            'price' => 250.00,
            'name' => 'تيشيرت وصيفة العروس (Bridesmaid)',
            'nameEn' => 'Bridesmaid Tee',
            'desc' => 'تيشيرت وصيفة العروس المصمم ليتماشى تماماً مع مظهر العروس في الصور التذكارية.',
            'descEn' => 'Bridesmaid tee designed to match perfectly with the bride for matching photos.'
        ],
        [
            'id' => 5,
            'price' => 250.00,
            'name' => 'تيشيرت والدة العروس (Mother of the Bride)',
            'nameEn' => 'Mother of the Bride Tee',
            'desc' => 'تيشيرت والدة العروس لإكمال صورة العائلة السعيدة في يوم الزفاف والتجهيزات.',
            'descEn' => 'Mother of the Bride tee to complete the family picture during wedding preparations.'
        ],
        [
            'id' => 6,
            'price' => 390.00,
            'name' => 'تيشيرت مخصص بالاسم والتاريخ (Custom)',
            'nameEn' => 'Custom Personalized Tee',
            'desc' => 'تيشيرت مخصص يمكنك طباعة الاسم، اللقب، أو تاريخ الزفاف عليه مباشرة بلمسة شخصية فريدة.',
            'descEn' => 'Personalized custom tee where you can print name, date or wedding details directly.'
        ]
    ];

    $prodStmt = $pdo->prepare("UPDATE products SET price = :price, name = :name, nameEn = :nameEn, `desc` = :desc, descEn = :descEn WHERE id = :id");
    $updatedProducts = 0;
    foreach ($products as $p) {
        $prodStmt->execute([
            'price' => $p['price'],
            'name' => $p['name'],
            'nameEn' => $p['nameEn'],
            'desc' => $p['desc'],
            'descEn' => $p['descEn'],
            'id' => $p['id']
        ]);
        $updatedProducts++;
    }

    // 2. Update Site Content Settings (shippingZones & paymentSettings)
    $shippingZones = [
        ["id" => "cairo_giza", "ar" => "القاهرة والجيزة", "en" => "Cairo & Giza", "fee" => 50.00, "enabled" => true],
        ["id" => "alexandria", "ar" => "الإسكندرية", "en" => "Alexandria", "fee" => 60.00, "enabled" => true],
        ["id" => "delta", "ar" => "الدلتا والقناة", "en" => "Delta & Canal Cities", "fee" => 70.00, "enabled" => true],
        ["id" => "upper_egypt", "ar" => "الصعيد", "en" => "Upper Egypt", "fee" => 85.00, "enabled" => true],
        ["id" => "frontier", "ar" => "المحافظات الحدودية", "en" => "Frontier Governorates", "fee" => 110.00, "enabled" => true]
    ];

    $paymentSettings = [
        "cash" => ["enabled" => true],
        "transfer" => [
            "enabled" => true,
            "bankName" => "CIB Egypt",
            "iban" => "EG123456789012345678901234567"
        ],
        "knet" => ["enabled" => false, "apiKey" => "", "testMode" => true],
        "myfatoorah" => ["enabled" => false, "apiKey" => "", "testMode" => true],
        "tap" => ["enabled" => false, "apiKey" => "", "testMode" => true],
        "stcpay" => ["enabled" => false],
        "zaincash" => ["enabled" => false],
        "benefitpay" => ["enabled" => false],
        "applepay" => ["enabled" => true],
        "instapay" => [
            "enabled" => true,
            "ipa" => "info@instapay",
            "phone" => "01012345678"
        ]
    ];

    $settingsStmt = $pdo->prepare("UPDATE site_content SET shippingZones = :shippingZones, paymentSettings = :paymentSettings WHERE id = 1");
    $settingsStmt->execute([
        'shippingZones' => json_encode($shippingZones, JSON_UNESCAPED_UNICODE),
        'paymentSettings' => json_encode($paymentSettings, JSON_UNESCAPED_UNICODE)
    ]);

    // Also update data.json (the server's local file fallback) if it exists
    $dataFile = __DIR__ . '/data.json';
    if (file_exists($dataFile)) {
        $data = json_decode(file_get_contents($dataFile), true);
        if ($data) {
            // Update products in data.json
            foreach ($data['products'] as &$dp) {
                foreach ($products as $p) {
                    if ($dp['id'] === $p['id']) {
                        $dp['price'] = $p['price'];
                        $dp['name'] = $p['name'];
                        $dp['nameEn'] = $p['nameEn'];
                        $dp['desc'] = $p['desc'];
                        $dp['descEn'] = $p['descEn'];
                    }
                }
            }
            // Update siteContent
            if (isset($data['siteContent'][0])) {
                $data['siteContent'][0]['shippingZones'] = $shippingZones;
                $data['siteContent'][0]['paymentSettings'] = $paymentSettings;
            }
            file_put_contents($dataFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => "Database successfully updated for Egypt migration. Updated {$updatedProducts} products and settings."
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
