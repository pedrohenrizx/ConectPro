<?php include 'header.php'; ?>

<div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mt-8">
    <div class="bg-primary h-32"></div>
    <div class="px-6 py-4 relative">
        <div class="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 absolute -top-12 flex items-center justify-center text-4xl text-primary font-bold shadow-sm" id="profile-avatar">
            <!-- Initial will be placed here -->
            U
        </div>

        <div class="mt-12 flex justify-between items-start">
            <div>
                <h2 id="profile-name" class="text-2xl font-bold text-gray-800 dark:text-gray-200">Carregando...</h2>
                <p id="profile-email" class="text-gray-500 dark:text-gray-400">carregando@email.com</p>
            </div>
            <button id="edit-profile-btn" class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition text-sm">
                <i class="fa-solid fa-pen"></i> Editar Perfil
            </button>
        </div>

        <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Bio</h3>
            <p id="profile-bio" class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">Nenhuma bio adicionada ainda.</p>
        </div>

        <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Tecnologias Favoritas</h3>
            <div id="profile-techs" class="flex flex-wrap gap-2">
                <!-- Tech tags will be placed here -->
                <span class="text-gray-500 italic text-sm">Nenhuma tecnologia adicionada.</span>
            </div>
        </div>
    </div>
</div>

<!-- Edit Profile Modal -->
<div id="edit-profile-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Editar Perfil</h3>
            <button id="close-modal-btn" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="edit-profile-form" class="p-6 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <input type="text" id="edit-name" required class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea id="edit-bio" rows="3" class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary resize-none"></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tecnologias (separadas por vírgula)</label>
                <input type="text" id="edit-techs" placeholder="Ex: JavaScript, Python, React" class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <div class="pt-4 flex justify-end gap-2">
                <button type="button" id="cancel-edit-btn" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
                <button type="submit" id="save-profile-btn" class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md transition flex items-center gap-2">Salvar</button>
            </div>
        </form>
    </div>
</div>

<script src="assets/js/profile.js"></script>

<?php include 'footer.php'; ?>
