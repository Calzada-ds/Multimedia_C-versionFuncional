<?php
require_once '../config/dataBD.php';
header('Content-Type: application/json');

// Validar POST
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['student_id'], $data['tipo'], $data['file_name'], $data['file_path'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$studentID = intval($data['student_id']);
$tipo = $data['tipo'];
$fileName = $data['file_name'];
$filePath = $data['file_path'];
$statusID = 1; // Estado "En revisión"

$sqlInsert = "INSERT INTO Submissions (SB_SID, SB_Type, SB_FileName, SB_FilePath, SB_StatusID)
              VALUES (?, ?, ?, ?, ?)";
$paramsInsert = [$studentID, $tipo, $fileName, $filePath, $statusID];

$stmtInsert = sqlsrv_query($conn, $sqlInsert, $paramsInsert);

if ($stmtInsert) {
    // Registro exitoso en Submissions, ahora insertamos en ActivityLog
    $accion = "Inicio de trámite";
    $detalle = "El estudiante inició el trámite de tipo '$tipo' con el archivo '$fileName'";
    $sqlLog = "INSERT INTO ActivityLog (AL_SID, AL_Action, AL_Detail) VALUES (?, ?, ?)";
    $paramsLog = [$studentID, $accion, $detalle];

    $stmtLog = sqlsrv_query($conn, $sqlLog, $paramsLog);

    if ($stmtLog) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar en ActivityLog"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error al guardar el trámite"]);
}
