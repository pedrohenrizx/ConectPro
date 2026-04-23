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
                feedContainer.innerHTML = '<p class="text-center text-gray-500">Nenhuma postagem encontrada. Seja o primeiro a postar!</p>';
                return;
            }

            for (const post of results) {
                const author = post.get("author");
                const content = post.get("content");
                const imageFile = post.get("image");
                const codeSnippet = post.get("codeSnippet");
                const codeLang = post.get("codeLanguage");
                const createdAt = post.createdAt.toLocaleString('pt-BR');

                let authorName = author ? author.get("name") : "Usuário Desconhecido";

                let postHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            ${escapeHTML(authorName.charAt(0).toUpperCase())}
                        </div>
                        <div>
                            <p class="font-semibold text-gray-800 dark:text-gray-200">${escapeHTML(authorName)}</p>
                            <p class="text-xs text-gray-500">${escapeHTML(createdAt)}</p>
                        </div>
                    </div>
                    <div class="mb-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">${escapeHTML(content)}</div>
                `;

                if (imageFile) {
                    postHTML += `<img src="${imageFile.url()}" alt="Post Image" class="w-full rounded-md mb-4 max-h-96 object-cover">`;
                }

                if (codeSnippet) {
                    postHTML += `
                        <div class="mb-4 rounded-md overflow-hidden text-sm">
                            <div class="bg-gray-800 text-gray-400 px-4 py-1 text-xs border-b border-gray-700">${escapeHTML(codeLang)}</div>
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
                feedContainer.appendChild(tempDiv.firstElementChild);

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

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

        const content = document.getElementById('post-content').value;
        const imageInput = document.getElementById('post-image');

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

            // Reset form
            createPostForm.reset();
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
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publicar';
        }
    });
});
