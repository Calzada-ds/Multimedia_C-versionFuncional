<?php
$serverName = "localhost";
$connectionOptions = array(
    "Database" => "portalTramitesUPPC",
    "Uid" => "",      // Aquí va tu usuario SQL Server
    "PWD" => "",      // Aquí va tu contraseña SQL Server
    "TrustServerCertificate" => true
);

$conn = sqlsrv_connect($serverName, $connectionOptions);

if (!$conn) {
    // Aquí puedes hacer log en /php/logs si quieres
    die(json_encode(["error" => sqlsrv_errors()]));
}
