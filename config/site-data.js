/**
 * =========================================================================
 * SWASTIK HOSPITAL - CONFIGURATION & SITE DATA
 * =========================================================================
 * Apni website ki sari information yaha se change kar sakte hain.
 * Jab bhi aapko Title, Phone, Email, Doctor Details ya Google Sheet Link
 * change karna ho, bas is file me edit karein aur save karein!
 * =========================================================================
 */

const SITE_CONFIG = {
  // General Hospital Information
  hospitalName: "Swastik Hospital",
  tagline: "Advanced Healthcare with Human Touch",
  emergencyNumber: "987654321",
  phone: "987654321",
  email: "swastikhospital@gmail.com",
  address: "Main Road, Near Central Bus Stand, Swastik Square",
  workingHours: "24/7 Emergency Care | OPD: 9:00 AM - 8:00 PM",

  // Doctor Details
  doctor: {
    name: "Dr. L.N. Sharma",
    degree: "MD Medicine",
    designation: "Senior Consultant Physician & Specialist",
    experience: "15+ Years Clinical Experience",
    bio: "Dr. L.N. Sharma (MD Medicine) is a renowned Senior Consultant Physician specializing in Internal Medicine, Chronic Disease Management, Diabetes, Cardiac Care, and Intensive Medical Care. Committed to providing precise diagnosis and patient-first healthcare.",
    specialties: [
      "Internal Medicine & General Physician",
      "Diabetes & Hypertension Management",
      "Cardiovascular & Chest Diseases",
      "Viral Fevers, Typhoid & Infection Treatment",
      "ICU & Emergency Critical Care"
    ],
    opdTimings: "Mon - Sat: 10:00 AM - 2:00 PM & 5:00 PM - 8:00 PM (Sun Emergency Only)"
  },

  // 🔗 GOOGLE SHEET LINK (Google Apps Script Web App URL)
  // Apni Google Sheet se mila URL yaha single quotes (' ') ke beech me paste karein:
  // Example: "https://script.google.com/macros/s/AKfycbx.../exec"
  googleSheetScriptUrl: "", 

  // Hospital Services
  services: [
    {
      id: "internal-medicine",
      icon: "stethoscope",
      badge: "Dr. L.N. Sharma (MD)",
      title: "General & Internal Medicine",
      desc: "Expert diagnosis and medical treatment for viral fevers, seasonal infections, respiratory issues, and metabolic disorders."
    },
    {
      id: "emergency-icu",
      icon: "heart-pulse",
      badge: "24/7 Available",
      title: "24x7 Emergency & ICU Care",
      desc: "State-of-the-art Intensive Care Unit equipped with multi-para monitors, ventilators, and emergency trauma support."
    },
    {
      id: "chronic-disease",
      icon: "activity",
      badge: "Specialized Care",
      title: "Diabetes & BP Management",
      desc: "Comprehensive monitoring and customized treatment plans for controlling blood sugar, blood pressure, and cholesterol."
    },
    {
      id: "pathology-lab",
      icon: "microscope",
      badge: "High Precision",
      title: "Diagnostic Pathology Lab",
      desc: "Automated laboratory testing for Complete Blood Count (CBC), Liver/Kidney tests, Lipid Profile, Thyroid & Urine analysis."
    },
    {
      id: "ecg-cardiac",
      icon: "wave-square",
      badge: "Instant Reports",
      title: "Digital ECG & Cardiac Check",
      desc: "Computerized 12-Lead ECG testing for rapid cardiac evaluation and chest pain assessment."
    },
    {
      id: "pharmacy",
      icon: "pills",
      badge: "24x7 In-House",
      title: "24/7 In-House Pharmacy",
      desc: "Genuine prescription medicines, surgical supplies, and wellness products available round-the-clock."
    }
  ],

  // Key Facilities
  facilities: [
    {
      icon: "ambulance",
      title: "24/7 Ambulance Service",
      desc: "Fully equipped emergency mobile medical unit with trained paramedic staff."
    },
    {
      icon: "hospital-bed",
      title: "AC & Deluxe Wards",
      desc: "Hygienic, comfortable, and well-ventilated patient care rooms with modern amenities."
    },
    {
      icon: "shield-virus",
      title: "Sterile & Safe Environment",
      desc: "Strict infection control protocols, daily sanitization, and clean drinking water."
    },
    {
      icon: "user-doctor",
      title: "Dedicated Nursing Staff",
      desc: "Compassionate, trained, and round-the-clock nursing care for indoor patients."
    }
  ],

  // Hospital Gallery
  gallery: [
    {
      title: "Hospital Building & Entrance",
      category: "Exterior",
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "building-shield"
    },
    {
      title: "Dr. L.N. Sharma Consultation Chamber",
      category: "OPD Chamber",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "user-md"
    },
    {
      title: "Modern ICU & Critical Care Unit",
      category: "ICU Ward",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "heartbeat"
    },
    {
      title: "Fully Automated Pathology Lab",
      category: "Laboratory",
      image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "vials"
    },
    {
      title: "Patient Comfort Care Room",
      category: "Deluxe Ward",
      image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "bed"
    },
    {
      title: "24/7 Reception & Emergency Helpdesk",
      category: "Reception",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      fallbackIcon: "headset"
    }
  ]
};
