<?php
require_once '../config/dataBD.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit;
}

// Validar datos necesarios
if (!isset($_FILES['archivo']) || !isset($_POST['student_id'], $_POST['tipo'], $_POST['paso'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$archivo = $_FILES['archivo'];
$studentID = intval($_POST['student_id']);
$tipo = $_POST['tipo'];
$paso = $_POST['paso'];

// Validar archivo
if ($archivo['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Error al subir el archivo"]);
    exit;
}

// Generar nombre único para archivo
$extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
$nombreUnico = uniqid("doc_", true) . '.' . $extension;

// Ruta de guardado
$directorio = '../../uploads/';
if (!is_dir($directorio)) {
    mkdir($directorio, 0777, true);
}
$rutaFinal = $directorio . $nombreUnico;

// Mover archivo al servidor
if (!move_uploaded_file($archivo['tmp_name'], $rutaFinal)) {
    echo json_encode(["success" => false, "message" => "No se pudo guardar el archivo"]);
    exit;
}

// Ruta para almacenar en DB (sin ../../)
$rutaDB = 'uploads/' . $nombreUnico;
$estadoID = 1; // "En revisión"

// Insertar en Submissions
$sqlInsert = "INSERT INTO Submissions (SB_SID, SB_Type, SB_FileName, SB_FilePath, SB_StatusID)
              VALUES (?, ?, ?, ?, ?)";
$params = [$studentID, $tipo, $paso, $rutaDB, $estadoID];
$stmt = sqlsrv_query($conn, $sqlInsert, $params);

if ($stmt) {
    // Registrar en ActivityLog
    $accion = "Subida de archivo";
    $detalle = "Archivo '$paso' subido por estudiante en trámite '$tipo'";
    $sqlLog = "INSERT INTO ActivityLog (AL_SID, AL_Action, AL_Detail) VALUES (?, ?, ?)";
    $paramsLog = [$studentID, $accion, $detalle];
    sqlsrv_query($conn, $sqlLog, $paramsLog);

    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar en la base de datos"]);
}
