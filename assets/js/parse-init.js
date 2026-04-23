// Initialize Parse with Back4App credentials
Parse.initialize(
  "hMZBazfLxDOjSPGgRvzBZxKedFCC0iDEJgEDquR4", // Application ID
  "W3eRuk8fOdI1z9MDASo4ONJXGd8r2V8bpmzC4fQH"  // JavaScript Key
);
Parse.serverURL = "https://parseapi.back4app.com/";

// Utility function to escape HTML to prevent XSS
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Utility function to check authentication status globally
function checkAuth() {
    const currentUser = Parse.User.current();
    const authNavLinks = document.getElementById('auth-nav-links');
    const unauthNavLinks = document.getElementById('unauth-nav-links');

    if (currentUser) {
        if(authNavLinks) authNavLinks.classList.remove('hidden');
        if(unauthNavLinks) unauthNavLinks.classList.add('hidden');
    } else {
        if(authNavLinks) authNavLinks.classList.add('hidden');
        if(unauthNavLinks) unauthNavLinks.classList.remove('hidden');

        // If not on auth page, redirect to auth
        if (!window.location.pathname.endsWith('auth.php')) {
            window.location.href = 'auth.php';
        }
    }
}

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Setup global logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await Parse.User.logOut();
                window.location.href = 'auth.php';
            } catch (error) {
                console.error("Error logging out", error);
                alert("Erro ao sair: " + error.message);
            }
        });
    }
});
