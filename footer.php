    </main>
    <footer class="bg-white dark:bg-gray-800 text-center p-4 mt-auto border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">&copy; 2024 DevConnect. Todos os direitos reservados.</p>
    </footer>

    <!-- Scripts -->
    <script src="assets/js/theme.js"></script>
    <script src="assets/js/parse-init.js"></script>

    <!-- Global UI Utilities -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // 4. Navbar Active State
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('#auth-nav-links a');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('text-primary', 'font-semibold');
                    link.classList.remove('hover:text-primary');
                }
            });

            // 6. Auto-resize Textareas
            document.addEventListener('input', function (event) {
                if (event.target.tagName.toLowerCase() !== 'textarea') return;
                event.target.style.height = 'auto';
                event.target.style.height = (event.target.scrollHeight) + 'px';
            }, false);
        });

        // 5. Relative Timestamps (timeAgo)
        function timeAgo(date) {
            const seconds = Math.floor((new Date() - date) / 1000);
            let interval = seconds / 31536000;
            if (interval > 1) return Math.floor(interval) + " anos atrás";
            interval = seconds / 2592000;
            if (interval > 1) return Math.floor(interval) + " meses atrás";
            interval = seconds / 86400;
            if (interval > 1) return Math.floor(interval) + " dias atrás";
            interval = seconds / 3600;
            if (interval > 1) return Math.floor(interval) + " horas atrás";
            interval = seconds / 60;
            if (interval > 1) return Math.floor(interval) + " minutos atrás";
            if (seconds < 10) return "agora mesmo";
            return Math.floor(seconds) + " segundos atrás";
        }

        // 7. Title Case Names
        function toTitleCase(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }

        // 8. Link Detection & 9. Hashtag Detection
        function parseContent(text) {
            if (!text) return '';
            // Escape HTML first to prevent XSS
            let escaped = escapeHTML(text);

            // Detect Links
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            escaped = escaped.replace(urlRegex, function(url) {
                return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">' + url + '</a>';
            });

            // Detect Hashtags
            const hashtagRegex = /(^|\s)(#[a-z\d-_]+)/ig;
            escaped = escaped.replace(hashtagRegex, function(match, space, tag) {
                return space + '<span class="text-secondary font-medium cursor-pointer hover:underline">' + tag + '</span>';
            });

            return escaped;
        }
    </script>
    <!-- We will include specific scripts per page -->
</body>
</html>
