<?php
require_once '../config/dataBD.php';
header('Content-Type: application/json');

// Leer el ID del alumno y tipo desde GET
if (!isset($_GET['student_id']) || !isset($_GET['tipo'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$studentID = intval($_GET['student_id']);
$tipoTramite = trim($_GET['tipo']);

// Estados que cuentan como trámite activo
$estadosActivos = ["En revisión", "Por entregar"];
$placeholders = implode(',', array_fill(0, count($estadosActivos), '?'));

$sql = "
SELECT COUNT(*) AS total
FROM Submissions s
INNER JOIN SubmissionStatus st ON s.SB_StatusID = st.SS_ID
WHERE s.SB_SID = ? AND s.SB_Type = ? AND st.SS_Name IN ($placeholders)
";

$params = array_merge([$studentID, $tipoTramite], $estadosActivos);
$stmt = sqlsrv_query($conn, $sql, $params);

if ($stmt && $row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    echo json_encode([
        "success" => true,
        "hasActiveProcess" => $row['total'] > 0
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Error al consultar trámite"
    ]);
}
