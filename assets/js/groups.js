document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return; // redirect handled globally

    // UI Elements
    const groupsListEl = document.getElementById('groups-list');
    const groupContentArea = document.getElementById('group-content-area');
    const noGroupSelected = document.getElementById('no-group-selected');

    const currentGroupName = document.getElementById('current-group-name');
    const currentGroupDesc = document.getElementById('current-group-desc');
    const joinGroupBtn = document.getElementById('join-group-btn');
    const memberBadge = document.getElementById('member-badge');

    const createDiscussionForm = document.getElementById('create-discussion-form');
    const discussionContent = document.getElementById('discussion-content');
    const discussionsList = document.getElementById('discussions-list');

    // Modal Elements
    const createGroupBtn = document.getElementById('create-group-btn');
    const createGroupModal = document.getElementById('create-group-modal');
    const closeGroupModal = document.getElementById('close-group-modal');
    const cancelGroupBtn = document.getElementById('cancel-group-btn');
    const createGroupForm = document.getElementById('create-group-form');

    let currentGroup = null;

    // Load Groups
    async function loadGroups() {
        try {
            const Group = Parse.Object.extend("Group");
            const query = new Parse.Query(Group);
            query.ascending("name");
            const results = await query.find();

            groupsListEl.innerHTML = '';

            if (results.length === 0) {
                groupsListEl.innerHTML = '<p class="text-sm text-gray-500 text-center py-2">Nenhum grupo encontrado.</p>';
                return;
            }

            results.forEach(group => {
                const btn = document.createElement('button');
                btn.className = 'w-full text-left px-4 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-600 mb-1';
                btn.innerHTML = `<span class="font-medium text-gray-800 dark:text-gray-200">${escapeHTML(group.get("name"))}</span>`;

                btn.addEventListener('click', () => selectGroup(group));
                groupsListEl.appendChild(btn);
            });
        } catch (error) {
            console.error("Error loading groups:", error);
            groupsListEl.innerHTML = '<p class="text-sm text-red-500">Erro ao carregar grupos.</p>';
        }
    }

    // Select Group
    async function selectGroup(group) {
        currentGroup = group;

        noGroupSelected.classList.add('hidden');
        groupContentArea.classList.remove('hidden');

        currentGroupName.textContent = group.get("name");
        currentGroupDesc.textContent = group.get("description");

        await checkMembership();
        await loadDiscussions();
    }

    // Check Membership
    async function checkMembership() {
        const members = currentGroup.get("members") || [];
        const isMember = members.some(userId => userId === currentUser.id);

        if (isMember) {
            joinGroupBtn.classList.add('hidden');
            memberBadge.classList.remove('hidden');
            createDiscussionForm.classList.remove('hidden');
        } else {
            joinGroupBtn.classList.remove('hidden');
            memberBadge.classList.add('hidden');
            createDiscussionForm.classList.add('hidden');
        }
    }

    // Join Group
    joinGroupBtn.addEventListener('click', async () => {
        if (!currentGroup) return;

        try {
            joinGroupBtn.disabled = true;
            joinGroupBtn.textContent = 'Entrando...';

            let members = currentGroup.get("members") || [];
            if (!members.includes(currentUser.id)) {
                members.push(currentUser.id);
                currentGroup.set("members", members);
                await currentGroup.save();
                await checkMembership();
            }
        } catch (error) {
            console.error("Error joining group:", error);
            alert("Erro ao participar do grupo: " + error.message);
        } finally {
            joinGroupBtn.disabled = false;
            joinGroupBtn.textContent = 'Participar';
        }
    });

    // Load Discussions
    async function loadDiscussions() {
        if (!currentGroup) return;

        discussionsList.innerHTML = '<div class="text-center py-4"><i class="fa-solid fa-spinner fa-spin text-primary"></i></div>';

        try {
            const Discussion = Parse.Object.extend("Discussion");
            const query = new Parse.Query(Discussion);
            query.equalTo("group", currentGroup);
            query.include("author");
            query.descending("createdAt");

            const results = await query.find();
            discussionsList.innerHTML = '';

            if (results.length === 0) {
                discussionsList.innerHTML = '<p class="text-center text-gray-500 py-4">Nenhuma discussão ainda. Seja o primeiro!</p>';
                return;
            }

            results.forEach(discussion => {
                const author = discussion.get("author");
                const content = discussion.get("content");
                const createdAt = discussion.createdAt.toLocaleString('pt-BR');
                const authorName = author ? (author.get("name") || author.get("username")) : "Usuário Desconhecido";

                const html = `
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">
                                ${escapeHTML(authorName.charAt(0).toUpperCase())}
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">${escapeHTML(authorName)}</p>
                                <p class="text-xs text-gray-500">${escapeHTML(createdAt)}</p>
                            </div>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">${escapeHTML(content)}</p>
                    </div>
                `;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                discussionsList.appendChild(tempDiv.firstElementChild);
            });
        } catch (error) {
            console.error("Error loading discussions:", error);
            discussionsList.innerHTML = '<p class="text-center text-red-500 py-4">Erro ao carregar discussões.</p>';
        }
    }

    // Create Discussion
    createDiscussionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentGroup) return;

        const content = discussionContent.value.trim();
        if (!content) return;

        const submitBtn = createDiscussionForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '...';

        try {
            const Discussion = Parse.Object.extend("Discussion");
            const discussion = new Discussion();

            discussion.set("group", currentGroup);
            discussion.set("author", currentUser);
            discussion.set("content", content);

            await discussion.save();

            discussionContent.value = '';
            await loadDiscussions();
        } catch (error) {
            console.error("Error creating discussion:", error);
            alert("Erro ao criar discussão: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Postar';
        }
    });

    // Modal Handlers
    createGroupBtn.addEventListener('click', () => createGroupModal.classList.remove('hidden'));
    closeGroupModal.addEventListener('click', () => createGroupModal.classList.add('hidden'));
    cancelGroupBtn.addEventListener('click', () => createGroupModal.classList.add('hidden'));

    createGroupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('new-group-name').value;
        const desc = document.getElementById('new-group-desc').value;
        const submitBtn = document.getElementById('submit-group-btn');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Criando...';

        try {
            const Group = Parse.Object.extend("Group");
            const group = new Group();

            group.set("name", name);
            group.set("description", desc);
            group.set("creator", currentUser);
            group.set("members", [currentUser.id]); // Creator is automatically a member

            await group.save();

            createGroupForm.reset();
            createGroupModal.classList.add('hidden');

            await loadGroups();
            selectGroup(group); // Automatically select the new group
        } catch (error) {
            console.error("Error creating group:", error);
            alert("Erro ao criar grupo: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Criar';
        }
    });

    // Initial Load
    loadGroups();
});
