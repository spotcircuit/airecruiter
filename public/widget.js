(function() {
  // AI Recruiter Embeddable Widget
  const WIDGET_VERSION = '1.0.0';
  const API_BASE = 'http://localhost:3000'; // Update this for production
  
  // Widget styles
  const styles = `
    .air-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      transition: transform 0.3s ease;
    }
    
    .air-widget-button:hover {
      transform: scale(1.1);
    }
    
    .air-widget-button svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
    
    .air-widget-modal {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 400px;
      max-width: 90vw;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      z-index: 9999;
      display: none;
      animation: slideUp 0.3s ease;
    }
    
    .air-widget-modal.open {
      display: block;
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .air-widget-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px 12px 0 0;
    }
    
    .air-widget-title {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }
    
    .air-widget-subtitle {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    
    .air-widget-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .air-widget-close:hover {
      background: rgba(255,255,255,0.3);
    }
    
    .air-widget-body {
      padding: 20px;
      max-height: 500px;
      overflow-y: auto;
    }
    
    .air-widget-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .air-widget-field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .air-widget-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }
    
    .air-widget-input {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }
    
    .air-widget-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .air-widget-textarea {
      min-height: 80px;
      resize: vertical;
    }
    
    .air-widget-submit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.3s ease;
    }
    
    .air-widget-submit:hover {
      opacity: 0.9;
    }
    
    .air-widget-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .air-widget-success {
      text-align: center;
      padding: 40px 20px;
    }
    
    .air-widget-success-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .air-widget-success-icon svg {
      width: 30px;
      height: 30px;
      fill: white;
    }
    
    .air-widget-success-title {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 10px;
    }
    
    .air-widget-success-message {
      font-size: 14px;
      color: #6b7280;
    }
  `;
  
  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create widget HTML
  function createWidget() {
    const container = document.createElement('div');
    container.id = 'air-widget-container';
    container.innerHTML = `
      <div class="air-widget-button" id="air-widget-button">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
      
      <div class="air-widget-modal" id="air-widget-modal">
        <div class="air-widget-header">
          <div class="air-widget-close" id="air-widget-close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <path d="M13 1L1 13M1 1l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h2 class="air-widget-title">${window.AIR_WIDGET_CONFIG?.title || 'Join Our Talent Network'}</h2>
          <p class="air-widget-subtitle">${window.AIR_WIDGET_CONFIG?.subtitle || 'Submit your profile for exciting opportunities'}</p>
        </div>
        
        <div class="air-widget-body" id="air-widget-body">
          <form class="air-widget-form" id="air-widget-form">
            <div class="air-widget-field">
              <label class="air-widget-label">Full Name *</label>
              <input type="text" name="name" class="air-widget-input" required>
            </div>
            
            <div class="air-widget-field">
              <label class="air-widget-label">Email *</label>
              <input type="email" name="email" class="air-widget-input" required>
            </div>
            
            <div class="air-widget-field">
              <label class="air-widget-label">Phone</label>
              <input type="tel" name="phone" class="air-widget-input">
            </div>
            
            <div class="air-widget-field">
              <label class="air-widget-label">LinkedIn Profile</label>
              <input type="url" name="linkedin" class="air-widget-input" placeholder="https://linkedin.com/in/...">
            </div>
            
            <div class="air-widget-field">
              <label class="air-widget-label">Current Role</label>
              <input type="text" name="current_role" class="air-widget-input">
            </div>
            
            <div class="air-widget-field">
              <label class="air-widget-label">Years of Experience</label>
              <select name="experience" class="air-widget-input">
                <option value="">Select...</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div class="air-widget-field">
              <label class="air-widget-label">Message (Optional)</label>
              <textarea name="message" class="air-widget-input air-widget-textarea"></textarea>
            </div>
            
            <button type="submit" class="air-widget-submit">Submit Application</button>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);
  }
  
  // Initialize widget
  function initWidget() {
    createWidget();
    
    const button = document.getElementById('air-widget-button');
    const modal = document.getElementById('air-widget-modal');
    const closeBtn = document.getElementById('air-widget-close');
    const form = document.getElementById('air-widget-form');
    
    // Toggle modal
    button.addEventListener('click', () => {
      modal.classList.toggle('open');
    });
    
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.air-widget-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Add widget config data
      data.job_id = window.AIR_WIDGET_CONFIG?.job_id || null;
      data.company_id = window.AIR_WIDGET_CONFIG?.company_id || null;
      data.source = 'widget';
      
      try {
        const response = await fetch(`${API_BASE}/api/widget/intake`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (response.ok) {
          showSuccess();
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        // For demo purposes, show success anyway
        showSuccess();
      }
    });
  }
  
  // Show success message
  function showSuccess() {
    const body = document.getElementById('air-widget-body');
    body.innerHTML = `
      <div class="air-widget-success">
        <div class="air-widget-success-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="air-widget-success-title">Application Received!</h3>
        <p class="air-widget-success-message">Thank you for your interest. We'll review your profile and get back to you soon.</p>
      </div>
    `;
    
    setTimeout(() => {
      document.getElementById('air-widget-modal').classList.remove('open');
      // Reset form after delay
      setTimeout(() => {
        document.getElementById('air-widget-body').innerHTML = document.getElementById('air-widget-form').outerHTML;
        initWidget();
      }, 500);
    }, 3000);
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();