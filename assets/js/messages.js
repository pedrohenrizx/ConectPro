document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    const usersListEl = document.getElementById('users-list');
    const userSearch = document.getElementById('user-search');

    const noChatSelected = document.getElementById('no-chat-selected');
    const chatUserAvatar = document.getElementById('chat-user-avatar');
    const chatUserName = document.getElementById('chat-user-name');
    const messagesList = document.getElementById('messages-list');

    const sendMessageForm = document.getElementById('send-message-form');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-message-btn');

    let selectedUser = null;
    let refreshInterval = null;

    // Load Users for Sidebar
    async function loadUsers(searchQuery = '') {
        try {
            const query = new Parse.Query(Parse.User);
            query.notEqualTo("objectId", currentUser.id); // Exclude self
            if (searchQuery) {
                // Basic case-insensitive search by name or username
                query.matches("name", new RegExp(searchQuery, 'i'));
            }
            query.limit(20);

            const users = await query.find();
            usersListEl.innerHTML = '';

            if (users.length === 0) {
                usersListEl.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Nenhum usuário encontrado.</p>';
                return;
            }

            users.forEach(user => {
                const name = user.get("name") || user.get("username");
                const initial = name.charAt(0).toUpperCase();

                const btn = document.createElement('button');
                btn.className = 'w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition border-b border-gray-100 dark:border-gray-800 text-left';
                btn.innerHTML = `
                    <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                        ${escapeHTML(initial)}
                    </div>
                    <div class="overflow-hidden">
                        <p class="font-semibold text-gray-800 dark:text-gray-200 truncate">${escapeHTML(name)}</p>
                    </div>
                `;

                btn.addEventListener('click', () => selectUser(user));
                usersListEl.appendChild(btn);
            });
        } catch (error) {
            console.error("Error loading users:", error);
            usersListEl.innerHTML = '<p class="text-sm text-red-500 text-center py-2">Erro ao carregar usuários.</p>';
        }
    }

    userSearch.addEventListener('input', (e) => {
        loadUsers(e.target.value);
    });

    // Select User & Load Chat
    function selectUser(user) {
        selectedUser = user;
        const name = user.get("name") || user.get("username");

        noChatSelected.classList.add('hidden');
        chatUserAvatar.classList.remove('hidden');
        chatUserAvatar.textContent = name.charAt(0).toUpperCase();
        chatUserName.textContent = name;

        loadMessages();

        // Setup polling for new messages (Simple real-time alternative)
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(loadMessages, 5000); // Poll every 5s
    }

    // Load Messages between currentUser and selectedUser
    async function loadMessages() {
        if (!selectedUser) return;

        try {
            const Message = Parse.Object.extend("Message");

            // Query messages sent by currentUser TO selectedUser
            const query1 = new Parse.Query(Message);
            query1.equalTo("sender", currentUser);
            query1.equalTo("receiver", selectedUser);

            // Query messages sent by selectedUser TO currentUser
            const query2 = new Parse.Query(Message);
            query2.equalTo("sender", selectedUser);
            query2.equalTo("receiver", currentUser);

            // Combine queries
            const mainQuery = Parse.Query.or(query1, query2);
            mainQuery.include("sender");
            mainQuery.ascending("createdAt"); // Oldest first for chat flow

            const results = await mainQuery.find();

            // We only want to re-render if there are new messages or first load
            // For a production app, checking last message timestamp is better.
            messagesList.innerHTML = '';

            if (results.length === 0) {
                messagesList.innerHTML = '<p class="text-center text-gray-500 text-sm py-4">Nenhuma mensagem ainda. Envie um "Olá"!</p>';
                return;
            }

            results.forEach(msg => {
                const senderId = msg.get("sender").id;
                const isMine = senderId === currentUser.id;
                const content = msg.get("content");
                const time = msg.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                const msgDiv = document.createElement('div');
                msgDiv.className = `flex ${isMine ? 'justify-end' : 'justify-start'}`;

                msgDiv.innerHTML = `
                    <div class="max-w-[70%] rounded-lg px-4 py-2 ${isMine ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'} shadow-sm">
                        <p class="text-sm whitespace-pre-wrap">${escapeHTML(content)}</p>
                        <p class="text-[10px] ${isMine ? 'text-blue-200' : 'text-gray-400'} text-right mt-1">${escapeHTML(time)}</p>
                    </div>
                `;

                messagesList.appendChild(msgDiv);
            });

            // Scroll to bottom
            messagesList.scrollTop = messagesList.scrollHeight;

        } catch (error) {
            console.error("Error loading messages:", error);
        }
    }

    // Send Message
    sendMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedUser) return;

        const content = messageInput.value.trim();
        if (!content) return;

        sendBtn.disabled = true;
        messageInput.disabled = true;

        try {
            const Message = Parse.Object.extend("Message");
            const msg = new Message();

            msg.set("sender", currentUser);
            msg.set("receiver", selectedUser);
            msg.set("content", content);

            await msg.save();

            messageInput.value = '';
            await loadMessages(); // Reload to show new message
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Erro ao enviar mensagem: " + error.message);
        } finally {
            sendBtn.disabled = false;
            messageInput.disabled = false;
            messageInput.focus();
        }
    });

    // Cleanup on page leave
    window.addEventListener('beforeunload', () => {
        if (refreshInterval) clearInterval(refreshInterval);
    });

    // Init
    loadUsers();
});
