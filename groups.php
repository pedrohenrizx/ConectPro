<?php include 'header.php'; ?>

<div class="flex flex-col md:flex-row gap-6 mt-6">
    <!-- Groups List Sidebar -->
    <div class="w-full md:w-1/3">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-24">
            <div class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Grupos</h3>
                <button id="create-group-btn" class="text-primary hover:text-secondary transition text-sm flex items-center gap-1">
                    <i class="fa-solid fa-plus"></i> Criar
                </button>
            </div>

            <div id="groups-list" class="space-y-2">
                <!-- Group list injected here -->
                <div class="text-center py-4">
                    <i class="fa-solid fa-spinner fa-spin text-primary"></i>
                </div>
            </div>
        </div>
    </div>

    <!-- Group Detail/Discussion Area -->
    <div class="w-full md:w-2/3">
        <div id="group-content-area" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hidden">
            <div class="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <div>
                    <h2 id="current-group-name" class="text-2xl font-bold text-gray-800 dark:text-gray-200">Nome do Grupo</h2>
                    <p id="current-group-desc" class="text-gray-500 dark:text-gray-400 mt-1">Descrição do grupo.</p>
                </div>
                <button id="join-group-btn" class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md transition text-sm hidden">Participar</button>
                <span id="member-badge" class="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium hidden">Membro</span>
            </div>

            <!-- Create Discussion Form (Only for members) -->
            <form id="create-discussion-form" class="mb-6 hidden">
                <textarea id="discussion-content" rows="2" placeholder="Iniciar uma discussão..." class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary resize-none"></textarea>
                <div class="flex justify-end mt-2">
                    <button type="submit" class="bg-primary hover:bg-secondary text-white px-4 py-1.5 rounded-md transition text-sm">Postar</button>
                </div>
            </form>

            <!-- Discussions List -->
            <div id="discussions-list" class="space-y-4">
                <!-- Discussions injected here -->
            </div>
        </div>

        <!-- Empty State -->
        <div id="no-group-selected" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center">
            <i class="fa-solid fa-users text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Selecione um grupo</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Escolha um grupo na lateral para ver as discussões ou crie um novo.</p>
        </div>
    </div>
</div>

<!-- Create Group Modal -->
<div id="create-group-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Criar Novo Grupo</h3>
            <button id="close-group-modal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="create-group-form" class="p-6 space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Tecnologia/Categoria</label>
                <input type="text" id="new-group-name" required placeholder="Ex: JavaScript, Inteligência Artificial" class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
                <textarea id="new-group-desc" required rows="3" class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary resize-none"></textarea>
            </div>
            <div class="pt-4 flex justify-end gap-2">
                <button type="button" id="cancel-group-btn" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
                <button type="submit" id="submit-group-btn" class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md transition">Criar</button>
            </div>
        </form>
    </div>
</div>

<script src="assets/js/groups.js"></script>

<?php include 'footer.php'; ?>
