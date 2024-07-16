<?php

namespace Server;

class Logger {
    private static $file = "default.log";

    public static function setFile($file) {
        Logger::$file = $file;
    }

    public static function debug($message) {
        Logger::log($message, "DEBUG");
    }

    public static function info($message) {
        Logger::log($message, "INFO");
    }

    public static function warning($message) {
        Logger::log($message, "WARNING");
    }

    public static function error($message) {
        Logger::log($message, "ERROR");
    }

    private static function log($message, $level) {
        $message = date("d/m/Y H:i:s") . " [$level] - $message" . PHP_EOL;
        $file = "../logs/" . Logger::$file;
        file_put_contents($file, $message, FILE_APPEND);
    }
}
