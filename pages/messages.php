<?php include 'header.php'; ?>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md mt-6 flex h-[600px] overflow-hidden">

    <!-- Users List Sidebar -->
    <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Conversas</h3>
        </div>

        <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <input type="text" id="user-search" placeholder="Buscar usuário..." class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm">
        </div>

        <div id="users-list" class="flex-grow overflow-y-auto">
            <!-- Users injected here -->
            <div class="text-center py-4">
                <i class="fa-solid fa-spinner fa-spin text-primary"></i>
            </div>
        </div>
    </div>

    <!-- Chat Area -->
    <div class="w-2/3 flex flex-col relative">

        <!-- Empty State -->
        <div id="no-chat-selected" class="absolute inset-0 z-10 bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-10 text-center">
            <i class="fa-regular fa-comments text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Suas Mensagens</h3>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Selecione um usuário na lateral para iniciar uma conversa.</p>
        </div>

        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center gap-3">
            <div id="chat-user-avatar" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold hidden">
                U
            </div>
            <h3 id="chat-user-name" class="text-lg font-semibold text-gray-800 dark:text-gray-200">Nome do Usuário</h3>
        </div>

        <!-- Messages Area -->
        <div id="messages-list" class="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            <!-- Messages injected here -->
        </div>

        <!-- Message Input Form -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form id="send-message-form" class="flex items-end gap-2">
                <textarea id="message-input" rows="1" required placeholder="Digite uma mensagem... (Enter para enviar, Shift+Enter para nova linha)" class="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-primary focus:border-primary resize-none overflow-hidden" style="min-height: 40px; max-height: 120px;"></textarea>
                <button type="submit" id="send-message-btn" class="bg-primary hover:bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center transition flex-shrink-0">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    </div>

</div>

<script src="assets/js/messages.js"></script>

<?php include 'footer.php'; ?>
