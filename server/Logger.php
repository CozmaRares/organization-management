<?php

namespace Server;

class Logger {
    public static function log($message) {
        $message = date("d/m/Y H:i:s") . " - $message" . PHP_EOL;
        print($message);
        flush();
        ob_flush();
    }
}
