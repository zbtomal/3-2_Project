<?php
// Simple admin login check
$admin_email = 'admin@example.com';
$admin_password = 'admin123';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($email === $admin_email && $password === $admin_password) {
        // Login success, redirect to admin profile
        header('Location: admin-profile.html');
        exit();
    } else {
        // Login failed, redirect back with error
        header('Location: admin-login.html?error=1');
        exit();
    }
} else {
    // If accessed directly, redirect to login page
    header('Location: admin-login.html');
    exit();
}