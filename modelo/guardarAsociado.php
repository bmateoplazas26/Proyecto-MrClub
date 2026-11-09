<?php
header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . '/../modelo/asociado.php';

try{

    if($_SERVER['REQUEST_METHOD']!=='POST'){
        http_response_code(405);

        //Saltar a catch y mostrar el mensaje de error
        throw new Exception("Método HTTP no permitido");
    }

    //leer el contenido JSON de la solicitud
    $json = file_get_contents('php://input');

    //decodificar el JSON en un array asociativo de PHP
    $datos = json_decode($json, true);

    if(!is_array($datos) || json_last_error() !== JSON_ERROR_NONE){
        http_response_code(400);
        throw new Exception("Datos JSON inválidos");
    }

    $campos=["documento","nombres","apellidos","fechaNacimiento","genero","direccion","ciudad","telefono","Email","contraseña"];
    foreach ($campos as $campo){
        if(!isset($datos[$campo])){
            http_response_code(400);
            throw new Exception("Falta el campo" . $campo);
        }
    }

    if(!filter_var($datos['Email'], FILTER_VALIDATE_EMAIL)){
        http_response_code(400);
        throw new Exception("Email inválido");
    }

    $asociado = new Asociado($datos);

    $resultado = $asociado->guardar();

    if($resultado){
        http_response_code(201);
        echo json_encode(["success" => true, "mensaje" => "Asociado guardado exitosamente"]);
    }else{
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error al guardar el asociado"]);
    }
    

}catch (PDOException $e){
    if($e->getCode() == 23000){  //Código de error para datos duplicados en MySQL
        http_response_code(409); //Conflicto
        echo json_encode(["success" => false, "mensaje" => "El documento ya esta registrado"]);
    }else{
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error en la base de datos: " . $e->getMessage()]);
    }



  //errores de codigo por ejemplo metodo HTTP,datos invalidos
}catch (Exception $e){
    echo json_encode(["success" => false, "mensaje" => $e->getMessage()]);

}
