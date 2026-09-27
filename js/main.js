/**
 * =========================================================================
 * SWASTIK HOSPITAL - MAIN JAVASCRIPT CONTROLLER
 * Reads data from SITE_CONFIG (config/site-data.js) and manages interactions
 * OPD & Book Appointment linked with Microsoft Excel (.xlsx) Generation
 * =========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Site Data from config/site-data.js
  initSiteData();

  // Initialize UI Event Listeners
  initNavigation();
  initAppointmentForm();
  initExcelManagerModal();
});

const APPOINTMENTS_STORAGE_KEY = "swastik_opd_appointments";

/**
 * 1. Populate HTML elements dynamically from SITE_CONFIG
 */
function initSiteData() {
  if (typeof SITE_CONFIG === "undefined") {
    console.error("SITE_CONFIG is missing! Make sure config/site-data.js is loaded.");
    return;
  }

  const { hospitalName, tagline, emergencyNumber, phone, email, address, workingHours, doctor, services, facilities, gallery } = SITE_CONFIG;

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

  // Excel Connection Indicator Banner
  const excelStatusEl = document.getElementById("excel-status-text");
  if (excelStatusEl) {
    excelStatusEl.innerHTML = `<i class="fas fa-file-excel"></i> Microsoft Excel (.xlsx) Connected & Ready`;
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
 * 3. LocalStorage Helpers & Excel Generation System
 */
function getStoredAppointments() {
  try {
    const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to read appointments from localStorage", err);
    return [];
  }
}

function saveAppointments(appointments) {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.error("Failed to save appointments to localStorage", err);
  }
}

function exportAppointmentsToExcel(appointmentsList, customFileName) {
  if (typeof XLSX === "undefined") {
    showToast("Excel Library load nahi hui! Kripya page refresh karein.", "error");
    return;
  }

  if (!appointmentsList || appointmentsList.length === 0) {
    showToast("Koi OPD Appointment records export karne ke liye nahi hain!", "info");
    return;
  }

  // Format dataset for Excel rows
  const excelRows = appointmentsList.map((item, index) => ({
    "S.No": index + 1,
    "Timestamp": item.Timestamp || "",
    "Patient Name": item.Name || "",
    "Phone Number": item.Phone || "",
    "Email": item.Email || "",
    "Preferred Date": item.Date || "",
    "Department / Service": item.Service || "",
    "Patient Message / Symptoms": item.Message || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  // Set column widths for clean spreadsheet layout
  worksheet["!cols"] = [
    { wch: 6 },  // S.No
    { wch: 22 }, // Timestamp
    { wch: 22 }, // Name
    { wch: 16 }, // Phone
    { wch: 25 }, // Email
    { wch: 16 }, // Date
    { wch: 30 }, // Service
    { wch: 40 }  // Message
  ];

  const workbook = XLSX.utils.book_new();
  const sheetName = (SITE_CONFIG.excelConfig && SITE_CONFIG.excelConfig.sheetName) || "OPD_Appointments";
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const fileName = customFileName || (SITE_CONFIG.excelConfig && SITE_CONFIG.excelConfig.fileName) || "Swastik_Hospital_OPD_Appointments.xlsx";
  XLSX.writeFile(workbook, fileName);
  showToast(`Excel Sheet (${fileName}) download ho gayi hai!`, "success");
}

/**
 * 4. Appointment Form Submission & Excel Auto-Link
 */
function initAppointmentForm() {
  const form = document.getElementById("appointment-form");
  const submitBtn = document.getElementById("submit-btn");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.getElementById("patient-name").value.trim();
    const phone = document.getElementById("patient-phone").value.trim();
    const email = document.getElementById("patient-email").value.trim();
    const date = document.getElementById("appointment-date").value;
    const service = document.getElementById("service-select").value;
    const message = document.getElementById("patient-message").value.trim();

    if (!fullName || !phone) {
      showToast("Kripya apna Naam aur Phone Number jaroor bharein!", "error");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      Timestamp: new Date().toLocaleString(),
      Name: fullName,
      Phone: phone,
      Email: email || "N/A",
      Date: date || "As soon as possible",
      Service: service || "General Consultation",
      Message: message || "N/A"
    };

    // Save to LocalStorage (Private Admin Storage)
    const existingAppointments = getStoredAppointments();
    existingAppointments.unshift(newAppointment);
    saveAppointments(existingAppointments);

    // Auto export to Excel file disabled for public visitors (Only Admin can export)
    const autoDownload = SITE_CONFIG.excelConfig ? SITE_CONFIG.excelConfig.autoDownloadOnBooking : false;
    if (autoDownload && typeof XLSX !== "undefined") {
      exportAppointmentsToExcel([newAppointment], `OPD_Appointment_${fullName.replace(/\s+/g, '_')}.xlsx`);
    }

    showToast(`Dhanyawad ${fullName}! Aapki OPD appointment details submit ho gayi hain. Swastik Hospital team jald call karegi.`, "success");
    form.reset();
  });
}

/**
 * 5. OPD Excel Data Manager Modal (Protected by Admin PIN)
 */
function initExcelManagerModal() {
  const modal = document.getElementById("excel-modal");
  const openBtns = [
    document.getElementById("open-excel-btn"),
    document.getElementById("open-excel-modal-btn")
  ];
  const closeBtns = [
    document.getElementById("close-excel-modal-btn"),
    document.getElementById("close-excel-footer-btn")
  ];
  const exportAllBtn = document.getElementById("export-all-excel-btn");
  const clearAllBtn = document.getElementById("clear-all-excel-btn");

  openBtns.forEach(btn => {
    if (btn && modal) {
      btn.addEventListener("click", () => {
        const expectedPin = (SITE_CONFIG.adminConfig && SITE_CONFIG.adminConfig.pin) || "1234";
        const userPin = prompt("🔑 Hospital Staff / Admin PIN enter karein (Default: 1234):");
        
        if (userPin === expectedPin) {
          renderExcelTable();
          modal.classList.add("show");
        } else if (userPin !== null) {
          showToast("Galat Admin PIN! OPD records access denied.", "error");
        }
      });
    }
  });

  closeBtns.forEach(btn => {
    if (btn && modal) {
      btn.addEventListener("click", () => {
        modal.classList.remove("show");
      });
    }
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", () => {
      const records = getStoredAppointments();
      exportAppointmentsToExcel(records);
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (confirm("Kya aap sach me sabhi OPD records clear karna chahte hain?")) {
        saveAppointments([]);
        renderExcelTable();
        showToast("Sabhi OPD records clear ho gaye hain.", "info");
      }
    });
  }
}

function renderExcelTable() {
  const tbody = document.getElementById("excel-table-body");
  const countBadge = document.getElementById("excel-count-badge");
  const records = getStoredAppointments();

  if (countBadge) {
    countBadge.textContent = records.length;
  }

  if (!tbody) return;

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 24px; color: #64748B;">
          <i class="fas fa-inbox" style="font-size: 1.75rem; margin-bottom: 8px; display: block; color: #94A3B8;"></i>
          Abhi koi OPD Appointment record nahi hai. Website form bharkar test karein!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = records.map((item, index) => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 10px; font-weight: 600;">${index + 1}</td>
      <td style="padding: 10px; color: #475569;">${item.Timestamp || 'N/A'}</td>
      <td style="padding: 10px; font-weight: 600; color: #0F172A;">${item.Name}</td>
      <td style="padding: 10px; color: #2563EB;">${item.Phone}</td>
      <td style="padding: 10px; color: #334155;">${item.Service}</td>
      <td style="padding: 10px;">
        <button type="button" onclick="exportSingleRecord(${item.id})" style="background: #10B981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
          <i class="fas fa-file-excel"></i> Excel
        </button>
        <button type="button" onclick="deleteSingleRecord(${item.id})" style="background: #EF4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-left: 4px;">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function exportSingleRecord(recordId) {
  const records = getStoredAppointments();
  const found = records.find(r => r.id === recordId);
  if (found) {
    exportAppointmentsToExcel([found], `OPD_Appointment_${found.Name.replace(/\s+/g, '_')}.xlsx`);
  }
}

function deleteSingleRecord(recordId) {
  let records = getStoredAppointments();
  records = records.filter(r => r.id !== recordId);
  saveAppointments(records);
  renderExcelTable();
  showToast("Appointment record delete ho gaya.", "info");
}

/**
 * 6. Toast Notification System
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
