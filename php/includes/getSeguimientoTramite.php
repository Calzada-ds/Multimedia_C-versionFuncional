<?php
require_once '../config/dataBD.php';
header('Content-Type: application/json');

// Recibir ID del estudiante
$input = json_decode(file_get_contents("php://input"), true);
if (!isset($input["student_id"]) || !isset($input["tipo"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$studentID = intval($input["student_id"]);
$tipo = $input["tipo"];

// Definir pasos por tipo
$pasosTramite = [
    "Servicio Social" => [
        "Registro en SISS",
        "Carta de presentación",
        "Carta de aceptación",
        "Reportes bimestrales",
        "Informe final",
        "Carta de terminación",
        "Consstancia de liberación"
    ],
    "Prácticas Profesionales" => [
        "solicitud de carta de presentación",
        "Solicitud de carta de presentación",
        "Entrevista y selección (sube CV)",
        "Carta de aceptación",
        "Registro oficial",
        "Reportes mensuales",
        "Informe final",
        "Constancia de terminación"
    ],
    "Titulación" => [
        "Registro de opción",
        "Desarrollo del trabajo",
        "Revisión y aprobación",
        "TRamite administrativo",
        "Exmane profesional",
        "Obtención de titulo (felicidades)!"
    ]
];

// Verificar tipo válido
if (!array_key_exists($tipo, $pasosTramite)) {
    echo json_encode(["success" => false, "message" => "Tipo de trámite no válido"]);
    exit;
}

// Obtener los submissions del estudiante
$sql = "
    SELECT 
        S.SB_ID, S.SB_Type, S.SB_FileName, S.SB_FilePath, 
        S.SB_UploadDate, SS.SS_Name AS Estado, 
        C.C_Text AS Comentario
    FROM Submissions S
    LEFT JOIN SubmissionStatus SS ON S.SB_StatusID = SS.SS_ID
    LEFT JOIN Comments C ON S.SB_ID = C.C_SBID
    WHERE S.SB_SID = ? AND S.SB_Type = ?
    ORDER BY S.SB_UploadDate DESC
";

$params = [$studentID, $tipo];
$stmt = sqlsrv_query($conn, $sql, $params);

$archivos = [];

while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $archivos[] = [
        "id" => $row["SB_ID"],
        "archivo" => $row["SB_FileName"],
        "ruta" => $row["SB_FilePath"],
        "fecha" => $row["SB_UploadDate"]->format('Y-m-d H:i'),
        "estado" => $row["Estado"],
        "comentario" => $row["Comentario"]
    ];
}

// Construir la respuesta para el frontend
$respuesta = [];
foreach ($pasosTramite[$tipo] as $paso) {
    $archivoEncontrado = null;
    foreach ($archivos as $a) {
        if (stripos($a["archivo"], $paso) !== false) {
            $archivoEncontrado = $a;
            break;
        }
    }

    $respuesta[] = [
        "paso" => $paso,
        "archivo" => $archivoEncontrado ? $archivoEncontrado["archivo"] : null,
        "fecha" => $archivoEncontrado ? $archivoEncontrado["fecha"] : null,
        "descargar" => $archivoEncontrado ? $archivoEncontrado["ruta"] : null,
        "estado" => $archivoEncontrado ? $archivoEncontrado["estado"] : "Pendiente",
        "comentario" => $archivoEncontrado ? $archivoEncontrado["comentario"] : ""
    ];
}

echo json_encode([
    "success" => true,
    "seguimiento" => $respuesta
]);
