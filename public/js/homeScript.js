document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.room-link').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.removeItem('nickname');
        });
    });
});
