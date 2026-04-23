<?php
// Front Controller

// For PHP built-in server (used in local testing)
// If the requested file is a static asset (like css, js, images), serve it directly.
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    if (in_array($ext, ['css', 'js', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'woff', 'woff2', 'ttf'])) {
        return false; // Let the built-in server handle the static file
    }
}

// Get the requested URL path
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = ''; // Adjust if deploying to a subdirectory, e.g., '/devconnect'
$route = str_replace($basePath, '', $requestUri);

// Define Routes
switch ($route) {
    case '/':
    case '/home':
    case '/index':
        require __DIR__ . '/pages/home.php';
        break;
    case '/auth':
    case '/login':
    case '/register':
        require __DIR__ . '/pages/auth.php';
        break;
    case '/profile':
        require __DIR__ . '/pages/profile.php';
        break;
    case '/groups':
        require __DIR__ . '/pages/groups.php';
        break;
    case '/messages':
        require __DIR__ . '/pages/messages.php';
        break;
    default:
        // 404 Page Not Found
        http_response_code(404);
        require __DIR__ . '/header.php';
        echo '<div class="text-center py-20"><h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">404 - Página não encontrada</h1><p class="mt-4 text-gray-600 dark:text-gray-400">A URL solicitada não existe nesta plataforma.</p><a href="/" class="mt-6 inline-block bg-primary hover:bg-secondary text-white px-6 py-2 rounded-md transition">Voltar ao Início</a></div>';
        require __DIR__ . '/footer.php';
        break;
}
