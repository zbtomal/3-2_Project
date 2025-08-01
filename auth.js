// Authentication utilities
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log("AuthManager initializing...");
        
        // Listen for auth state changes
        onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed:", user ? user.email : "No user");
            
            if (user) {
                this.currentUser = user;
                console.log("Loading profile for user:", user.uid);
                await this.loadUserProfile(user.uid);
                this.updateUIForLoggedInUser();
            } else {
                this.currentUser = null;
                this.userProfile = null;
                this.updateUIForLoggedOutUser();
            }
        });
        
        console.log("AuthManager initialized");
    }

    async registerUser(email, password, userData) {
        try {
            console.log("Starting registration for:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log("User created, saving profile to Firestore...");
            
            // Determine which collection to save to based on user type
            const collectionName = userData.userType === 'employer' ? 'employers' : 'employees';
            
            // Save additional user data to Firestore
            const userDocRef = await addDoc(collection(db, collectionName), {
                uid: user.uid,
                email: email,
                name: userData.name,
                phone: userData.phone,
                userType: userData.userType, // 'employee' or 'employer'
                createdAt: new Date(),
                ...userData
            });
            
            console.log(`Profile saved to ${collectionName} collection with ID:`, userDocRef.id);
            
            // Also save to users collection for general access
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                email: email,
                name: userData.name,
                phone: userData.phone,
                userType: userData.userType,
                createdAt: new Date(),
                ...userData
            });
            
            console.log("Profile also saved to users collection");
            
            // Immediately load the profile
            await this.loadUserProfile(user.uid);

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
            
            // First try to find in users collection
            let q = query(collection(db, "users"), where("uid", "==", uid));
            let querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                this.userProfile = { id: userDoc.id, ...userDoc.data() };
                console.log("User profile loaded from users collection:", this.userProfile);
                return this.userProfile;
            }
            
            // If not found in users, try employers collection
            q = query(collection(db, "employers"), where("uid", "==", uid));
            querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                this.userProfile = { id: userDoc.id, ...userDoc.data() };
                console.log("User profile loaded from employers collection:", this.userProfile);
                return this.userProfile;
            }
            
            // If not found in employers, try employees collection
            q = query(collection(db, "employees"), where("uid", "==", uid));
            querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                this.userProfile = { id: userDoc.id, ...userDoc.data() };
                console.log("User profile loaded from employees collection:", this.userProfile);
                return this.userProfile;
            }
            
            console.log("No user profile found for UID:", uid);
            this.userProfile = null;
            return null;
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
        const profile = await this.loadUserProfile(uid);
        console.log("Force load result:", profile);
        return profile;
    }
    
    // Method to ensure profile is loaded
    async ensureProfileLoaded() {
        if (this.currentUser && !this.userProfile) {
            console.log("Profile not loaded, forcing load...");
            return await this.forceLoadUserProfile(this.currentUser.uid);
        }
        return this.userProfile;
    }
}

// Initialize auth manager
window.authManager = new AuthManager(); 