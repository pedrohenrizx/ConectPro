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
                // 24. User List Styling
                btn.className = 'w-full flex items-center gap-3 p-3 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 text-left group';
                btn.innerHTML = `
                    <div class="w-10 h-10 rounded-full bg-secondary group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                        ${escapeHTML(initial)}
                    </div>
                    <div class="overflow-hidden">
                        <p class="font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary transition-colors">${escapeHTML(name)}</p>
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
                // 25. Message Empty State
                messagesList.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-center opacity-70">
                        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                            <i class="fa-solid fa-hand-wave text-3xl text-gray-400 dark:text-gray-500"></i>
                        </div>
                        <p class="text-gray-500 dark:text-gray-400 text-sm">Diga olá para iniciar a conversa!</p>
                    </div>`;
                return;
            }

            results.forEach(msg => {
                const senderId = msg.get("sender").id;
                const isMine = senderId === currentUser.id;
                const content = msg.get("content");

                const msgDiv = document.createElement('div');
                msgDiv.className = `flex ${isMine ? 'justify-end' : 'justify-start'}`;

                msgDiv.innerHTML = `
                    <div class="max-w-[70%] rounded-lg px-4 py-2 ${isMine ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'} shadow-sm">
                        <div class="text-sm whitespace-pre-wrap break-words">${parseContent(content)}</div>
                        <p class="text-[10px] ${isMine ? 'text-blue-200' : 'text-gray-400'} text-right mt-1" title="${escapeHTML(msg.createdAt.toLocaleString('pt-BR'))}">${escapeHTML(timeAgo(msg.createdAt))}</p>
                    </div>
                `;

                messagesList.appendChild(msgDiv);
            });

            // 23. Message Smooth Scroll
            messagesList.scrollTo({
                top: messagesList.scrollHeight,
                behavior: 'smooth'
            });

        } catch (error) {
            console.error("Error loading messages:", error);
        }
    }

    // Send Message
    async function sendMessage() {
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
            messageInput.style.height = 'auto'; // Reset auto resize
            await loadMessages(); // Reload to show new message
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Erro ao enviar mensagem: " + error.message);
        } finally {
            sendBtn.disabled = false;
            messageInput.disabled = false;
            messageInput.focus();
        }
    }

    sendMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendMessage();
    });

    // 22. Message Enter to Send
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default new line
            sendMessage();
        }
    });

    // Cleanup on page leave
    window.addEventListener('beforeunload', () => {
        if (refreshInterval) clearInterval(refreshInterval);
    });

    // Init
    loadUsers();
});
