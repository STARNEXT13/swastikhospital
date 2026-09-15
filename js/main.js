/**
 * =========================================================================
 * SWASTIK HOSPITAL - MAIN JAVASCRIPT CONTROLLER
 * Reads data from SITE_CONFIG (config/site-data.js) and manages interactions
 * =========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Site Data from config/site-data.js
  initSiteData();

  // Initialize UI Event Listeners
  initNavigation();
  initAppointmentForm();
  initGuideModal();
});

/**
 * 1. Populate HTML elements dynamically from SITE_CONFIG
 */
function initSiteData() {
  if (typeof SITE_CONFIG === "undefined") {
    console.error("SITE_CONFIG is missing! Make sure config/site-data.js is loaded.");
    return;
  }

  const { hospitalName, tagline, emergencyNumber, phone, email, address, workingHours, doctor, services, facilities, gallery, googleSheetScriptUrl } = SITE_CONFIG;

  // Title Tag
  document.title = `${hospitalName} | ${doctor.name} (${doctor.degree})`;

  // Header & Brand Elements
  setElementsText('.brand-name', hospitalName);
  setElementsText('.brand-tagline', tagline);
  setElementsText('.top-emergency-num', emergencyNumber);
  setElementsText('.top-phone-num', phone);
  setElementsText('.top-email', email);
  setElementsText('.top-address', address);
  setElementsText('.working-hours-text', workingHours);

  // Phone Links
  setElementsAttribute('.phone-call-link', 'href', `tel:${phone}`);
  setElementsAttribute('.emergency-call-link', 'href', `tel:${emergencyNumber}`);
  setElementsAttribute('.email-send-link', 'href', `mailto:${email}`);

  // Doctor Details
  setElementsText('.doctor-name-text', doctor.name);
  setElementsText('.doctor-degree-text', doctor.degree);
  setElementsText('.doctor-designation-text', doctor.designation);
  setElementsText('.doctor-exp-text', doctor.experience);
  setElementsText('.doctor-bio-text', doctor.bio);
  setElementsText('.doctor-timing-text', doctor.opdTimings);

  // Render Doctor Specialties List
  const specialtiesContainer = document.getElementById("doctor-specialties");
  if (specialtiesContainer && doctor.specialties) {
    specialtiesContainer.innerHTML = doctor.specialties.map(item => `
      <div class="specialty-item">
        <i class="fas fa-check-circle"></i>
        <span>${item}</span>
      </div>
    `).join('');
  }

  // Render Services Cards Grid
  const servicesGrid = document.getElementById("services-grid");
  if (servicesGrid && services) {
    servicesGrid.innerHTML = services.map(srv => `
      <div class="service-card">
        <div class="service-header">
          <div class="service-icon-box">
            <i class="fas fa-${srv.icon}"></i>
          </div>
          <span class="service-badge">${srv.badge}</span>
        </div>
        <h3>${srv.title}</h3>
        <p>${srv.desc}</p>
        <a href="#appointment" onclick="selectServiceForAppointment('${srv.title}')" class="service-link">
          <span>Book Appointment</span>
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `).join('');

    // Also populate form dropdown options
    const serviceSelect = document.getElementById("service-select");
    if (serviceSelect) {
      serviceSelect.innerHTML = `<option value="">-- Choose Required Service --</option>` +
        services.map(s => `<option value="${s.title}">${s.title}</option>`).join('') +
        `<option value="General Consultation (${doctor.name})">General Consultation with ${doctor.name}</option>`;
    }
  }

  // Render Facilities Grid
  const facilitiesGrid = document.getElementById("facilities-grid");
  if (facilitiesGrid && facilities) {
    facilitiesGrid.innerHTML = facilities.map(fac => `
      <div class="facility-card">
        <div class="facility-icon">
          <i class="fas fa-${fac.icon}"></i>
        </div>
        <div class="facility-content">
          <h4>${fac.title}</h4>
          <p>${fac.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Render Hospital Photo Gallery
  const galleryGrid = document.getElementById("gallery-grid");
  if (galleryGrid && gallery) {
    galleryGrid.innerHTML = gallery.map(item => `
      <div class="gallery-item" onclick="openImageModal('${item.image}', '${item.title}')">
        <img src="${item.image}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'">
        <div class="gallery-overlay">
          <span class="gallery-category">${item.category}</span>
          <h4 class="gallery-title">${item.title}</h4>
        </div>
      </div>
    `).join('');
  }

  // Google Sheets Indicator Banner
  const gsheetStatusEl = document.getElementById("gsheet-status-text");
  if (gsheetStatusEl) {
    if (googleSheetScriptUrl && googleSheetScriptUrl.trim() !== "") {
      gsheetStatusEl.innerHTML = `<span style="color: #10B981; font-weight: 700;"><i class="fas fa-check-circle"></i> Google Sheet Connected</span>`;
    } else {
      gsheetStatusEl.innerHTML = `<span style="color: #F59E0B;"><i class="fas fa-exclamation-triangle"></i> Google Sheet Pending</span>`;
    }
  }
}

// Helper functions for updating element content
function setElementsText(selector, text) {
  document.querySelectorAll(selector).forEach(el => {
    el.textContent = text;
  });
}

function setElementsAttribute(selector, attr, value) {
  document.querySelectorAll(selector).forEach(el => {
    el.setAttribute(attr, value);
  });
}

function selectServiceForAppointment(serviceTitle) {
  const serviceSelect = document.getElementById("service-select");
  if (serviceSelect) {
    serviceSelect.value = serviceTitle;
  }
}

/**
 * 2. Navigation Mobile Menu & Scroll handling
 */
function initNavigation() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = mobileToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        const icon = mobileToggle.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
      });
    });
  }
}

/**
 * 3. Appointment Form Submission & Google Sheets Integration
 */
function initAppointmentForm() {
  const form = document.getElementById("appointment-form");
  const submitBtn = document.getElementById("submit-btn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("patient-name").value.trim();
    const phone = document.getElementById("patient-phone").value.trim();
    const email = document.getElementById("patient-email").value.trim();
    const date = document.getElementById("appointment-date").value;
    const service = document.getElementById("service-select").value;
    const message = document.getElementById("patient-message").value.trim();

    if (!fullName || !phone) {
      showToast("Kripya apna Naamy aur Phone Number jaroor bharein!", "error");
      return;
    }

    const payload = {
      Timestamp: new Date().toLocaleString(),
      Name: fullName,
      Phone: phone,
      Email: email || "N/A",
      Date: date || "As soon as possible",
      Service: service || "General Consultation",
      Message: message || "N/A"
    };

    // UI Loading state
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Submitting Request...`;

    try {
      const scriptUrl = SITE_CONFIG.googleSheetScriptUrl ? SITE_CONFIG.googleSheetScriptUrl.trim() : "";

      if (scriptUrl && scriptUrl !== "") {
        // Post data to Google Apps Script Web App
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors", // Google Apps Script requires no-cors for direct cross-origin submission
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        });

        showToast(`Dhanyawad ${fullName}! Aapki appointment details Google Sheet me save ho gayi hain. Hospital se jald contact kiya jayega.`, "success");
      } else {
        // Fallback Demo Mode if URL is not yet connected
        console.log("Appointment Form Submitted (Demo Mode):", payload);
        showToast(`Dhanyawad ${fullName}! Aapka detail receive ho gaya hai. (Note: Abhi Google Sheet URL Config me add nahi hua h. "Sheet Guide" par click karke URL set karein).`, "info");
      }

      form.reset();
    } catch (error) {
      console.error("Submission Error:", error);
      showToast("Data submit karne me issue aaya. Kripya phone number 987654321 par direct call karein.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });
}

/**
 * 4. Google Sheets Setup Guide Modal
 */
function initGuideModal() {
  const modal = document.getElementById("guide-modal");
  const openBtn = document.getElementById("open-guide-btn");
  const closeBtn = document.getElementById("close-guide-btn");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("show");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });
  }

  // Close modal when clicking backdrop
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }
}

// Copy Google Apps Script Code Function
function copyScriptCode() {
  const codeText = document.getElementById("apps-script-code").innerText;
  navigator.clipboard.writeText(codeText).then(() => {
    showToast("Google Apps Script code copy ho gaya hai!", "success");
  }).catch(err => {
    console.error("Failed to copy code: ", err);
  });
}

/**
 * 5. Toast Notification System
 */
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-check-circle";
  if (type === "error") icon = "fa-exclamation-circle";

  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1.25rem;"></i>
    <div>${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}
