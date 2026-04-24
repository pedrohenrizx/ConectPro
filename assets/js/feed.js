document.addEventListener('DOMContentLoaded', () => {
    // Only proceed if user is logged in
    if (!Parse.User.current()) return;

    // Setup CodeMirror
    const codeTextarea = document.getElementById('post-code');
    let editor = null;
    let codeEnabled = false;

    const toggleCodeBtn = document.getElementById('toggle-code-btn');
    const codeContainer = document.getElementById('code-container');
    const codeLanguage = document.getElementById('code-language');

    toggleCodeBtn.addEventListener('click', () => {
        codeEnabled = !codeEnabled;
        if (codeEnabled) {
            codeContainer.classList.remove('hidden');
            if (!editor) {
                editor = CodeMirror.fromTextArea(codeTextarea, {
                    lineNumbers: true,
                    mode: codeLanguage.value,
                    theme: 'dracula',
                    viewportMargin: Infinity
                });
            }
        } else {
            codeContainer.classList.add('hidden');
        }
    });

    if (codeLanguage) {
        codeLanguage.addEventListener('change', (e) => {
            if (editor) {
                editor.setOption('mode', e.target.value);
            }
        });
    }

    // Load Posts
    const feedContainer = document.getElementById('feed-container');

    async function loadPosts() {
        try {
            const Post = Parse.Object.extend("Post");
            const query = new Parse.Query(Post);
            query.include("author");
            query.descending("createdAt");
            const results = await query.find();

            feedContainer.innerHTML = ''; // Clear loading

            if (results.length === 0) {
                // 18. Feed Empty State
                feedContainer.innerHTML = `
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10 text-center border-dashed border-2 border-gray-300 dark:border-gray-700">
                        <i class="fa-solid fa-folder-open text-5xl text-gray-300 dark:text-gray-600 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">Nenhuma postagem encontrada</h3>
                        <p class="text-gray-500 dark:text-gray-400 mt-2">Seja o primeiro a compartilhar algo com a comunidade!</p>
                    </div>`;
                return;
            }

            for (const post of results) {
                const author = post.get("author");
                const content = post.get("content");
                const imageFile = post.get("image");
                const codeSnippet = post.get("codeSnippet");
                const codeLang = post.get("codeLanguage");

                let authorName = author ? author.get("name") : "Usuário Desconhecido";

                // 17. Post Hover Effect
                let postHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            ${escapeHTML(authorName.charAt(0).toUpperCase())}
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">${escapeHTML(authorName)}</p>
                            <p class="text-xs text-gray-500" title="${escapeHTML(post.createdAt.toLocaleString('pt-BR'))}">${escapeHTML(timeAgo(post.createdAt))}</p>
                        </div>
                    </div>
                    <div class="mb-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">${parseContent(content)}</div>
                `;

                if (imageFile) {
                    postHTML += `<img src="${imageFile.url()}" alt="Post Image" class="w-full rounded-md mb-4 max-h-96 object-cover cursor-pointer hover:opacity-95 transition" onclick="window.open(this.src)">`;
                }

                if (codeSnippet) {
                    // 16. Copy Code Button
                    postHTML += `
                        <div class="mb-4 rounded-md overflow-hidden text-sm relative group">
                            <div class="bg-gray-800 text-gray-400 px-4 py-1 text-xs border-b border-gray-700 flex justify-between items-center">
                                <span>${escapeHTML(codeLang)}</span>
                                <button type="button" class="copy-code-btn opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-white" data-code="${escapeHTML(codeSnippet)}"><i class="fa-regular fa-copy"></i> Copiar</button>
                            </div>
                            <textarea id="readonly-code-${post.id}">${escapeHTML(codeSnippet)}</textarea>
                        </div>
                    `;
                }

                postHTML += `
                    <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button class="text-gray-500 hover:text-primary transition flex items-center gap-1"><i class="fa-regular fa-thumbs-up"></i> Curtir</button>
                        <button class="text-gray-500 hover:text-primary transition flex items-center gap-1"><i class="fa-regular fa-comment"></i> Comentar</button>
                    </div>
                </div>
                `;

                // Create a temporary container to insert the HTML safely
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = postHTML;
                const postElement = tempDiv.firstElementChild;
                feedContainer.appendChild(postElement);

                // Setup Copy logic
                const copyBtn = postElement.querySelector('.copy-code-btn');
                if (copyBtn) {
                    copyBtn.addEventListener('click', (e) => {
                        const codeToCopy = e.currentTarget.getAttribute('data-code');
                        navigator.clipboard.writeText(codeToCopy).then(() => {
                            const originalHTML = e.currentTarget.innerHTML;
                            e.currentTarget.innerHTML = '<i class="fa-solid fa-check text-green-500"></i> Copiado';
                            setTimeout(() => e.currentTarget.innerHTML = originalHTML, 2000);
                        });
                    });
                }

                // Initialize CodeMirror for read-only snippets
                if (codeSnippet) {
                    const snippetTextarea = document.getElementById(`readonly-code-${post.id}`);
                    if (snippetTextarea) {
                        CodeMirror.fromTextArea(snippetTextarea, {
                            lineNumbers: true,
                            mode: codeLang,
                            theme: 'dracula',
                            readOnly: true,
                            viewportMargin: Infinity
                        });
                    }
                }
            }

        } catch (error) {
            console.error("Error loading posts:", error);
            feedContainer.innerHTML = `<p class="text-center text-red-500">Erro ao carregar postagens: ${error.message}</p>`;
        }
    }

    loadPosts();

    // Create Post
    const createPostForm = document.getElementById('create-post-form');
    const submitBtn = document.getElementById('submit-post-btn');
    const postContent = document.getElementById('post-content');
    const charCount = document.getElementById('char-count');
    const imageInput = document.getElementById('post-image');

    // 14. Image Preview Elements
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');

    // 13. Smart Post Button State & 12. Character Count
    function validateForm() {
        const contentLen = postContent.value.length;
        charCount.textContent = contentLen + ' caracteres';

        let codeSnippet = '';
        if (codeEnabled && editor) {
            codeSnippet = editor.getValue();
        }

        if (contentLen > 0 || imageInput.files.length > 0 || codeSnippet.length > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    postContent.addEventListener('input', validateForm);
    imageInput.addEventListener('change', (e) => {
        validateForm();
        // Image Preview Logic
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                imagePreview.src = evt.target.result;
                imagePreviewContainer.classList.remove('hidden');
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Check CodeMirror content changes for smart button validation
    if (editor) {
        editor.on('change', validateForm);
    }
    toggleCodeBtn.addEventListener('click', () => {
        setTimeout(() => {
            if (editor) editor.on('change', validateForm);
            validateForm();
        }, 100);
    });

    removeImageBtn.addEventListener('click', () => {
        imageInput.value = '';
        imagePreviewContainer.classList.add('hidden');
        imagePreview.src = '';
        validateForm();
    });

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

        const content = postContent.value;

        let codeSnippet = '';
        if (codeEnabled && editor) {
            codeSnippet = editor.getValue();
        }

        if (!content && !imageInput.files[0] && !codeSnippet) {
            alert("A postagem não pode estar vazia.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar';
            return;
        }

        try {
            const Post = Parse.Object.extend("Post");
            const post = new Post();

            post.set("author", Parse.User.current());
            post.set("content", content);

            if (codeSnippet) {
                post.set("codeSnippet", codeSnippet);
                post.set("codeLanguage", codeLanguage.value);
            }

            if (imageInput.files.length > 0) {
                const file = imageInput.files[0];
                const name = "photo.jpg"; // Or parse the extension
                const parseFile = new Parse.File(name, file);
                post.set("image", parseFile);
            }

            await post.save();

            // 15. Clear Inputs Fully
            createPostForm.reset();
            postContent.style.height = 'auto'; // Reset auto-resize
            imagePreviewContainer.classList.add('hidden');
            imagePreview.src = '';
            validateForm(); // Reset char count and disable button

            if (editor) {
                editor.setValue('');
                codeEnabled = false;
                codeContainer.classList.add('hidden');
            }

            // Reload posts
            loadPosts();

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Erro ao criar postagem: " + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar';
        }
    });
});
