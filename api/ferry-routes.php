<?php

header("Content-Type: application/json");

$file = "ferry-routes.json";

$data = json_decode(file_get_contents($file), true);

$method = $_SERVER["REQUEST_METHOD"];

switch ($method) {

    case "GET":
        echo json_encode($data);
        break;

    case "POST":

        $newRoute = json_decode(file_get_contents("php://input"), true);

        $newRoute["id"] = count($data) + 1;

        $data[] = $newRoute;

        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

        echo json_encode([
            "message" => "Route added successfully.",
            "data" => $newRoute
        ]);

        break;

    default:

        http_response_code(405);

        echo json_encode([
            "message" => "Method not supported."
        ]);

}
?>