<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dishId = $_POST['dish_id'];
    $quantity = $_POST['quantity'];
    $userId = 1; // Placeholder for user ID

    try {
        if ($quantity > 0) {
            // Add or increase quantity
            $stmt = $pdo->prepare("
                INSERT INTO cart (user_id, dish_id, quantity, date_added) 
                VALUES (:user_id, :dish_id, :quantity, NOW())
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
            ");
            $stmt->execute(['user_id' => $userId, 'dish_id' => $dishId, 'quantity' => $quantity]);
        } else {
            // Reduce quantity or remove item
            $stmt = $pdo->prepare("UPDATE cart SET quantity = quantity + :quantity WHERE user_id = :user_id AND dish_id = :dish_id");
            $stmt->execute(['user_id' => $userId, 'dish_id' => $dishId, 'quantity' => $quantity]);

            // If quantity reaches zero, delete the item
            $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = :user_id AND dish_id = :dish_id AND quantity <= 0");
            $stmt->execute(['user_id' => $userId, 'dish_id' => $dishId]);
        }
        echo json_encode(['message' => 'Cart updated successfully']);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = 1; // Placeholder for user ID

    try {
        $stmt = $pdo->prepare("SELECT c.quantity, d.dish, c.dish_id FROM cart c JOIN dishes d ON c.dish_id = d.d_id WHERE c.user_id = :user_id");
        $stmt->execute(['user_id' => $userId]);
        $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($cartItems);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
