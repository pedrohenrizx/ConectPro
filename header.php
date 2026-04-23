<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevConnect</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#1e40af',
                    }
                }
            }
        }
    </script>
    <!-- FontAwesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Parse SDK -->
    <script type="text/javascript" src="https://npmcdn.com/parse/dist/parse.min.js"></script>
    <!-- CodeMirror CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/dracula.min.css">
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col transition-colors duration-200">
    <nav class="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-50">
        <div class="container mx-auto flex justify-between items-center">
            <a href="/" class="text-2xl font-bold text-primary flex items-center gap-2">
                <i class="fa-solid fa-code"></i> DevConnect
            </a>

            <div class="flex items-center gap-4">
                <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <i id="theme-icon" class="fa-solid fa-sun text-xl"></i>
                </button>

                <div id="auth-nav-links" class="hidden flex items-center gap-4">
                    <a href="/" class="hover:text-primary transition"><i class="fa-solid fa-house"></i> Início</a>
                    <a href="/groups" class="hover:text-primary transition"><i class="fa-solid fa-users"></i> Grupos</a>
                    <a href="/messages" class="hover:text-primary transition"><i class="fa-solid fa-envelope"></i> Mensagens</a>
                    <a href="/profile" class="hover:text-primary transition"><i class="fa-solid fa-user"></i> Perfil</a>
                    <button id="logout-btn" class="text-red-500 hover:text-red-700 transition"><i class="fa-solid fa-right-from-bracket"></i> Sair</button>
                </div>
                <div id="unauth-nav-links" class="flex items-center gap-4">
                    <a href="/auth" class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md transition">Entrar</a>
                </div>
            </div>
        </div>
    </nav>
    <main class="flex-grow container mx-auto p-4 max-w-4xl">
