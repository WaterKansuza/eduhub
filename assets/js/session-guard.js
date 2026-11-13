/* EduHub session guard. */

// Chưa đăng nhập -> quay về trang đăng nhập
        if (!localStorage.getItem('eduhub_session') && !sessionStorage.getItem('eduhub_session')) {
            window.location.replace('login.html');
        }

EduHub.guardSession();
