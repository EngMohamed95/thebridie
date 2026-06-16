<?php
/**
 * send-email.php — إرسال إيميل تأكيد الطلب للعميل عن طريق Gmail SMTP
 * يدعم العربية والإنجليزية حسب اللغة المرسلة
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

// ── تحميل الإعدادات ───────────────────────────────────────
$configFile = __DIR__ . '/email-config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Email config missing']);
    exit;
}
require_once $configFile;

// ── SMTP Sender ───────────────────────────────────────────
function sendSmtp($toEmail, $toName, $subject, $htmlBody) {
    $sock = fsockopen(SMTP_HOST, SMTP_PORT, $errno, $errstr, 15);
    if (!$sock) throw new Exception("Cannot connect to SMTP: $errstr ($errno)");

    $read = function() use ($sock) {
        $out = '';
        while ($line = fgets($sock, 1024)) {
            $out .= $line;
            if ($line[3] === ' ') break;
        }
        return $out;
    };

    $cmd = function($line) use ($sock, $read) {
        fwrite($sock, $line . "\r\n");
        return $read();
    };

    $read();
    $cmd('EHLO smtp.gmail.com');
    $r = $cmd('STARTTLS');
    if (strpos($r, '220') === false) throw new Exception("STARTTLS failed: $r");

    stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

    $cmd('EHLO smtp.gmail.com');
    $cmd('AUTH LOGIN');
    $cmd(base64_encode(SMTP_USER));
    $r = $cmd(base64_encode(SMTP_PASS));
    if (strpos($r, '235') === false) throw new Exception("Auth failed: $r");

    $cmd('MAIL FROM:<' . SMTP_FROM . '>');
    $r = $cmd('RCPT TO:<' . $toEmail . '>');
    if (strpos($r, '250') === false) throw new Exception("RCPT failed: $r");

    $cmd('DATA');

    $encodedFrom = '=?UTF-8?B?' . base64_encode(SMTP_FROM_NAME) . '?=';
    $encodedTo   = '=?UTF-8?B?' . base64_encode($toName) . '?=';

    $msg  = "From: {$encodedFrom} <" . SMTP_FROM . ">\r\n";
    $msg .= "To: {$encodedTo} <{$toEmail}>\r\n";
    $msg .= "Subject: {$subject}\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
    $msg .= "\r\n";
    $msg .= $htmlBody;
    $msg .= "\r\n.";

    $r = $cmd($msg);
    if (strpos($r, '250') === false) throw new Exception("DATA failed: $r");

    $cmd('QUIT');
    fclose($sock);
    return true;
}

// ── قراءة بيانات الطلب ───────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);
if (!$body || empty($body['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing email']);
    exit;
}

$lang        = ($body['lang'] ?? 'ar') === 'en' ? 'en' : 'ar';
$isAr        = $lang === 'ar';
$dir         = $isAr ? 'rtl' : 'ltr';

$toEmail     = filter_var($body['email'],        FILTER_SANITIZE_EMAIL);
$toName      = htmlspecialchars($body['client']      ?? '', ENT_QUOTES, 'UTF-8');
$orderRef    = htmlspecialchars($body['ref']         ?? '', ENT_QUOTES, 'UTF-8');
$orderDate   = htmlspecialchars($body['date']        ?? '', ENT_QUOTES, 'UTF-8');
$phone       = htmlspecialchars($body['phone']       ?? '', ENT_QUOTES, 'UTF-8');
$address     = htmlspecialchars($body['address']     ?? '', ENT_QUOTES, 'UTF-8');
$governorate = htmlspecialchars($body['governorate'] ?? '', ENT_QUOTES, 'UTF-8');
$block       = htmlspecialchars($body['block']       ?? '', ENT_QUOTES, 'UTF-8');
$notes       = htmlspecialchars($body['notes']       ?? '', ENT_QUOTES, 'UTF-8');
$payment     = $body['payment'] ?? 'cash';
$deliveryFee = number_format((float)($body['deliveryFee'] ?? 0), 2);
$grandTotal  = number_format((float)($body['grandTotal']  ?? $body['total'] ?? 0), 2);
$subtotal    = number_format((float)($body['total']       ?? 0), 2);
$items       = $body['items'] ?? [];
$currency    = $isAr ? 'ج.م' : 'EGP';

// ── النصوص حسب اللغة ────────────────────────────────────
$t = $isAr ? [
    'subject'      => "تأكيد طلبك {$orderRef} — ذا برايدي",
    'welcome'      => "مرحباً {$toName}!",
    'msg'          => 'شكراً لثقتك بذا برايدي. تم استلام طلبك بنجاح وسيتم التواصل معك قريباً لتأكيد موعد التوصيل.',
    'orderRef'     => 'رقم الطلب',
    'orderDate'    => 'تاريخ الطلب',
    'paymentMethod'=> 'طريقة الدفع',
    'phoneLabel'   => 'الهاتف',
    'addressLabel' => 'عنوان التوصيل',
    'orderDetails' => 'تفاصيل الطلب',
    'product'      => 'المنتج',
    'qty'          => 'الكمية',
    'price'        => 'السعر',
    'subtotal'     => 'المجموع الفرعي',
    'delivery'     => 'رسوم التوصيل',
    'total'        => 'الإجمالي',
    'notes'        => 'ملاحظات',
    'footer'       => 'ذا برايدي — تيشيرتات وهدايا مخصصة للعروس ووصيفاتها',
    'contact'      => 'للاستفسار',
    'block'        => "قطعة {$block}",
    'payments'     => [
        'cash'       => 'الدفع عند الاستلام (كاش)',
        'transfer'   => 'تحويل بنكي',
        'knet'       => 'KNET',
        'myfatoorah' => 'MyFatoorah',
        'tap'        => 'Tap',
        'benefitpay' => 'Benefit Pay',
        'applepay'   => 'أبل باي',
        'instapay'   => 'إنستاباي',
    ],
] : [
    'subject'      => "Order Confirmation {$orderRef} — The Bridie",
    'welcome'      => "Hello {$toName}!",
    'msg'          => 'Thank you for shopping with The Bridie. Your order has been received and we will contact you shortly to confirm delivery.',
    'orderRef'     => 'Order Number',
    'orderDate'    => 'Order Date',
    'paymentMethod'=> 'Payment Method',
    'phoneLabel'   => 'Phone',
    'addressLabel' => 'Delivery Address',
    'orderDetails' => 'Order Details',
    'product'      => 'Product',
    'qty'          => 'Qty',
    'price'        => 'Price',
    'subtotal'     => 'Subtotal',
    'delivery'     => 'Delivery Fee',
    'total'        => 'Total',
    'notes'        => 'Notes',
    'footer'       => 'The Bridie — Custom Bride & Bridesmaid Tees',
    'contact'      => 'Contact us',
    'block'        => "Block {$block}",
    'payments'     => [
        'cash'       => 'Cash on Delivery',
        'transfer'   => 'Bank Transfer',
        'knet'       => 'KNET',
        'myfatoorah' => 'MyFatoorah',
        'tap'        => 'Tap',
        'benefitpay' => 'Benefit Pay',
        'applepay'   => 'Apple Pay',
        'instapay'   => 'InstaPay',
    ],
];

$paymentLabel = $t['payments'][$payment] ?? $payment;
$blockStr     = $block ? $t['block'] : '';
$fullAddress  = trim(implode($isAr ? '، ' : ', ', array_filter([$governorate, $blockStr, $address])));

// ── جدول المنتجات ────────────────────────────────────────
$itemsRows = '';
foreach ($items as $item) {
    $name      = htmlspecialchars($item['name'] ?? ($item['nameEn'] ?? ''), ENT_QUOTES, 'UTF-8');
    // لو إنجليزي وفيه nameEn استخدمه
    if (!$isAr && !empty($item['nameEn'])) {
        $name = htmlspecialchars($item['nameEn'], ENT_QUOTES, 'UTF-8');
    }
    $qty       = (int)($item['qty'] ?? 1);
    $price     = (float)($item['price'] ?? 0);
    $lineTotal = number_format($price * $qty, 2);
    $itemsRows .= "
    <tr>
      <td style='padding:10px 14px;border-bottom:1px solid #f0f0f0;color:#374151;'>{$name}</td>
      <td style='padding:10px 14px;border-bottom:1px solid #f0f0f0;text-align:center;color:#6b7280;'>{$qty}</td>
      <td style='padding:10px 14px;border-bottom:1px solid #f0f0f0;text-align:left;color:#374151;font-weight:600;'>{$lineTotal} {$currency}</td>
    </tr>";
}

// ── قسم الملاحظات ────────────────────────────────────────
$notesBlock = $notes ? "
<tr>
  <td style='padding:0 40px 24px;'>
    <div style='background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 18px;'>
      <span style='color:#92400e;font-size:13px;font-weight:600;'>{$t['notes']}: </span>
      <span style='color:#78350f;font-size:13px;'>{$notes}</span>
    </div>
  </td>
</tr>" : '';

// ── قالب الإيميل ─────────────────────────────────────────
$html = <<<HTML
<!DOCTYPE html>
<html dir="{$dir}" lang="{$lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fdeaf0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:{$dir};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#fdeaf0;padding:30px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(216,92,124,0.12);border:1px solid #f6d2de;">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#e87b98,#d85c7c);padding:40px;text-align:center;">
    <div style="display:inline-block;background:#ffffff;border-radius:16px;padding:14px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
      <img src="https://thebridie.com/logos/logo2.png?v=2" alt="The Bridie" style="height:60px;max-width:180px;display:block;object-fit:contain;" />
    </div>
  </td></tr>

  <!-- Welcome -->
  <tr><td style="padding:36px 40px 24px;">
    <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:22px;font-family:'Cormorant Garamond',serif;font-weight:700;">{$t['welcome']}</h2>
    <p style="margin:0;color:#444444;font-size:15px;line-height:1.7;">{$t['msg']}</p>
  </td></tr>

  <!-- Order Info -->
  <tr><td style="padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdeaf0;border-radius:12px;border:1px solid #f6d2de;">
      <tr><td style="padding:16px 20px;border-bottom:1px solid #f6d2de;">
        <span style="color:#444444;font-size:13px;font-weight:500;">{$t['orderRef']}</span>
        <span style="float:left;color:#d85c7c;font-weight:700;font-size:15px;font-family:monospace;">{$orderRef}</span>
      </td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #f6d2de;">
        <span style="color:#444444;font-size:13px;font-weight:500;">{$t['orderDate']}</span>
        <span style="float:left;color:#1a1a1a;font-size:14px;">{$orderDate}</span>
      </td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #f6d2de;">
        <span style="color:#444444;font-size:13px;font-weight:500;">{$t['paymentMethod']}</span>
        <span style="float:left;color:#1a1a1a;font-size:14px;">{$paymentLabel}</span>
      </td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #f6d2de;">
        <span style="color:#444444;font-size:13px;font-weight:500;">{$t['phoneLabel']}</span>
        <span style="float:left;color:#1a1a1a;font-size:14px;">{$phone}</span>
      </td></tr>
      <tr><td style="padding:16px 20px;">
        <span style="color:#444444;font-size:13px;font-weight:500;">{$t['addressLabel']}</span>
        <span style="float:left;color:#1a1a1a;font-size:14px;text-align:left;">{$fullAddress}</span>
      </td></tr>
    </table>
  </td></tr>

  <!-- Items -->
  <tr><td style="padding:0 40px 24px;">
    <h3 style="margin:0 0 12px;color:#1a1a1a;font-size:16px;font-family:'Cormorant Garamond',serif;font-weight:700;">{$t['orderDetails']}</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #f6d2de;">
      <thead><tr style="background:#fdeaf0;">
        <th style="padding:12px 14px;text-align:right;color:#d85c7c;font-size:13px;font-weight:700;">{$t['product']}</th>
        <th style="padding:12px 14px;text-align:center;color:#d85c7c;font-size:13px;font-weight:700;">{$t['qty']}</th>
        <th style="padding:12px 14px;text-align:left;color:#d85c7c;font-size:13px;font-weight:700;">{$t['price']}</th>
      </tr></thead>
      <tbody>{$itemsRows}</tbody>
    </table>
  </td></tr>

  <!-- Totals -->
  <tr><td style="padding:0 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff7f9;padding:16px;border-radius:12px;border:1px solid #f6d2de;">
      <tr>
        <td style="padding:6px 0;color:#444444;font-size:14px;">{$t['subtotal']}</td>
        <td style="padding:6px 0;text-align:left;color:#1a1a1a;font-size:14px;font-weight:600;">{$subtotal} {$currency}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#444444;font-size:14px;">{$t['delivery']}</td>
        <td style="padding:6px 0;text-align:left;color:#1a1a1a;font-size:14px;font-weight:600;">{$deliveryFee} {$currency}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;border-top:1.5px solid #f6d2de;color:#1a1a1a;font-size:16px;font-weight:700;">{$t['total']}</td>
        <td style="padding:12px 0 0;border-top:1.5px solid #f6d2de;text-align:left;color:#d85c7c;font-size:20px;font-weight:800;">{$grandTotal} {$currency}</td>
      </tr>
    </table>
  </td></tr>

  <!-- Action Tracking Button -->
  <tr><td style="padding:0 40px 32px;text-align:center;">
    <a href="https://thebridie.com/track?code={$orderRef}" style="display:inline-block;background-color:#d85c7c;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:99px;font-size:14px;font-weight:700;box-shadow:0 6px 18px rgba(216,92,124,0.3);text-transform:uppercase;letter-spacing:0.05em;">
      {$isAr ? 'تتبع مسار طلبك هنا' : 'Track Your Order Here'}
    </a>
  </td></tr>

  {$notesBlock}

  <!-- Footer -->
  <tr><td style="background:#fdeaf0;border-top:1px solid #f6d2de;padding:24px 40px;text-align:center;">
    <p style="margin:0 0 8px;color:#d85c7c;font-size:14px;font-weight:700;">{$t['footer']}</p>
    <p style="margin:0;color:#444444;font-size:13px;">{$t['contact']}: <a href="mailto:info@thebridie.com" style="color:#d85c7c;text-decoration:none;font-weight:600;">info@thebridie.com</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
HTML;

// ── إرسال ─────────────────────────────────────────────────
$subject = '=?UTF-8?B?' . base64_encode($t['subject']) . '?=';

try {
    sendSmtp($toEmail, $toName, $subject, $html);
    echo json_encode(['success' => true, 'message' => 'Email sent']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
