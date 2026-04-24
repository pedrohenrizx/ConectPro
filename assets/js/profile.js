document.addEventListener('DOMContentLoaded', () => {
    const currentUser = Parse.User.current();
    if (!currentUser) return; // redirect handled globally

    // UI Elements
    const avatarEl = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const bioEl = document.getElementById('profile-bio');
    const techsEl = document.getElementById('profile-techs');

    // Modal Elements
    const modal = document.getElementById('edit-profile-modal');
    const editBtn = document.getElementById('edit-profile-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.getElementById('edit-profile-form');

    // Inputs
    const editName = document.getElementById('edit-name');
    const editBio = document.getElementById('edit-bio');
    const editTechs = document.getElementById('edit-techs');

    function loadProfile() {
        const name = currentUser.get("name") || currentUser.get("username");
        const email = currentUser.get("email");
        const bio = currentUser.get("bio");
        const techs = currentUser.get("technologies") || [];

        nameEl.textContent = name;
        emailEl.textContent = email;
        avatarEl.textContent = name.charAt(0).toUpperCase();

        if (bio) {
            bioEl.textContent = bio; // textContent automatically escapes
        } else {
            bioEl.innerHTML = '<span class="text-gray-400 italic">Nenhuma bio adicionada.</span>';
        }

        if (techs.length > 0) {
            techsEl.innerHTML = techs.map(tech =>
                `<span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">${escapeHTML(tech.trim())}</span>`
            ).join('');
        } else {
            techsEl.innerHTML = '<span class="text-gray-400 italic text-sm">Nenhuma tecnologia adicionada.</span>';
        }
    }

    // Initial Load
    loadProfile();

    // Modal Handlers
    function openModal() {
        editName.value = currentUser.get("name") || "";
        editBio.value = currentUser.get("bio") || "";
        editTechs.value = (currentUser.get("technologies") || []).join(", ");
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    editBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Form Submit
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const saveBtn = document.getElementById('save-profile-btn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

        try {
            currentUser.set("name", editName.value);
            currentUser.set("bio", editBio.value);

            const techsArray = editTechs.value.split(',').map(t => t.trim()).filter(t => t !== "");
            currentUser.set("technologies", techsArray);

            await currentUser.save();

            loadProfile();
            closeModal();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Erro ao atualizar perfil: " + error.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Salvar';
        }
    });
});
