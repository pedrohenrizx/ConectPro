document.addEventListener('DOMContentLoaded', () => {
    // If user is already logged in, redirect to index
    if (Parse.User.current()) {
        window.location.href = '/';
        return;
    }

    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');

    // Tab Switching
    tabLogin.addEventListener('click', () => {
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');

        tabLogin.classList.add('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
        tabLogin.classList.remove('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');

        tabRegister.classList.add('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
        tabRegister.classList.remove('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
    });

    tabRegister.addEventListener('click', () => {
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');

        tabRegister.classList.add('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
        tabRegister.classList.remove('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');

        tabLogin.classList.add('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
        tabLogin.classList.remove('text-primary', 'font-semibold', 'border-b-2', 'border-primary');
    });

    // Handle Login
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        // 10. & 11. Auth Loading State and Prevent Double Submit
        const submitBtn = formLogin.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Entrando...';

        try {
            const user = await Parse.User.logIn(email, password);
            window.location.href = '/';
        } catch (error) {
            errorDiv.textContent = 'Erro ao fazer login: ' + error.message;
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Entrar';
        }
    });

    // Handle Registration
    formRegister.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const errorDiv = document.getElementById('register-error');

        // 10. & 11. Auth Loading State and Prevent Double Submit
        const submitBtn = formRegister.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Cadastrando...';

        const user = new Parse.User();
        user.set("username", email); // Using email as username for simplicity
        user.set("email", email);
        user.set("password", password);
        user.set("name", toTitleCase(name));

        try {
            await user.signUp();
            window.location.href = '/';
        } catch (error) {
            errorDiv.textContent = 'Erro ao cadastrar: ' + error.message;
            errorDiv.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Cadastrar';
        }
    });
});
