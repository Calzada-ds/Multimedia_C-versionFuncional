<?php
require_once '../config/dataBD.php';
header('Content-Type: application/json');

// Validar campos básicos (POST + archivos)
if (!isset($_POST['student_id'], $_POST['tipo'], $_POST['semestre'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos requeridos."]);
    exit;
}

$studentID = intval($_POST['student_id']);
$tipo = $_POST['tipo'];
$semestre = $_POST['semestre'];
$statusID = 1; // Estado "En revisión"

// Carpeta para guardar archivos
$uploadDir = __DIR__ . '/../../uploads/'; // Ajusta la ruta según ubicación
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Función para generar nombre único
function generarNombreUnico($originalName) {
    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
    $uniqueName = uniqid('doc_', true) . '.' . $ext;
    return $uniqueName;
}

// Variables para nombres y rutas
$archivosGuardados = [];

for ($i = 1; $i <= 3; $i++) {
    $key = 'doc' . $i;
    if (isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK) {
        $originalName = $_FILES[$key]['name'];
        $tmpName = $_FILES[$key]['tmp_name'];
        $uniqueName = generarNombreUnico($originalName);
        $destino = $uploadDir . $uniqueName;

        if (move_uploaded_file($tmpName, $destino)) {
            $archivosGuardados[] = [
                'file_name' => $uniqueName,
                'file_path' => 'uploads/' . $uniqueName  // ruta relativa para frontend/BD
            ];
        } else {
            echo json_encode(["success" => false, "message" => "Error al mover archivo $originalName"]);
            exit;
        }
    }
}

if (count($archivosGuardados) === 0) {
    echo json_encode(["success" => false, "message" => "No se subieron archivos válidos."]);
    exit;
}

// Insertar registros por cada archivo en Submissions y log
foreach ($archivosGuardados as $archivo) {
    $fileName = $archivo['file_name'];
    $filePath = $archivo['file_path'];

    $sqlInsert = "INSERT INTO Submissions (SB_SID, SB_Type, SB_FileName, SB_FilePath, SB_StatusID, SB_Paso)
                  VALUES (?, ?, ?, ?, ?, ?)";
    $paramsInsert = [$studentID, $tipo, $fileName, $filePath, $statusID, 1];
    $stmtInsert = sqlsrv_query($conn, $sqlInsert, $paramsInsert);

    if (!$stmtInsert) {
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
        exit;
    }

    // Insertar registro en ActivityLog
    $accion = "Inicio de trámite";
    $detalle = "El estudiante inició el trámite de tipo '$tipo' con el archivo '$fileName'";
    $sqlLog = "INSERT INTO ActivityLog (AL_SID, AL_Action, AL_Detail) VALUES (?, ?, ?)";
    $paramsLog = [$studentID, $accion, $detalle];
    $stmtLog = sqlsrv_query($conn, $sqlLog, $paramsLog);

    if (!$stmtLog) {
        echo json_encode(["success" => false, "message" => "Error al guardar en ActivityLog para archivo $fileName"]);
        exit;
    }
}

echo json_encode(["success" => true]);
?>
