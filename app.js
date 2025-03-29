// PersonaHealth App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global variables
let currentUser = null;
let conversationHistory = [];
let medications = [];
let symptoms = [];
let appointments = [];

// Application initialization
function initApp() {
    // For demo purposes, we'll show the login screen by default
    // and provide a way to simulate login
    setupAuthFunctionality();
    
    // Setup navigation between views
    setupNavigation();
    
    // Setup the chat functionality
    setupChatFunctionality();
    
    // Setup medication management functionality
    setupMedicationManagement();
    
    // Setup symptom tracking functionality
    setupSymptomTracking();
    
    // Setup appointment functionality
    setupAppointmentManagement();
    
    // Setup modals
    setupModals();
    
    // Initialize demo data
    loadDemoData();
}

// Authentication setup
function setupAuthFunctionality() {
    // Tab switching for login/register
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked tab
            btn.classList.add('active');
            
            // Show corresponding form
            const forms = document.querySelectorAll('.auth-form');
            forms.forEach(form => form.classList.remove('active'));
            
            const targetForm = document.getElementById(`${btn.dataset.tab}-form`);
            targetForm.classList.add('active');
        });
    });
    
    // Login button functionality
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', handleLogin);
    
    // Register button functionality
    const registerBtn = document.getElementById('register-btn');
    registerBtn.addEventListener('click', handleRegistration);
    
    // Logout button functionality
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', handleLogout);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // In a real app, you would validate credentials with a backend
    // For the demo, we'll just simulate a successful login
    
    if (email && password) {
        // Create a user object (this would normally come from the backend)
        currentUser = {
            id: '123456',
            name: 'John Doe',
            email: email,
            healthConditions: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol']
        };
        
        // Show the main application
        document.getElementById('auth-container').classList.remove('active');
        document.getElementById('main-container').classList.add('active');
        
        // Update UI with user info
        updateUserInfo();
        
        // Welcome message in chat
        addBotMessage(`Hi ${currentUser.name.split(' ')[0]}! Welcome back to PersonaHealth. How can I help you today?`);
    } else {
        alert('Please enter both email and password.');
    }
}

function handleRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const healthConditions = document.getElementById('health-conditions').value;
    
    // In a real app, you would send this data to a backend
    // For the demo, we'll just simulate a successful registration
    
    if (name && email && password) {
        // Create a user object
        currentUser = {
            id: '123456',
            name: name,
            email: email,
            healthConditions: healthConditions ? healthConditions.split(',').map(c => c.trim()) : []
        };
        
        // Show the main application
        document.getElementById('auth-container').classList.remove('active');
        document.getElementById('main-container').classList.add('active');
        
        // Update UI with user info
        updateUserInfo();
        
        // Welcome message in chat
        addBotMessage(`Hi ${currentUser.name.split(' ')[0]}! Welcome to PersonaHealth. I'm your personal health companion. Would you like me to explain how I can help you manage your health?`);
    } else {
        alert('Please fill in all required fields.');
    }
}

function handleLogout() {
    // Reset user data
    currentUser = null;
    
    // Clear all forms
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('health-conditions').value = '';
    
    // Show login screen
    document.getElementById('main-container').classList.remove('active');
    document.getElementById('auth-container').classList.add('active');
    
    // Reset chat
    document.getElementById('chat-messages').innerHTML = '';
    conversationHistory = [];
}

function updateUserInfo() {
    // Update user name in sidebar
    document.getElementById('user-name').textContent = currentUser.name;
    
    // Update greeting
    document.getElementById('greeting-name').textContent = currentUser.name.split(' ')[0];
}

// Navigation setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the target view
            const targetId = this.getAttribute('href').substring(1);
            const targetView = document.getElementById(`${targetId}-view`);
            
            // Hide all views
            const views = document.querySelectorAll('.view');
            views.forEach(view => view.classList.remove('active'));
            
            // Show target view
            targetView.classList.add('active');
        });
    });
}

// Chat functionality
function setupChatFunctionality() {
    const sendButton = document.getElementById('send-message');
    const messageInput = document.getElementById('user-message');
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const messageInput = document.getElementById('user-message');
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        // Add user message to chat
        addUserMessage(messageText);
        
        // Clear input
        messageInput.value = '';
        
        // Process message and get response
        processUserMessage(messageText);
    }
}

function addUserMessage(text) {
    const chatMessages = document.getElementById('chat-messages');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageHTML = `
        <div class="message user">
            <div class="message-content">
                <p>${text}</p>
            </div>
            <span class="timestamp">${timeString}</span>
        </div>
    `;
    
    chatMessages.innerHTML += messageHTML;
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: text,
        timestamp: now
    });
}

function addBotMessage(text) {
    const chatMessages = document.getElementById('chat-messages');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const messageHTML = `
        <div class="message bot">
            <div class="message-content">
                <p>${text}</p>
            </div>
            <span class="timestamp">${timeString}</span>
        </div>
    `;
    
    chatMessages.innerHTML += messageHTML;
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to conversation history
    conversationHistory.push({
        role: 'assistant',
        content: text,
        timestamp: now
    });
}

// This is a simplified version of what would normally be handled by GPT mini API
function processUserMessage(message) {
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate API delay
    setTimeout(() => {
        // Remove typing indicator
        hideTypingIndicator();
        
        // Generate response based on keywords in the message
        let response;
        
        if (message.toLowerCase().includes('medication') || message.toLowerCase().includes('medicine') || message.toLowerCase().includes('pill')) {
            response = generateMedicationResponse(message);
        } else if (message.toLowerCase().includes('symptom') || message.toLowerCase().includes('feel') || message.toLowerCase().includes('pain') || message.toLowerCase().includes('headache')) {
            response = generateSymptomResponse(message);
        } else if (message.toLowerCase().includes('appointment') || message.toLowerCase().includes('doctor') || message.toLowerCase().includes('visit')) {
            response = generateAppointmentResponse(message);
        } else {
            response = generateGeneralResponse(message);
        }
        
        // Add bot response to chat
        addBotMessage(response);
        
        // If the message is about symptoms and seems to be reporting one, suggest tracking it
        if ((message.toLowerCase().includes('feel') || message.toLowerCase().includes('pain') || 
             message.toLowerCase().includes('headache') || message.toLowerCase().includes('nausea')) && 
            !message.toLowerCase().includes('?')) {
            setTimeout(() => {
                addBotMessage("Would you like to add this to your symptom journal? It helps me track patterns over time.");
            }, 1000);
        }
        
    }, 1500); // Simulate API delay
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    
    // Create typing indicator element
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <p>...</p>
        </div>
    `;
    
    // Add to chat
    chatMessages.appendChild(typingIndicator);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateMedicationResponse(message) {
    // This would be handled by the GPT mini API in a real implementation
    // For demo, we'll use some predefined responses based on keywords
    
    if (message.toLowerCase().includes('remind')) {
        return "I can help you set up medication reminders. Just let me know which medication you'd like to be reminded about and when you need to take it.";
    } else if (message.toLowerCase().includes('side effect')) {
        return "Side effects can be concerning. I can help you understand common side effects of your medications, but it's always best to consult your healthcare provider about any new or concerning symptoms.";
    } else if (message.toLowerCase().includes('forget') || message.toLowerCase().includes('missed')) {
        return "If you missed a dose, it's important to follow your doctor's guidance. For most medications, take it as soon as you remember unless it's almost time for the next dose. Would you like me to look up specific guidance for one of your medications?";
    } else if (message.toLowerCase().includes('lisinopril')) {
        return "Lisinopril is an ACE inhibitor used to treat high blood pressure and heart failure. It works by relaxing blood vessels, which lowers blood pressure and increases blood flow. Remember to take it at the same time each day, and let your doctor know if you experience a persistent dry cough, which is a common side effect.";
    } else if (message.toLowerCase().includes('metformin')) {
        return "Metformin is a medication used to treat type 2 diabetes. It works by reducing glucose production in the liver and increasing insulin sensitivity. Taking it with food can help reduce gastrointestinal side effects. Your current prescription is 500mg twice daily.";
    } else if (message.toLowerCase().includes('atorvastatin')) {
        return "Atorvastatin (Lipitor) is a statin medication that helps lower cholesterol levels. It's best taken at the same time each day, and many people take it in the evening because the body produces more cholesterol at night. If you experience muscle pain, weakness, or tenderness, please consult your doctor immediately.";
    } else {
        return "I see you're asking about medication. I can help you keep track of your medications, provide information about them, and set reminders. What specific information about your medications would you like to know?";
    }
}

function generateSymptomResponse(message) {
    if (message.toLowerCase().includes('headache')) {
        return "I'm sorry to hear you're experiencing a headache. Based on your symptom history, your headaches often occur in the afternoon. Would you like me to add this to your symptom journal? Also, have you taken any medication for it?";
    } else if (message.toLowerCase().includes('tired') || message.toLowerCase().includes('fatigue')) {
        return "Fatigue can be caused by many factors including stress, poor sleep, or could be related to your medications. I notice you've reported fatigue several times this month. Would you like me to help you track possible patterns or triggers?";
    } else if (message.toLowerCase().includes('dizzy') || message.toLowerCase().includes('dizziness')) {
        return "Dizziness can sometimes be a side effect of blood pressure medications like Lisinopril. If you're experiencing this often or severely, you should contact your doctor. Would you like me to make a note of this for your upcoming appointment with Dr. Johnson?";
    } else if (message.toLowerCase().includes('nausea')) {
        return "Nausea can sometimes be a side effect of Metformin, especially when first starting the medication. Taking it with food can help. I'll add this to your symptom journal. If it persists or worsens, you should contact your healthcare provider.";
    } else if (message.toLowerCase().includes('track') || message.toLowerCase().includes('journal')) {
        return "Tracking your symptoms helps identify patterns and potential triggers. You can log symptoms through our journal feature, rate the intensity, and add notes about possible triggers. Would you like me to show you how to log a new symptom?";
    } else {
        return "I understand you're experiencing some symptoms. Tracking these can help identify patterns over time. Would you like to add this to your symptom journal? The more information you provide, the better I can help identify possible causes and solutions.";
    }
}

function generateAppointmentResponse(message) {
    if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('book')) {
        return "I can help you prepare for booking an appointment. What type of healthcare provider would you like to see? Once you've booked it, you can add it to your calendar here, and I'll help you prepare for the visit.";
    } else if (message.toLowerCase().includes('prepare')) {
        return "To prepare for your appointment, I can help you create a list of symptoms, questions, and concerns to discuss with your doctor. I'll also summarize your medication adherence and symptom patterns. Would you like to start preparing for your upcoming appointment with Dr. Johnson on April 10?";
    } else if (message.toLowerCase().includes('johnson')) {
        return "Your appointment with Dr. Sarah Johnson is scheduled for April 10 at 2:30 PM at Memorial Medical Center, Suite 302. This is for your annual diabetes management review. Would you like to start preparing topics to discuss?";
    } else if (message.toLowerCase().includes('chen')) {
        return "Your appointment with Dr. Michael Chen is scheduled for May 15. This is a follow-up for your cardiology check-up. As we get closer to the date, I can help you prepare questions and summarize relevant health information to discuss.";
    } else {
        return "I can help you manage your healthcare appointments, prepare for your visits, and make the most of your time with your healthcare providers. Would you like me to show you your upcoming appointments or help you prepare for a specific visit?";
    }
}

function generateGeneralResponse(message) {
    // Simple pattern matching for general health questions
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi ')) {
        return `Hello! How are you feeling today?`;
    } else if (message.toLowerCase().includes('how are you')) {
        return "I'm here and ready to help you with your health needs. How can I assist you today?";
    } else if (message.toLowerCase().includes('thank')) {
        return "You're welcome! I'm here to help make managing your health easier. Is there anything else you'd like to know?";
    } else if (message.toLowerCase().includes('help')) {
        return `I can help you with several things:
        1. Medication reminders and information
        2. Tracking and analyzing symptoms
        3. Preparing for doctor appointments
        4. Answering health-related questions
        
        What would you like help with today?`;
    } else if (message.toLowerCase().includes('diabetes')) {
        return "Managing diabetes effectively involves monitoring blood sugar, taking medications as prescribed, maintaining a healthy diet, and regular exercise. Would you like specific information about any of these areas?";
    } else if (message.toLowerCase().includes('blood pressure') || message.toLowerCase().includes('hypertension')) {
        return "Maintaining healthy blood pressure is important for your heart health. Your Lisinopril medication helps with this, but lifestyle factors like reducing sodium intake, regular exercise, and stress management are also important. Would you like more specific information about any of these approaches?";
    } else if (message.toLowerCase().includes('cholesterol')) {
        return "Managing cholesterol involves both medication (like your Atorvastatin) and lifestyle approaches. A diet low in saturated fats, regular exercise, and maintaining a healthy weight all contribute to better cholesterol levels. Would you like to discuss specific strategies?";
    } else if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('eat')) {
        return "A balanced diet is key for managing your conditions. For diabetes and heart health, focus on vegetables, lean proteins, whole grains, and healthy fats. Limit processed foods, sugary items, and high-sodium foods. Would you like more specific dietary recommendations?";
    } else if (message.toLowerCase().includes('exercise')) {
        return "Regular physical activity is beneficial for all your health conditions. The American Heart Association recommends at least 150 minutes of moderate activity per week. Even short walks can be beneficial. Would you like some suggestions for exercises that might work for you?";
    } else {
        // Generic response
        return "I'm your personal health companion, designed to help you manage your health conditions, medications, and healthcare journey. I can provide information, reminders, and help you prepare for medical appointments. How can I assist you today?";
    }
}

// Medication Management
function setupMedicationManagement() {
    // Setup take now buttons
    document.querySelectorAll('.take-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const medicationItem = this.closest('.medication-item');
            const medicationStatus = medicationItem.querySelector('.medication-status');
            
            // Update status to completed
            medicationStatus.innerHTML = '<i class="fas fa-check-circle"></i>';
            medicationStatus.classList.add('completed');
            
            // Add message to chat
            const medicationName = medicationItem.querySelector('.medication-name').textContent;
            addBotMessage(`Great! I've recorded that you've taken your ${medicationName}. Keep up the good work!`);
        });
    });
    
    // Setup add medication button
    document.getElementById('add-medication').addEventListener('click', function() {
        showModal('add-medication-modal');
    });
    
    document.getElementById('add-med-btn').addEventListener('click', function() {
        showModal('add-medication-modal');
    });
    
    // Setup FDA lookup
    document.getElementById('lookup-med').addEventListener('click', function() {
        const medName = document.getElementById('med-name').value.trim();
        
        if (medName) {
            // Show FDA results section
            const fdaResults = document.getElementById('fda-results');
            fdaResults.classList.remove('hidden');
            
            // Show loading spinner
            const loadingSpinner = fdaResults.querySelector('.loading-spinner');
            loadingSpinner.style.display = 'block';
            
            // Hide previous content
            const fdaContent = fdaResults.querySelector('.fda-content');
            fdaContent.style.display = 'none';
            
            // Simulate API call to OpenFDA
            setTimeout(() => {
                // Hide loading spinner
                loadingSpinner.style.display = 'none';
                
                // Show FDA content
                fdaContent.style.display = 'block';
                
                // Populate with mock data
                if (medName.toLowerCase().includes('lisinopril')) {
                    fdaContent.innerHTML = `
                        <h4>Lisinopril</h4>
                        <p><strong>Drug Class:</strong> ACE Inhibitor</p>
                        <p><strong>Primary Use:</strong> Treatment of hypertension and heart failure</p>
                        <p><strong>Common Side Effects:</strong> Dry cough, dizziness, headache, fatigue</p>
                        <p><strong>Serious Side Effects:</strong> Swelling of face/lips/tongue/throat, difficulty breathing (seek immediate medical attention)</p>
                        <p><strong>Interactions:</strong> May interact with potassium supplements, salt substitutes containing potassium, or diuretics</p>
                    `;
                } else if (medName.toLowerCase().includes('metformin')) {
                    fdaContent.innerHTML = `
                        <h4>Metformin</h4>
                        <p><strong>Drug Class:</strong> Biguanide</p>
                        <p><strong>Primary Use:</strong> Treatment of type 2 diabetes</p>
                        <p><strong>Common Side Effects:</strong> Nausea, vomiting, diarrhea, stomach pain, metallic taste</p>
                        <p><strong>Serious Side Effects:</strong> Lactic acidosis (rare but serious) - symptoms include muscle pain, difficulty breathing, unusual drowsiness</p>
                        <p><strong>Interactions:</strong> May interact with certain contrast dyes used for X-rays and CT scans</p>
                    `;
                } else if (medName.toLowerCase().includes('atorvastatin') || medName.toLowerCase().includes('lipitor')) {
                    fdaContent.innerHTML = `
                        <h4>Atorvastatin (Lipitor)</h4>
                        <p><strong>Drug Class:</strong> Statin</p>
                        <p><strong>Primary Use:</strong> Lowering cholesterol and triglycerides</p>
                        <p><strong>Common Side Effects:</strong> Muscle and joint pain, headache, nausea, diarrhea</p>
                        <p><strong>Serious Side Effects:</strong> Severe muscle pain/weakness/tenderness, liver problems</p>
                        <p><strong>Interactions:</strong> May interact with grapefruit juice, certain antibiotics, antifungals, and other medications</p>
                    `;
                } else {
                    fdaContent.innerHTML = `
                        <p>No specific information found for "${medName}" in the OpenFDA database. Please check the spelling or try a different medication name.</p>
                    `;
                }
            }, 2000); // Simulate API delay
        } else {
            alert('Please enter a medication name to search.');
        }
    });
    
    // Setup expandable medication info
    document.querySelectorAll('.read-more').forEach(btn => {
        btn.addEventListener('click', function() {
            const expandedContent = this.nextElementSibling;
            
            if (expandedContent.style.display === 'block') {
                expandedContent.style.display = 'none';
                this.textContent = 'Read more';
            } else {
                expandedContent.style.display = 'block';
                this.textContent = 'Read less';
            }
        });
    });
    
    // Save medication button
    document.querySelector('.save-medication').addEventListener('click', function() {
        const medName = document.getElementById('med-name').value.trim();
        const medDosage = document.getElementById('med-dosage').value.trim();
        const medSchedule = document.getElementById('med-schedule').value;
        const medTime = document.getElementById('med-time').value;
        const medNotes = document.getElementById('med-notes').value.trim();
        
        if (medName && medDosage) {
            // In a real app, this would be sent to the backend
            // For the demo, we'll just show a success message
            
            alert(`Medication "${medName}" added successfully!`);
            
            // Close modal
            hideModal('add-medication-modal');
            
            // Reset form
            document.getElementById('med-name').value = '';
            document.getElementById('med-dosage').value = '';
            document.getElementById('med-time').value = '';
            document.getElementById('med-notes').value = '';
            document.getElementById('fda-results').classList.add('hidden');
            
            // Add confirmation message to chat
            addBotMessage(`I've added ${medName} ${medDosage} to your medication list. I'll remind you to take it ${medSchedule} at ${formatTime(medTime)}.`);
        } else {
            alert('Please enter at least the medication name and dosage.');
        }
    });
}

function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
}

// Symptom Tracking
function setupSymptomTracking() {
    // Setup symptom buttons
    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.symptom-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Setup log symptoms button
    document.getElementById('log-symptoms').addEventListener('click', function() {
        showModal('log-symptom-modal');
    });
    
    document.getElementById('log-new-symptom').addEventListener('click', function() {
        showModal('log-symptom-modal');
    });
    
    // Save symptoms button
    document.querySelector('.save-symptoms').addEventListener('click', function() {
        // Get selected feeling
        let feeling = '';
        document.querySelectorAll('input[name="feeling"]').forEach(input => {
            if (input.checked) {
                feeling = input.value;
            }
        });
        
        // Get selected symptoms
        const selectedSymptoms = [];
        document.querySelectorAll('input[name="symptom-type"]').forEach(input => {
            if (input.checked) {
                selectedSymptoms.push(input.value);
            }
        });
        
        const intensity = document.getElementById('symptom-intensity').value;
        const notes = document.getElementById('symptom-notes').value.trim();
        
        if (feeling && selectedSymptoms.length > 0) {
            // In a real app, this would be sent to the backend
            // For the demo, we'll just show a success message
            
            alert('Symptoms logged successfully!');
            
            // Close modal
            hideModal('log-symptom-modal');
            
            // Reset form
            document.querySelectorAll('input[name="feeling"]').forEach(input => {
                input.checked = false;
            });
            
            document.querySelectorAll('input[name="symptom-type"]').forEach(input => {
                input.checked = false;
            });
            
            document.getElementById('symptom-intensity').value = 5;
            document.getElementById('symptom-notes').value = '';
            document.getElementById('symptom-factors').value = '';
            
            // Add confirmation message to chat
            let intensityWord = 'moderate';
            if (intensity < 4) intensityWord = 'mild';
            if (intensity > 7) intensityWord = 'severe';
            
            addBotMessage(`I've logged your ${intensityWord} ${selectedSymptoms.join(', ')}. Thank you for keeping your symptom journal updated. This helps us identify patterns over time.`);
        } else {
            alert('Please select how you feel and at least one symptom type.');
        }
    });
}

// Appointment Management
function setupAppointmentManagement() {
    // Setup prepare buttons
    document.querySelectorAll('.prepare-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, this would load the specific appointment data
            // For the demo, we'll just show the preparation section
            
            // If this is on the dashboard, navigate to appointments view
            if (document.getElementById('dashboard-view').classList.contains('active')) {
                // Click the appointments nav item
                document.querySelector('a[href="#appointments"]').click();
            }
        });
    });
    
    // Setup expand buttons for appointment items
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            
            if (appointmentItem.classList.contains('expanded')) {
                appointmentItem.classList.remove('expanded');
                this.innerHTML = '<i class="fas fa-chevron-down"></i>';
            } else {
                // Remove expanded class from all items
                document.querySelectorAll('.appointment-item').forEach(item => {
                    item.classList.remove('expanded');
                });
                
                // Reset all expand buttons
                document.querySelectorAll('.expand-btn').forEach(b => {
                    b.innerHTML = '<i class="fas fa-chevron-down"></i>';
                });
                
                // Expand this item
                appointmentItem.classList.add('expanded');
                this.innerHTML = '<i class="fas fa-chevron-up"></i>';
            }
        });
    });
    
    // Setup add appointment button
    document.getElementById('add-appointment').addEventListener('click', function() {
        alert('This feature would allow you to add a new appointment to your calendar. For the demo, this functionality is not implemented.');
    });
}

// Modal functionality
function setupModals() {
    // Close buttons
    document.querySelectorAll('.close-modal, .cancel-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            // Find parent modal
            const modal = this.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    // Close on outside click
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Demo data
function loadDemoData() {
    // In a real app, this data would come from a backend
    // For the demo, we'll use hardcoded data
    
    medications = [
        {
            id: 1,
            name: 'Lisinopril',
            dosage: '20mg',
            schedule: 'Daily',
            time: '08:00',
            instructions: '1 tablet, with food',
            purpose: 'Blood pressure management',
            status: 'active'
        },
        {
            id: 2,
            name: 'Metformin',
            dosage: '500mg',
            schedule: 'Twice Daily',
            time: ['08:00', '13:00'],
            instructions: '1 tablet, with meals',
            purpose: 'Diabetes management',
            status: 'active'
        },
        {
            id: 3,
            name: 'Atorvastatin',
            dosage: '10mg',
            schedule: 'Daily',
            time: '20:00',
            instructions: '1 tablet, before bed',
            purpose: 'Cholesterol management',
            status: 'active'
        }
    ];
    
    symptoms = [
        {
            id: 1,
            date: '2025-03-28',
            types: ['Headache', 'Nausea'],
            description: 'Started after lunch, lasted about 2 hours. Took acetaminophen which helped with the headache.',
            intensity: 'medium',
            intensityValue: 6,
            triggers: 'Possibly related to stress at work'
        },
        {
            id: 2,
            date: '2025-03-25',
            types: ['Fatigue', 'Dizziness'],
            description: 'Felt tired all day, especially after walking up stairs. Also experienced some dizziness when standing up quickly.',
            intensity: 'high',
            intensityValue: 8,
            triggers: 'Not enough sleep the night before'
        },
        {
            id: 3,
            date: '2025-03-22',
            types: ['Pain', 'Joint'],
            description: 'Experienced pain in right knee after walking for about 30 minutes. Subsided with rest and ice pack.',
            intensity: 'low',
            intensityValue: 3,
            triggers: 'Walking more than usual'
        }
    ];
    
    appointments = [
        {
            id: 1,
            doctor: 'Dr. Sarah Johnson',
            specialty: 'Endocrinology',
            purpose: 'Annual Checkup',
            date: '2025-04-10',
            time: '14:30',
            location: 'Memorial Medical Center, Suite 302',
            notes: 'Annual diabetes management review'
        },
        {
            id: 2,
            doctor: 'Dr. Michael Chen',
            specialty: 'Cardiology',
            purpose: 'Follow-up',
            date: '2025-05-15',
            time: '10:00',
            location: 'Heart Institute, Building B, Room 204',
            notes: 'Review blood pressure management and medication efficacy'
        }
    ];
}

// Progressive Web App functionality
// This would be expanded in a real implementation
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Create a simple manifest.json file for PWA support
// This would be a separate file in a real implementation
const manifestJSON = {
    "name": "PersonaHealth",
    "short_name": "PersonaHealth",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#4CAF50",
    "icons": [
        {
            "src": "icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
};

// In a real implementation, this would be written to a file
// For the demo, we'll just log it
console.log('Manifest.json would contain:', manifestJSON);

// OpenFDA API Integration
// This would be implemented in a real application
// For the demo, we'll just show how it would be structured

class OpenFDAService {
    constructor() {
        this.baseUrl = 'https://api.fda.gov/drug';
    }
    
    // Get drug information by name
    async getDrugByName(name) {
        // In a real implementation, this would make an API call
        // For the demo, we'll just return mock data
        
        console.log(`Would call: ${this.baseUrl}/label.json?search=openfda.brand_name:"${name}" OR openfda.generic_name:"${name}"&limit=1`);
        
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock data
        if (name.toLowerCase().includes('lisinopril')) {
            return this.getMockLisinoprilData();
        } else if (name.toLowerCase().includes('metformin')) {
            return this.getMockMetforminData();
        } else if (name.toLowerCase().includes('atorvastatin') || name.toLowerCase().includes('lipitor')) {
            return this.getMockAtorvastatinData();
        } else {
            return { error: 'Drug not found' };
        }
    }
    
    // Get adverse events for a drug
    async getAdverseEvents(name) {
        console.log(`Would call: ${this.baseUrl}/event.json?search=patient.drug.medicinalproduct:"${name}"&count=patient.reaction.reactionmeddrapt.exact&limit=10`);
        
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock data
        return {
            results: [
                { term: 'Headache', count: 1245 },
                { term: 'Dizziness', count: 987 },
                { term: 'Nausea', count: 876 },
                { term: 'Fatigue', count: 654 },
                { term: 'Cough', count: 543 }
            ]
        };
    }
    
    // Check for drug recalls
    async checkRecalls(name) {
        console.log(`Would call: ${this.baseUrl}/enforcement.json?search=openfda.brand_name:"${name}" OR openfda.generic_name:"${name}"&limit=1`);
        
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock data (no recalls for demo)
        return { results: [] };
    }
    
    // Mock data methods
    getMockLisinoprilData() {
        return {
            results: [{
                openfda: {
                    brand_name: ['Prinivil', 'Zestril'],
                    generic_name: ['Lisinopril'],
                    manufacturer_name: ['Merck', 'AstraZeneca'],
                    product_type: ['Human Prescription Drug']
                },
                indications_and_usage: ['Treatment of hypertension, heart failure, and acute myocardial infarction'],
                dosage_and_administration: ['Initial dose: 10 mg once daily. Adjust based on patient response. Maintenance dose: 20-40 mg once daily.'],
                warnings: ['Anaphylactoid reactions, head and neck angioedema, intestinal angioedema, hypotension, hyperkalemia, hepatic failure'],
                adverse_reactions: ['Headache, dizziness, cough, hypotension, diarrhea, nausea, fatigue'],
                drug_interactions: ['Diuretics, potassium supplements, lithium, NSAIDs, dual inhibition of RAAS']
            }]
        };
    }
    
    getMockMetforminData() {
        return {
            results: [{
                openfda: {
                    brand_name: ['Glucophage', 'Glucophage XR'],
                    generic_name: ['Metformin Hydrochloride'],
                    manufacturer_name: ['Bristol-Myers Squibb'],
                    product_type: ['Human Prescription Drug']
                },
                indications_and_usage: ['Adjunct to diet and exercise to improve glycemic control in adults and children with type 2 diabetes mellitus'],
                dosage_and_administration: ['Initial dose: 500 mg twice daily or 850 mg once daily. Increase in increments of 500 mg weekly or 850 mg every 2 weeks.'],
                warnings: ['Lactic acidosis, hypoglycemia, vitamin B12 deficiency, contraindicated in renal disease'],
                adverse_reactions: ['Diarrhea, nausea, vomiting, flatulence, asthenia, indigestion, abdominal discomfort, headache'],
                drug_interactions: ['Cationic drugs, alcohol, iodinated contrast materials, carbonic anhydrase inhibitors']
            }]
        };
    }
    
    getMockAtorvastatinData() {
        return {
            results: [{
                openfda: {
                    brand_name: ['Lipitor'],
                    generic_name: ['Atorvastatin Calcium'],
                    manufacturer_name: ['Pfizer'],
                    product_type: ['Human Prescription Drug']
                },
                indications_and_usage: ['To reduce the risk of cardiovascular disease events and as an adjunct therapy to diet for hyperlipidemia'],
                dosage_and_administration: ['Initial dose: 10-20 mg once daily. Maintenance dose: 10-80 mg once daily.'],
                warnings: ['Myopathy, rhabdomyolysis, liver enzyme abnormalities, endocrine effects'],
                adverse_reactions: ['Nasopharyngitis, arthralgia, diarrhea, pain in extremity, urinary tract infection, muscle spasms'],
                drug_interactions: ['Strong CYP3A4 inhibitors, grapefruit juice, cyclosporine, gemfibrozil, oral contraceptives, digoxin']
            }]
        };
    }
}

// Initialize OpenFDA service
const openFDAService = new OpenFDAService();

// Example of how the OpenFDA service would be used in a real implementation
async function lookupMedicationExample(medicationName) {
    try {
        const drugInfo = await openFDAService.getDrugByName(medicationName);
        console.log('Drug information:', drugInfo);
        
        const adverseEvents = await openFDAService.getAdverseEvents(medicationName);
        console.log('Adverse events:', adverseEvents);
        
        const recalls = await openFDAService.checkRecalls(medicationName);
        console.log('Recalls:', recalls);
        
        // Process and display this information in the UI
    } catch (error) {
        console.error('Error looking up medication:', error);
    }
}

// For demo purposes, log an example lookup
console.log('Example of how OpenFDA API would be used:');
lookupMedicationExample('Lisinopril');

// Settings View Functionality
function setupSettingsView() {
    // Get the settings view
    const settingsView = document.getElementById('settings-view');
    
    // If we don't have a settings view in the HTML yet, let's create one
    if (!settingsView) {
        createSettingsView();
    } else {
        // Setup profile update functionality
        setupProfileSettings();
        
        // Setup notification preferences
        setupNotificationPreferences();
        
        // Setup data management functions
        setupDataManagement();
        
        // Setup integration settings
        setupIntegrationSettings();
    }
}

function createSettingsView() {
    // Create settings view container
    const settingsView = document.createElement('div');
    settingsView.id = 'settings-view';
    settingsView.className = 'view';
    
    // Create settings view content
    settingsView.innerHTML = `
        <div class="header">
            <h1>Settings</h1>
        </div>
        
        <div class="settings-container">
            <div class="settings-nav">
                <a href="#profile" class="settings-nav-item active">Profile</a>
                <a href="#notifications" class="settings-nav-item">Notifications</a>
                <a href="#data" class="settings-nav-item">Data Management</a>
                <a href="#integrations" class="settings-nav-item">Integrations</a>
                <a href="#about" class="settings-nav-item">About</a>
            </div>
            
            <div class="settings-content">
                <!-- Profile Settings Section -->
                <div id="profile-settings" class="settings-section active">
                    <h2>Profile Settings</h2>
                    
                    <div class="profile-header">
                        <div class="profile-image">
                            <img src="https://api.placeholder.com/150/150" alt="Profile Picture">
                            <button class="change-image-btn"><i class="fas fa-camera"></i></button>
                        </div>
                        
                        <div class="profile-info">
                            <h3 id="profile-name">John Doe</h3>
                            <p id="profile-email">john.doe@example.com</p>
                        </div>
                    </div>
                    
                    <div class="settings-form">
                        <div class="input-group">
                            <label for="profile-name-input">Full Name</label>
                            <input type="text" id="profile-name-input" value="John Doe">
                        </div>
                        
                        <div class="input-group">
                            <label for="profile-email-input">Email</label>
                            <input type="email" id="profile-email-input" value="john.doe@example.com">
                        </div>
                        
                        <div class="input-group">
                            <label for="profile-phone-input">Phone</label>
                            <input type="tel" id="profile-phone-input" placeholder="Your phone number">
                        </div>
                        
                        <div class="input-group">
                            <label for="profile-password-input">Change Password</label>
                            <input type="password" id="profile-password-input" placeholder="New password">
                        </div>
                        
                        <h3>Health Information</h3>
                        
                        <div class="input-group">
                            <label for="profile-conditions">Health Conditions</label>
                            <input type="text" id="profile-conditions" value="Type 2 Diabetes, Hypertension, High Cholesterol">
                            <p class="input-help">Separate multiple conditions with commas</p>
                        </div>
                        
                        <div class="input-group">
                            <label for="profile-allergies">Allergies</label>
                            <input type="text" id="profile-allergies" placeholder="Enter allergies">
                            <p class="input-help">Separate multiple allergies with commas</p>
                        </div>
                        
                        <div class="input-group">
                            <label for="profile-doctor">Primary Doctor</label>
                            <input type="text" id="profile-doctor" placeholder="Your primary doctor's name">
                        </div>
                        
                        <button id="save-profile" class="primary-btn">Save Changes</button>
                    </div>
                </div>
                
                <!-- Notifications Settings Section -->
                <div id="notifications-settings" class="settings-section">
                    <h2>Notification Preferences</h2>
                    
                    <div class="settings-form">
                        <div class="toggle-group">
                            <label for="notification-medications">Medication Reminders</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="notification-medications" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="toggle-group">
                            <label for="notification-symptoms">Symptom Check-ins</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="notification-symptoms" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="toggle-group">
                            <label for="notification-appointments">Appointment Reminders</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="notification-appointments" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="toggle-group">
                            <label for="notification-insights">Health Insights</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="notification-insights" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <h3>Reminder Timing</h3>
                        
                        <div class="input-group">
                            <label for="reminder-medications">Medication Reminders</label>
                            <select id="reminder-medications">
                                <option value="0">At scheduled time</option>
                                <option value="5">5 minutes before</option>
                                <option value="10">10 minutes before</option>
                                <option value="15">15 minutes before</option>
                                <option value="30">30 minutes before</option>
                            </select>
                        </div>
                        
                        <div class="input-group">
                            <label for="reminder-appointments">Appointment Reminders</label>
                            <select id="reminder-appointments">
                                <option value="0">At scheduled time</option>
                                <option value="30">30 minutes before</option>
                                <option value="60">1 hour before</option>
                                <option value="120">2 hours before</option>
                                <option value="1440">1 day before</option>
                            </select>
                        </div>
                        
                        <button id="save-notifications" class="primary-btn">Save Preferences</button>
                    </div>
                </div>
                
                <!-- Data Management Section -->
                <div id="data-management" class="settings-section">
                    <h2>Data Management</h2>
                    
                    <div class="data-actions">
                        <div class="data-action-card">
                            <div class="card-icon"><i class="fas fa-download"></i></div>
                            <div class="card-content">
                                <h3>Export Your Data</h3>
                                <p>Download all your health data in a secure format</p>
                                <button id="export-data" class="secondary-btn">Export Data</button>
                            </div>
                        </div>
                        
                        <div class="data-action-card">
                            <div class="card-icon"><i class="fas fa-upload"></i></div>
                            <div class="card-content">
                                <h3>Import Data</h3>
                                <p>Upload previously exported data</p>
                                <button id="import-data" class="secondary-btn">Import Data</button>
                            </div>
                        </div>
                        
                        <div class="data-action-card">
                            <div class="card-icon"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-content">
                                <h3>Delete Account</h3>
                                <p>Permanently delete your account and all data</p>
                                <button id="delete-account" class="danger-btn">Delete Account</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="data-privacy">
                        <h3>Privacy Settings</h3>
                        
                        <div class="toggle-group">
                            <label for="privacy-analytics">Allow anonymous analytics</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="privacy-analytics" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="toggle-group">
                            <label for="privacy-research">Contribute to health research</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="privacy-research">
                                <span class="toggle-slider"></span>
                            </label>
                            <p class="toggle-description">Your anonymized data may be used to improve health outcomes for everyone</p>
                        </div>
                    </div>
                </div>
                
                <!-- Integrations Section -->
                <div id="integrations-settings" class="settings-section">
                    <h2>Integrations</h2>
                    
                    <div class="integration-cards">
                        <div class="integration-card">
                            <div class="integration-icon"><i class="fas fa-heartbeat"></i></div>
                            <div class="integration-details">
                                <h3>Apple Health</h3>
                                <p>Connect with Apple Health to sync your health data</p>
                                <button class="connect-btn">Connect</button>
                            </div>
                        </div>
                        
                        <div class="integration-card">
                            <div class="integration-icon"><i class="fas fa-running"></i></div>
                            <div class="integration-details">
                                <h3>Google Fit</h3>
                                <p>Connect with Google Fit to sync your health data</p>
                                <button class="connect-btn">Connect</button>
                            </div>
                        </div>
                        
                        <div class="integration-card">
                            <div class="integration-icon"><i class="fas fa-file-medical"></i></div>
                            <div class="integration-details">
                                <h3>Electronic Health Records</h3>
                                <p>Connect to your healthcare provider's EHR system</p>
                                <button class="connect-btn">Connect</button>
                            </div>
                        </div>
                        
                        <div class="integration-card">
                            <div class="integration-icon"><i class="fas fa-pills"></i></div>
                            <div class="integration-details">
                                <h3>Pharmacy</h3>
                                <p>Connect to your pharmacy for medication information</p>
                                <button class="connect-btn">Connect</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- About Section -->
                <div id="about-settings" class="settings-section">
                    <h2>About PersonaHealth</h2>
                    
                    <div class="about-content">
                        <div class="about-logo">
                            <img src="https://api.placeholder.com/150/150" alt="PersonaHealth Logo">
                            <h2>PersonaHealth</h2>
                            <p>Version 1.0.0</p>
                        </div>
                        
                        <div class="about-description">
                            <p>PersonaHealth is your personal health companion, designed to help you manage your health through personalized guidance, medication reminders, and symptom tracking.</p>
                            
                            <h3>Key Features</h3>
                            <ul>
                                <li>Personalized Health Companion with natural language understanding</li>
                                <li>Medication Management with smart reminders and FDA information</li>
                                <li>Symptom Journal with pattern recognition</li>
                                <li>Care Coordination for doctor appointments</li>
                            </ul>
                            
                            <h3>Legal</h3>
                            <p><a href="#" class="text-link">Terms of Service</a></p>
                            <p><a href="#" class="text-link">Privacy Policy</a></p>
                            
                            <h3>Contact</h3>
                            <p>Email: <a href="mailto:support@personahealth.app" class="text-link">support@personahealth.app</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add the settings view to the content area
    document.querySelector('.content').appendChild(settingsView);
    
    // Setup the settings functionality
    setupSettingsNavigation();
    setupProfileSettings();
    setupNotificationPreferences();
    setupDataManagement();
    setupIntegrationSettings();
}

function setupSettingsNavigation() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href').substring(1);
            let targetSection;
            
            switch(targetId) {
                case 'profile':
                    targetSection = document.getElementById('profile-settings');
                    break;
                case 'notifications':
                    targetSection = document.getElementById('notifications-settings');
                    break;
                case 'data':
                    targetSection = document.getElementById('data-management');
                    break;
                case 'integrations':
                    targetSection = document.getElementById('integrations-settings');
                    break;
                case 'about':
                    targetSection = document.getElementById('about-settings');
                    break;
                default:
                    targetSection = document.getElementById('profile-settings');
            }
            
            // Hide all sections
            const sections = document.querySelectorAll('.settings-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            targetSection.classList.add('active');
        });
    });
}

function setupProfileSettings() {
    // Update profile info if user is logged in
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-name-input').value = currentUser.name;
        document.getElementById('profile-email-input').value = currentUser.email;
        
        if (currentUser.healthConditions && currentUser.healthConditions.length > 0) {
            document.getElementById('profile-conditions').value = currentUser.healthConditions.join(', ');
        }
    }
    
    // Save profile button
    const saveProfileBtn = document.getElementById('save-profile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            const name = document.getElementById('profile-name-input').value;
            const email = document.getElementById('profile-email-input').value;
            const phone = document.getElementById('profile-phone-input').value;
            const password = document.getElementById('profile-password-input').value;
            const conditions = document.getElementById('profile-conditions').value;
            const allergies = document.getElementById('profile-allergies').value;
            const doctor = document.getElementById('profile-doctor').value;
            
            // Update current user object
            if (currentUser) {
                currentUser.name = name;
                currentUser.email = email;
                currentUser.phone = phone;
                currentUser.healthConditions = conditions ? conditions.split(',').map(c => c.trim()) : [];
                currentUser.allergies = allergies ? allergies.split(',').map(a => a.trim()) : [];
                currentUser.doctor = doctor;
                
                // In a real app, this would be sent to a backend
                
                // Update UI
                document.getElementById('profile-name').textContent = name;
                document.getElementById('profile-email').textContent = email;
                document.getElementById('user-name').textContent = name;
                document.getElementById('greeting-name').textContent = name.split(' ')[0];
                
                // Clear password field
                document.getElementById('profile-password-input').value = '';
                
                // Show success message
                alert('Profile updated successfully!');
            }
        });
    }
}

function setupNotificationPreferences() {
    const saveNotificationsBtn = document.getElementById('save-notifications');
    if (saveNotificationsBtn) {
        saveNotificationsBtn.addEventListener('click', function() {
            // Get notification preferences
            const medicationReminders = document.getElementById('notification-medications').checked;
            const symptomCheckins = document.getElementById('notification-symptoms').checked;
            const appointmentReminders = document.getElementById('notification-appointments').checked;
            const healthInsights = document.getElementById('notification-insights').checked;
            
            // Get reminder timing
            const medicationTiming = document.getElementById('reminder-medications').value;
            const appointmentTiming = document.getElementById('reminder-appointments').value;
            
            // In a real app, this would be sent to a backend
            
            // Show success message
            alert('Notification preferences saved!');
        });
    }
}

function setupDataManagement() {
    // Export data button
    const exportDataBtn = document.getElementById('export-data');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            // In a real app, this would generate a JSON file with all user data
            // For the demo, we'll just create a sample data object
            
            const exportData = {
                user: currentUser,
                medications: medications,
                symptoms: symptoms,
                appointments: appointments,
                conversationHistory: conversationHistory,
                exportDate: new Date().toISOString()
            };
            
            // Convert to JSON
            const dataStr = JSON.stringify(exportData, null, 2);
            
            // Create a download link
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'personahealth-data.json';
            
            // Create a link element
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        });
    }
    
    // Import data button
    const importDataBtn = document.getElementById('import-data');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function() {
            // In a real app, this would open a file dialog
            alert('This feature would allow you to import previously exported data.');
        });
    }
    
    // Delete account button
    const deleteAccountBtn = document.getElementById('delete-account');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // In a real app, this would send a request to the backend
                // For the demo, we'll just log out the user
                handleLogout();
                alert('Account deleted successfully.');
            }
        });
    }
}

function setupIntegrationSettings() {
    // Connect buttons
    const connectBtns = document.querySelectorAll('.connect-btn');
    connectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const integrationName = this.closest('.integration-card').querySelector('h3').textContent;
            
            // In a real app, this would open an OAuth flow
            alert(`This would connect your account with ${integrationName}. In a real app, you would be redirected to authorize access.`);
        });
    });
}

// Data Visualization Functionality
function setupDataVisualizations() {
    // Setup medication adherence chart
    setupMedicationAdherenceChart();
    
    // Setup symptom tracking chart
    setupSymptomTrackingChart();
    
    // Setup health metrics chart
    setupHealthMetricsChart();
}

function setupMedicationAdherenceChart() {
    // In a real app, this would use a charting library like Chart.js
    console.log('Setting up medication adherence chart');
    
    // For demo purposes, we'll simulate the data
    const adherenceData = [
        { medication: 'Lisinopril', adherence: 98 },
        { medication: 'Metformin', adherence: 92 },
        { medication: 'Atorvastatin', adherence: 88 }
    ];
    
    // This would generate a chart showing medication adherence over time
}

function setupSymptomTrackingChart() {
    // In a real app, this would use a charting library
    console.log('Setting up symptom tracking chart');
    
    // For demo purposes, we'll simulate the data
    const symptomData = [
        { date: '2025-03-01', headache: 2, fatigue: 4, nausea: 0, pain: 1 },
        { date: '2025-03-05', headache: 3, fatigue: 2, nausea: 1, pain: 0 },
        { date: '2025-03-10', headache: 1, fatigue: 3, nausea: 0, pain: 2 },
        { date: '2025-03-15', headache: 0, fatigue: 2, nausea: 0, pain: 1 },
        { date: '2025-03-20', headache: 2, fatigue: 1, nausea: 1, pain: 0 },
        { date: '2025-03-25', headache: 0, fatigue: 3, nausea: 0, pain: 0 },
        { date: '2025-03-28', headache: 2, fatigue: 1, nausea: 2, pain: 0 }
    ];
    
    // This would generate a chart showing symptom intensity over time
}

function setupHealthMetricsChart() {
    // In a real app, this would use a charting library
    console.log('Setting up health metrics chart');
    
    // For demo purposes, we'll simulate the data
    const healthMetrics = [
        { date: '2025-03-01', bloodPressure: '120/80', bloodSugar: 110, weight: 185 },
        { date: '2025-03-08', bloodPressure: '118/78', bloodSugar: 108, weight: 184 },
        { date: '2025-03-15', bloodPressure: '122/82', bloodSugar: 115, weight: 183 },
        { date: '2025-03-22', bloodPressure: '119/79', bloodSugar: 106, weight: 182 },
        { date: '2025-03-29', bloodPressure: '117/77', bloodSugar: 105, weight: 181 }
    ];
    
    // This would generate charts showing health metrics over time
}

// Enhanced OpenFDA Integration
function enhancedFDAIntegration() {
    // This would implement more sophisticated OpenFDA API integration
    
    // Medication Search with Autocomplete
    setupMedicationSearch();
    
    // Medication Interaction Checker
    setupInteractionChecker();
    
    // Medication Recalls Monitoring
    setupRecallsMonitoring();
}

function setupMedicationSearch() {
    // In a real app, this would implement an autocomplete search
    // that queries the OpenFDA API as the user types
    
    console.log('Setting up medication search with OpenFDA integration');
    
    // Example of how this would work:
    // 1. User types medication name
    // 2. App queries OpenFDA API for matching medications
    // 3. Results are displayed as autocomplete suggestions
    // 4. User selects a medication
    // 5. App fetches detailed information from OpenFDA
}

function setupInteractionChecker() {
    // In a real app, this would check for interactions between medications
    
    console.log('Setting up medication interaction checker');
    
    // Example of how this would work:
    // 1. App gets list of user's medications
    // 2. App queries OpenFDA API for interactions
    // 3. App displays warnings for potential interactions
}

function setupRecallsMonitoring() {
    // In a real app, this would periodically check for medication recalls
    
    console.log('Setting up medication recalls monitoring');
    
    // Example of how this would work:
    // 1. App periodically checks OpenFDA API for recalls
    // 2. If a recall affects user's medications, app shows alert
    // 3. App provides information about the recall and next steps
}

// Local Storage and Offline Support
function setupLocalStorage() {
    // In a real app, this would implement local storage for offline use
    
    console.log('Setting up local storage');
    
    // Example of how this would work:
    // 1. App stores user data in localStorage or IndexedDB
    // 2. App syncs with backend when online
    // 3. App can function offline using local data
}

// Add these features to the app initialization
function enhancedInitApp() {
    // Call the existing initialization
    initApp();
    
    // Add new features
    setupSettingsView();
    setupDataVisualizations();
    enhancedFDAIntegration();
    setupLocalStorage();
    
    // Log initialization
    console.log('PersonaHealth initialized with enhanced features');
}

// Initialize the enhanced app
document.addEventListener('DOMContentLoaded', function() {
    enhancedInitApp();
});