<?php
header('Content-Type: application/json'); // Indicamos que la respuesta será JSON
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Importamos la conexión a la base de datos
require_once __DIR__ . '/../config/dataBD.php';

// Leemos el JSON recibido y lo decodificamos a array asociativo
$input = json_decode(file_get_contents("php://input"), true);

// Validamos que todos los campos necesarios estén presentes
if (
    !isset($input['name']) || !isset($input['boleta']) || !isset($input['birth']) ||
    !isset($input['email']) || !isset($input['password'])
) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
    exit;
}

// Limpiamos y asignamos variables
$name = trim($input['name']);
$boleta = trim($input['boleta']);
$birth = intval($input['birth']);
$email = trim($input['email']);
$password = trim($input['password']);

// Validar dominio del correo
if (!str_ends_with($email, "@alumno.ipn.mx")) {
    echo json_encode(["success" => false, "message" => "El correo debe ser institucional."]);
    exit;
}

// Consultamos si ya existe un usuario con ese correo o boleta
$sqlCheck = "SELECT S_ID FROM Students WHERE S_Email = ? OR S_Boleta = ?";
$paramsCheck = [$email, $boleta];
$stmtCheck = sqlsrv_query($conn, $sqlCheck, $paramsCheck);

// Si existe registro, enviamos error
if ($stmtCheck && sqlsrv_fetch($stmtCheck)) {
    echo json_encode(["success" => false, "message" => "Ya existe un usuario con ese correo o boleta."]);
    exit;
}

// Encriptamos la contraseña para guardarla segura
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Insertamos el nuevo usuario en la tabla Students
$sqlInsert = "INSERT INTO Students (S_Name, S_Boleta, S_BirthYear, S_Email, S_PasswordHash)
              VALUES (?, ?, ?, ?, ?)";
$paramsInsert = [$name, $boleta, $birth, $email, $passwordHash];
$stmtInsert = sqlsrv_query($conn, $sqlInsert, $paramsInsert);

// Si la inserción fue exitosa, enviamos éxito, sino error con detalle
if ($stmtInsert) {
    echo json_encode(["success" => true]);
} else {
    $errors = sqlsrv_errors();
    $errorMsg = "";
    if ($errors) {
        foreach ($errors as $error) {
            $errorMsg .= "SQLSTATE: " . $error['SQLSTATE'] . " - Code: " . $error['code'] . " - Message: " . $error['message'] . " ";
        }
    } else {
        $errorMsg = "Error desconocido al insertar en la base de datos.";
    }
    echo json_encode(["success" => false, "message" => $errorMsg]);
}
