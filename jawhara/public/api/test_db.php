<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/db.php';

try {
    $chk = $pdo->prepare("SHOW COLUMNS FROM `products` LIKE ?");
    $chk->execute(['name']);
    $res = $chk->fetch();
    echo "Query succeeded!\n";
    print_r($res);
} catch (Exception $e) {
    echo "Query failed: " . $e->getMessage() . "\n";
}
