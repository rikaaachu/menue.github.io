<?php
header('Content-Type: application/json');
include 'db.php';  

$category = isset($_GET['category']) ? $_GET['category'] : null;


try {
    if ($category) {
        error_log("Category passed: " . $category);

        $stmt = $pdo->prepare("SELECT * FROM dishes WHERE category = :category");
        $stmt->execute(['category' => $category]);
    } else {
        $stmt = $pdo->query("SELECT * FROM dishes");
    }

    $menuItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log('Number of items found: ' . count($menuItems));

    if (empty($menuItems)) {
        echo json_encode(['message' => 'No items available in this category.']);
    } else {
        echo json_encode($menuItems);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>