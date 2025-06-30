<?php
header("Access-Control-Allow-Origin: *"); // Permitir desde cualquier dominio
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos

$apiKey = "609325429182fa1c186ba972d30198f6"; // Coloca aquí tu API_KEY de Convai
$apiUrl = "https://api.convai.com/v1/message"; // Endpoint de Convai para la interacción

// Verifica si el mensaje del usuario está siendo enviado
if (!isset($_POST['message']) || empty($_POST['message'])) {
    error_log("Error: No se recibió el mensaje del usuario.");
    die("Error: No se recibió el mensaje del usuario.");
}

// Obtén la pregunta del usuario enviada desde el frontend
$userMessage = $_POST['message'];
$agentId = "ac53f5b4-ffaf-11ef-af57-42010a7be01a";  // El ID de tu agente virtual que obtuviste desde el dashboard de Convai

// Datos a enviar a la API
$data = array(
    "message" => $userMessage,
    "user_id" => "Daniel Guerrero", // Cambia por el ID único de tu usuario, puede ser generado dinámicamente
    "agent_id" => $agentId // El ID de tu agente para que la solicitud se realice con ese agente específico
);

// Configuración de la solicitud HTTP
$options = array(
    'http' => array(
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n" . 
                     "Authorization: Bearer " . $apiKey . "\r\n", // Autenticación
        'content' => json_encode($data) // El cuerpo de la solicitud en formato JSON
    )
);

// Crear el contexto de la solicitud HTTP
$context  = stream_context_create($options);

// Realiza la solicitud HTTP a Convai
$response = @file_get_contents($apiUrl, false, $context);

// Verifica si hubo un error en la solicitud
if ($response === FALSE) {
    error_log("Error en la solicitud a la API de Convai: " . error_get_last()['message']);
    die("Error en la solicitud a la API de Convai.");
}

// Decodifica la respuesta JSON de la API de Convai
$responseData = json_decode($response, true);

// Verifica si la respuesta tiene el formato esperado
if (isset($responseData['message'])) {
    $aiResponse = $responseData['message']; // Extrae la respuesta generada por la IA
} else {
    error_log("Error: La respuesta de Convai no contiene el campo 'message'. Respuesta: " . print_r($responseData, true));
    die("Error: La respuesta de Convai no contiene el campo 'message'.");
}

// Devuelve la respuesta al frontend
echo $aiResponse;
?>
