<?php
require_once __DIR__ . '/vendor/autoload.php';

$data = file_get_contents("php://input");

header('Content-Type: application/x-amf');

try {
    $deserialized = amf_decode($data);

    http_response_code(200);
    echo amf_encode($deserialized, AMF_CLASS_MAPPING);

} catch(Exception $e) {
    http_response_code(500);

    var_dump($e); die();
    die('Invalid AMF packet');
}

class XXX {

}

class YYY {

}