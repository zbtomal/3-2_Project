// Dashboard functionality
class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.init();
    }

    async init() {
        // Wait for auth to be ready
        await this.waitForAuth();
        this.setupEventListeners();
        this.loadDashboard();
    }

    async waitForAuth() {
        return new Promise((resolve) => {
            const checkAuth = () => {
                if (window.authManager && window.authManager.isLoggedIn()) {
                    this.currentUser = window.authManager.getCurrentUser();
                    this.userProfile = window.authManager.getUserProfile();
                    
                    console.log("Dashboard auth check - User:", this.currentUser?.email, "Profile:", this.userProfile);
                    
                    // Wait for user profile to be loaded
                    if (this.userProfile) {
                        console.log("User profile found, resolving dashboard");
                        resolve();
                    } else {
                        // If profile is not loaded yet, try to force load it
                        if (this.currentUser) {
                            console.log("Profile not loaded, attempting to force load...");
                            window.authManager.forceLoadUserProfile(this.currentUser.uid)
                                .then((profile) => {
                                    if (profile) {
                                        this.userProfile = profile;
                                        console.log("Profile force loaded successfully");
                                        resolve();
                                    } else {
                                        console.log("Force load failed, retrying...");
                                        setTimeout(checkAuth, 1000);
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error force loading profile:", error);
                                    setTimeout(checkAuth, 1000);
                                });
                        } else {
                            setTimeout(checkAuth, 500);
                        }
                    }
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    setupEventListeners() {
        // Job form submission
        const jobForm = document.getElementById('jobForm');
        if (jobForm) {
            jobForm.addEventListener('submit', (e) => this.handleJobSubmission(e));
        }
    }

    loadDashboard() {
        console.log('Loading dashboard, userProfile:', this.userProfile);
        
        if (!this.userProfile) {
            console.log('No user profile, redirecting to login');
            window.location.href = 'loginpage.html';
            return;
        }

        this.updateUserInfo();
        
        if (this.userProfile.userType === 'employee') {
            this.showEmployeeDashboard();
        } else if (this.userProfile.userType === 'employer') {
            this.showEmployerDashboard();
        } else {
            console.error('Unknown user type:', this.userProfile.userType);
        }
    }

    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.userProfile) {
            userInfo.textContent = `Welcome, ${this.userProfile.name} (${this.userProfile.userType})`;
        }
    }

    showEmployeeDashboard() {
        document.getElementById('employeeDashboard').style.display = 'block';
        document.getElementById('employerDashboard').style.display = 'none';
        this.loadAvailableJobs();
        this.loadMyApplications();
    }

    showEmployerDashboard() {
        document.getElementById('employerDashboard').style.display = 'block';
        document.getElementById('employeeDashboard').style.display = 'none';
        this.loadPostedJobs();
        this.loadJobApplications();
    }

    async loadAvailableJobs() {
        try {
            const jobsSnapshot = await getDocs(collection(db, "jobs"));
            const jobs = [];
            jobsSnapshot.forEach((doc) => {
                jobs.push({ id: doc.id, ...doc.data() });
            });

            const jobsContainer = document.getElementById('availableJobs');
            if (jobs.length === 0) {
                jobsContainer.innerHTML = '<p>No jobs available at the moment.</p>';
                return;
            }

            jobsContainer.innerHTML = jobs.map(job => `
                <div class="job-item">
                    <h4>${job.title}</h4>
                    <p><strong>Category:</strong> ${job.category}</p>
                    <p><strong>Salary:</strong> ${job.salary}</p>
                    <p>${job.description}</p>
                    <button class="btn" onclick="dashboardManager.applyForJob('${job.id}')">Apply</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading jobs:', error);
            document.getElementById('availableJobs').innerHTML = '<p>Error loading jobs.</p>';
        }
    }

    async loadMyApplications() {
        try {
            const applicationsSnapshot = await getDocs(
                query(collection(db, "applications"), where("employeeId", "==", this.currentUser.uid))
            );
            
            const applications = [];
            applicationsSnapshot.forEach((doc) => {
                applications.push({ id: doc.id, ...doc.data() });
            });

            const applicationsContainer = document.getElementById('myApplications');
            if (applications.length === 0) {
                applicationsContainer.innerHTML = '<p>You haven\'t applied for any jobs yet.</p>';
                return;
            }

            applicationsContainer.innerHTML = applications.map(app => `
                <div class="application-item">
                    <h4>${app.jobTitle}</h4>
                    <p><strong>Status:</strong> <span class="status-${app.status}">${app.status}</span></p>
                    <p><strong>Applied:</strong> ${app.appliedAt.toDate().toLocaleDateString()}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading applications:', error);
            document.getElementById('myApplications').innerHTML = '<p>Error loading applications.</p>';
        }
    }

    async loadPostedJobs() {
        try {
            const jobsSnapshot = await getDocs(
                query(collection(db, "jobs"), where("employerId", "==", this.currentUser.uid))
            );
            
            const jobs = [];
            jobsSnapshot.forEach((doc) => {
                jobs.push({ id: doc.id, ...doc.data() });
            });

            const jobsContainer = document.getElementById('postedJobs');
            if (jobs.length === 0) {
                jobsContainer.innerHTML = '<p>You haven\'t posted any jobs yet.</p>';
                return;
            }

            jobsContainer.innerHTML = jobs.map(job => `
                <div class="job-item">
                    <h4>${job.title}</h4>
                    <p><strong>Category:</strong> ${job.category}</p>
                    <p><strong>Salary:</strong> ${job.salary}</p>
                    <p>${job.description}</p>
                    <button class="btn" onclick="dashboardManager.deleteJob('${job.id}')">Delete</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading posted jobs:', error);
            document.getElementById('postedJobs').innerHTML = '<p>Error loading posted jobs.</p>';
        }
    }

    async loadJobApplications() {
        try {
            // Get all jobs posted by this employer
            const jobsSnapshot = await getDocs(
                query(collection(db, "jobs"), where("employerId", "==", this.currentUser.uid))
            );
            
            const jobIds = jobsSnapshot.docs.map(doc => doc.id);
            
            if (jobIds.length === 0) {
                document.getElementById('jobApplications').innerHTML = '<p>No applications yet.</p>';
                return;
            }

            // Get applications for these jobs
            const applications = [];
            for (const jobId of jobIds) {
                const applicationsSnapshot = await getDocs(
                    query(collection(db, "applications"), where("jobId", "==", jobId))
                );
                
                applicationsSnapshot.forEach((doc) => {
                    applications.push({ id: doc.id, ...doc.data() });
                });
            }

            const applicationsContainer = document.getElementById('jobApplications');
            if (applications.length === 0) {
                applicationsContainer.innerHTML = '<p>No applications yet.</p>';
                return;
            }

            applicationsContainer.innerHTML = applications.map(app => `
                <div class="application-item">
                    <h4>${app.jobTitle}</h4>
                    <p><strong>Applicant:</strong> ${app.employeeName}</p>
                    <p><strong>Email:</strong> ${app.employeeEmail}</p>
                    <p><strong>Status:</strong> <span class="status-${app.status}">${app.status}</span></p>
                    <p><strong>Applied:</strong> ${app.appliedAt.toDate().toLocaleDateString()}</p>
                    ${app.status === 'pending' ? `
                        <button class="btn" onclick="dashboardManager.updateApplicationStatus('${app.id}', 'accepted')">Accept</button>
                        <button class="btn" onclick="dashboardManager.updateApplicationStatus('${app.id}', 'rejected')" style="background: #e74c3c;">Reject</button>
                    ` : ''}
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading job applications:', error);
            document.getElementById('jobApplications').innerHTML = '<p>Error loading applications.</p>';
        }
    }

    async handleJobSubmission(e) {
        e.preventDefault();
        
        const jobData = {
            title: document.getElementById('jobTitle').value,
            description: document.getElementById('jobDescription').value,
            salary: document.getElementById('jobSalary').value,
            category: document.getElementById('jobCategory').value,
            employerId: this.currentUser.uid,
            employerName: this.userProfile.name,
            createdAt: new Date()
        };

        try {
            await addDoc(collection(db, "jobs"), jobData);
            alert('Job posted successfully!');
            document.getElementById('jobForm').reset();
            this.loadPostedJobs();
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Error posting job. Please try again.');
        }
    }

    async applyForJob(jobId) {
        try {
            // Get job details
            const jobDoc = await getDoc(doc(db, "jobs", jobId));
            if (!jobDoc.exists()) {
                alert('Job not found.');
                return;
            }

            const jobData = jobDoc.data();
            
            // Check if already applied
            const existingApplication = await getDocs(
                query(collection(db, "applications"), 
                    where("jobId", "==", jobId),
                    where("employeeId", "==", this.currentUser.uid))
            );

            if (!existingApplication.empty) {
                alert('You have already applied for this job.');
                return;
            }

            // Create application
            const applicationData = {
                jobId: jobId,
                jobTitle: jobData.title,
                employeeId: this.currentUser.uid,
                employeeName: this.userProfile.name,
                employeeEmail: this.currentUser.email,
                status: 'pending',
                appliedAt: new Date()
            };

            await addDoc(collection(db, "applications"), applicationData);
            alert('Application submitted successfully!');
            this.loadMyApplications();
        } catch (error) {
            console.error('Error applying for job:', error);
            alert('Error applying for job. Please try again.');
        }
    }

    async updateApplicationStatus(applicationId, status) {
        try {
            await updateDoc(doc(db, "applications", applicationId), {
                status: status
            });
            alert(`Application ${status} successfully!`);
            this.loadJobApplications();
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('Error updating application status. Please try again.');
        }
    }

    async deleteJob(jobId) {
        if (confirm('Are you sure you want to delete this job?')) {
            try {
                // Note: In a real app, you'd want to use deleteDoc from Firestore
                // For now, we'll just mark it as deleted
                await updateDoc(doc(db, "jobs", jobId), {
                    deleted: true
                });
                alert('Job deleted successfully!');
                this.loadPostedJobs();
            } catch (error) {
                console.error('Error deleting job:', error);
                alert('Error deleting job. Please try again.');
            }
        }
    }
}

// Global functions for onclick handlers
window.toggleJobForm = function() {
    const form = document.getElementById('jobForm');
    form.classList.toggle('active');
};

// Initialize dashboard
window.dashboardManager = new DashboardManager(); 