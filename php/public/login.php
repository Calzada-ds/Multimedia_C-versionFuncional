<?php
// Activar modo depuración durante desarrollo
ob_clean();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Encabezado JSON
header('Content-Type: application/json');

// Conexión a base de datos
require_once '../config/dataBD.php'; // Asegúrate que la ruta esté correcta

// Leer entrada JSON del cuerpo de la solicitud
$input = json_decode(file_get_contents("php://input"), true);

// Validar datos recibidos
if (!isset($input['email']) || !isset($input['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Faltan datos."
    ]);
    exit;
}

$email = trim($input['email']);
$password = trim($input['password']);

// Consulta SQL
$sql = "SELECT S_ID, S_Name, S_PasswordHash FROM Students WHERE S_Email = ?";
$params = [$email];
$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt && $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    if (password_verify($password, $row['S_PasswordHash'])) {
        // Éxito: contraseña correcta
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => $row['S_ID'],
                "name" => $row['S_Name'],
                "email" => $email
            ]
        ]);
    } else {
        // Contraseña incorrecta
        echo json_encode([
            "success" => false,
            "message" => "Contraseña incorrecta."
        ]);
    }
} else {
    // Usuario no encontrado
    echo json_encode([
        "success" => false,
        "message" => "Usuario no encontrado."
    ]);
}