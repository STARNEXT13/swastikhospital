# Swastik Hospital - OPD & Appointment Excel (.xlsx) Security Guide

Swastik Hospital website me **OPD / Book Appointment** records ko **Privacy & Admin PIN Security** ke sath configure kar diya gaya hai.

---

## 🔒 Privacy & Security Setup

1. **Public Patients (Normal Visitors)**:
   - Patient jab bhi appointment form bharega, use confirmation message dikhai dega ("Dhanyawad! Aapki appointment request receive ho gayi hai.").
   - Public visitors ko kisi doosre patient ka record ya Excel file download nahi dikhegi.

2. **Hospital Staff / Admin Access**:
   - Only Dr. L.N. Sharma ya Reception Staff **Admin PIN (Default: `1234`)** enter karke sabhi OPD bookings dekh aur Excel file export kar sakte hain.

---

## 🔑 Admin Portal Options

- **Option A: Dedicated Admin Web Page**:
  - Visit: [http://localhost:8085/admin.html](http://localhost:8085/admin.html)
  - Enter PIN: `1234`
  - Yaha se aap sabhi patient records search, filter, delete aur **Microsoft Excel (.xlsx)** me download kar sakte hain.

- **Option B: Footer Link**:
  - Main website ke footer me **"Hospital Staff Login"** link par click karke Admin PIN enter karein.

---

## ⚙️ Changing Admin PIN (config/site-data.js)

`config/site-data.js` me `adminConfig` se PIN change kar sakte hain:

```javascript
  adminConfig: {
    pin: "1234", // Apna secret PIN yaha set karein
    sessionKey: "swastik_admin_authenticated"
  },
```
