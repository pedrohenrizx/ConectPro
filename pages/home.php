<?php include 'header.php'; ?>

<!-- Create Post Area -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
    <h3 class="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Criar nova postagem</h3>

    <form id="create-post-form" class="space-y-4">
        <!-- Post Content -->
        <div>
            <textarea id="post-content" rows="3" placeholder="No que você está pensando?" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary resize-none"></textarea>
        </div>

        <!-- Post Image -->
        <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagem (Opcional)</label>
            <input type="file" id="post-image" accept="image/*" class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary transition">
        </div>

        <!-- Post Code toggle -->
        <div>
            <button type="button" id="toggle-code-btn" class="text-sm text-primary hover:text-secondary transition flex items-center gap-1">
                <i class="fa-solid fa-code"></i> Adicionar trecho de código
            </button>

            <div id="code-container" class="mt-2 hidden">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Linguagem</label>
                <select id="code-language" class="mb-2 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="htmlmixed">HTML</option>
                    <option value="css">CSS</option>
                    <option value="php">PHP</option>
                </select>
                <textarea id="post-code" name="post-code"></textarea>
            </div>
        </div>

        <div class="flex justify-end pt-2">
            <button type="submit" id="submit-post-btn" class="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-md transition font-medium flex items-center gap-2">
                <i class="fa-solid fa-paper-plane"></i> Publicar
            </button>
        </div>
    </form>
</div>

<!-- Feed Area -->
<div id="feed-container" class="space-y-6">
    <!-- Posts will be injected here dynamically -->
    <div class="text-center py-8">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-primary mb-2"></i>
        <p class="text-gray-500 dark:text-gray-400">Carregando feed...</p>
    </div>
</div>

<!-- CodeMirror Scripts for syntax highlighting -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/python/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/xml/xml.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/css/css.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/htmlmixed/htmlmixed.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/clike/clike.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/php/php.min.js"></script>

<!-- Feed Logic -->
<script src="assets/js/feed.js"></script>

<?php include 'footer.php'; ?>
