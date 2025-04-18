document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.querySelector('input[type="text"]');
    const userInfo = document.createElement('div');
    const newPassField = document.createElement('div');
    const confirmPassField = document.createElement('div');
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Create new password input
    newPassField.className = 'input-field';
    newPassField.innerHTML = `
        <input id="new-password" type="password" placeholder="New Password" required>
        <i class="uil uil-key-skeleton"></i>
    `;

    // Create confirm password input
    confirmPassField.className = 'input-field';
    confirmPassField.innerHTML = `
        <input id="confirm-password" type="password" placeholder="Confirm New Password" required>
        <i class="uil uil-key-skeleton"></i>
    `;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        const email = emailInput.value.trim();
        const user = users.find(u => u.email === email);

        if (!user) {
            showError(emailInput.parentElement, 'Email not found');
            return;
        }

        // Show user info and password fields
        if (!document.getElementById('user-info')) {
            userInfo.id = 'user-info';
            userInfo.innerHTML = `
                <p class="paragraph-reset">Registered username: 
                    <strong>${user.username}</strong>
                </p>
            `;
            form.insertBefore(userInfo, form.querySelector('#res-but'));
            form.insertBefore(newPassField, form.querySelector('#res-but'));
            form.insertBefore(confirmPassField, form.querySelector('#res-but'));
        }

        // Validate new password
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!validatePassword(newPassword)) return;
        
        if (newPassword !== confirmPassword) {
            showError(confirmPassField, 'Passwords do not match');
            return;
        }

        // Update password
        user.password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        showToast('Password updated successfully!', 'success');
        setTimeout(() => window.location.href = 'login.html', 2000);
    });

    function validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/;
        const hasNumber = /\d/;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        let isValid = true;

        if (password.length < minLength) {
            showError(newPassField, 'Password must be at least 8 characters');
            isValid = false;
        }
        if (!hasUpperCase.test(password)) {
            showError(newPassField, 'Must contain at least one uppercase letter');
            isValid = false;
        }
        if (!hasNumber.test(password)) {
            showError(newPassField, 'Must contain at least one number');
            isValid = false;
        }
        if (!hasSpecialChar.test(password)) {
            showError(newPassField, 'Must contain at least one special character');
            isValid = false;
        }
        return isValid;
    }

    function showError(element, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        element.parentNode.insertBefore(error, element.nextSibling);
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
    }
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.backgroundColor = 
            type === 'error' ? 'var(--danger-color)' :
            type === 'warning' ? 'var(--warning-color)' :
            'var(--success-color)';
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
});