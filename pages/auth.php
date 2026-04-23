<?php include 'header.php'; ?>

<div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-10">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Bem-vindo ao DevConnect</h2>

    <!-- Tabs -->
    <div class="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button id="tab-login" class="flex-1 py-2 text-center text-primary font-semibold border-b-2 border-primary transition">Login</button>
        <button id="tab-register" class="flex-1 py-2 text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">Cadastro</button>
    </div>

    <!-- Login Form -->
    <form id="login-form" class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="login-email" required class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input type="password" id="login-password" required class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">Entrar</button>
        <div id="login-error" class="text-red-500 text-sm mt-2 hidden"></div>
    </form>

    <!-- Register Form -->
    <form id="register-form" class="space-y-4 hidden">
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <input type="text" id="register-name" required class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" id="register-email" required class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
            <input type="password" id="register-password" required class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
        </div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">Cadastrar</button>
        <div id="register-error" class="text-red-500 text-sm mt-2 hidden"></div>
    </form>
</div>

<!-- Auth JS -->
<script src="assets/js/auth.js"></script>

<?php include 'footer.php'; ?>
