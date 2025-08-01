// Authentication utilities
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.currentUser = user;
                this.loadUserProfile(user.uid);
                this.updateUIForLoggedInUser();
            } else {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        });
    }

    async registerUser(email, password, userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Save additional user data to Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                email: email,
                name: userData.name,
                phone: userData.phone,
                userType: userData.userType, // 'employee' or 'employer'
                createdAt: new Date(),
                ...userData
            });

            return { success: true, user };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: error.message };
        }
    }

    async loginUser(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message };
        }
    }

    async logoutUser() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            return { success: false, error: error.message };
        }
    }

    async loadUserProfile(uid) {
        try {
            console.log("Loading user profile for UID:", uid);
            const q = query(collection(db, "users"), where("uid", "==", uid));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                this.userProfile = { id: userDoc.id, ...userDoc.data() };
                console.log("User profile loaded successfully:", this.userProfile);
                return this.userProfile;
            } else {
                console.log("No user profile found for UID:", uid);
                this.userProfile = null;
                return null;
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
            this.userProfile = null;
            return null;
        }
    }

    updateUIForLoggedInUser() {
        const joinBtn = document.getElementById('w-btn');
        const navbar = document.getElementById('navbar');
        
        if (joinBtn) {
            joinBtn.textContent = 'Dashboard';
            joinBtn.onclick = () => window.location.href = 'dashboard.html';
        }

        // Add logout button to navbar
        const existingLogout = document.getElementById('logout-btn');
        if (!existingLogout) {
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.textContent = 'Logout';
            logoutBtn.style.cssText = 'background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;';
            logoutBtn.onclick = () => this.logoutUser();
            
            const menu = document.getElementById('menu');
            if (menu) {
                const li = document.createElement('li');
                li.appendChild(logoutBtn);
                menu.appendChild(li);
            }
        }
    }

    updateUIForLoggedOutUser() {
        const joinBtn = document.getElementById('w-btn');
        if (joinBtn) {
            joinBtn.textContent = 'Join';
            joinBtn.onclick = () => window.location.href = 'loginpage.html';
        }

        // Remove logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.parentElement.remove();
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserProfile() {
        return this.userProfile;
    }

    async forceLoadUserProfile(uid) {
        console.log("Force loading user profile for UID:", uid);
        return await this.loadUserProfile(uid);
    }
}

// Initialize auth manager
window.authManager = new AuthManager(); 