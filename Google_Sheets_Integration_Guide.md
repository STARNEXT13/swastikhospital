# Swastik Hospital - Google Sheets Form Linking Guide (हिन्दी / English Setup Guide)

Aapki Swastik Hospital website me jo **Appointment Booking / Patient Detail Form** hai, use **Google Sheets** ke sath link karne ke liye niche diye gaye steps follow karein. 

---

## 🚀 Steps to Connect Website Form to Google Sheets

### Step 1: Create a New Google Sheet
1. Apne browser me [sheets.google.com](https://sheets.google.com) kholein.
2. Nayi (Blank) Google Sheet banayein.
3. Sheet ka naam rakhein: **Swastik Hospital Appointments**.

---

### Step 2: Open Google Apps Script Editor
1. Google Sheet ke top menu bar me **Extensions** par click karein.
2. Dropdown menu se **Apps Script** par click karein. Ek nayi window/tab khulegi.

---

### Step 3: Paste the Script Code
1. Purana default code `function myFunction() { ... }` poora mita (delete) dein.
2. Niche diya gaya code poora copy karein aur paste kar dein:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create Header Row if Sheet is Empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Phone", "Email", "Date", "Service", "Message"]);
    }
    
    sheet.appendRow([
      data.Timestamp || new Date().toLocaleString(),
      data.Name || "",
      data.Phone || "",
      data.Email || "",
      data.Date || "",
      data.Service || "",
      data.Message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({result: "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({result: "error", error: error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Top bar me **Save (💾 Icon)** par click karein.

---

### Step 4: Deploy as Web App
1. Top Right Corner me **Deploy** button par click karein aur **New deployment** chunein.
2. Left side me **Gear (⚙️) icon** par click karke **Web app** select karein.
3. Settings bharein:
   - **Description**: `Hospital Form Webhook`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: **`Anyone`** *(⚠️ VERY IMPORTANT: Use 'Anyone' so website users can submit without logging into your account!)*
4. **Deploy** button par click karein.
5. Google permission popup aane par **Authorize access** par click karein, apna email chunein, **Advanced > Go to Untitled project (unsafe)** par click karke **Allow** karein.

---

### Step 5: Copy Web App URL & Update Config
1. Deploy hone ke baad aapko ek **Web App URL** dikhai dega:
   Example: `https://script.google.com/macros/s/AKfycbx.../exec`
2. Is URL ko **Copy** karein.
3. Website folder me `config/site-data.js` file kholein.
4. Line `googleSheetScriptUrl: ""` me quotes ke andar apna Web App URL paste kar dein:

```javascript
  // Example:
  googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbx.../exec",
```

5. File save karein! Bas, aapka form ab live Google Sheets se connect ho chuka hai! 🎉

---

## 📁 Website Information Modify Kaise Karein? (Easy Customization)

Sabhi details ko ek jagah rkhne ke liye ek dedicated folder banaya gaya hai:
👉 **[config/site-data.js](file:///w:/swastik/config/site-data.js)**

Jab bhi aapko niche me se kuch bhi change karna ho:
- **Hospital Name / Tagline**
- **Doctor Name**: `Dr. L.N. Sharma (MD Medicine)`
- **Contact Number**: `987654321`
- **Email**: `swastikhospital@gmail.com`
- **OPD Timings**
- **Services & Gallery Images**

Bas `config/site-data.js` me value change karke Save karein, poori website automatic update ho jayegi!
