// חילוץ זמני תפילה מ-HTML עם שמירת שמות מקוריים וכותרות משנה
function extractPrayerTimesFromHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const prayerTimes = {};
    let counter = 0;
    
    // חילוץ כותרות h2 וטבלאות
    const elements = doc.querySelectorAll('h2, table');
    
    elements.forEach(element => {
        if (element.tagName === 'H2') {
            // הוספת כותרת משנה
            const uniqueKey = `header_${counter}`;
            counter++;
            
            prayerTimes[uniqueKey] = {
                displayName: element.textContent.trim(),
                originalHTML: element.outerHTML,
                time: '',
                isHeader: true
            };
        } else if (element.tagName === 'TABLE') {
            // חילוץ מטבלה
            const rows = element.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 2) {
                    // שמירת השם המקורי כפי שהוא מוצג ב-HTML
                    const originalHTML = cells[0].innerHTML;
                    let displayName = cells[0].textContent.replace(/[:\*]/g, '').trim();
                    const time = cells[1].textContent.trim();
                    
                    if (displayName && time && time.match(/\d{1,2}:\d{2}/) && !time.includes('לאחר')) {
                        // שימוש במספר רצף כמפתח ייחודי
                        const uniqueKey = `prayer_${counter}`;
                        counter++;
                        
                        prayerTimes[uniqueKey] = {
                            displayName: displayName,
                            originalHTML: originalHTML,
                            time: time,
                            isHeader: false
                        };
                    }
                }
            });
        }
    });
    
    return prayerTimes;
}

// יצירת טבלת עריכה
function createEditTable(prayerTimes) {
    const editTable = document.getElementById('editTable');
    const selectedYear = document.getElementById('hebrew-year').value;
    const holiday = document.getElementById('holiday').value;
    
    let tableHTML = `
        <div class="table-responsive">
            <div class="text-center mb-3">
                <h6 style="color: #2c5530; margin-bottom: 15px;">זמני תפילה ${getHebrewHolidayTitle(holiday)} ${selectedYear}</h6>
            </div>
            <table class="table table-striped table-hover">
                <tbody>
    `;
    
    Object.entries(prayerTimes).forEach(([key, data]) => {
        if (data.isHeader) {
            // כותרת משנה
            tableHTML += `
                <tr class="table-info">
                    <td colspan="2" class="fw-bold text-center align-middle" style="background-color: #e3f2fd; font-size: 16px; padding: 15px;">
                        <input type="text" class="form-control form-control-sm text-center fw-bold" 
                               value="${data.displayName}" 
                               data-prayer-key="${key}"
                               oninput="updatePrayerTimeByElement(this)"
                               onchange="updatePrayerTimeByElement(this)"
                               style="font-size: 16px; background: transparent; border: none; font-weight: bold;">
                    </td>
                </tr>
            `;
        } else {
            // שורת זמן רגילה
            tableHTML += `
                <tr>
                    <td class="fw-bold text-primary text-center align-middle">${data.displayName}</td>
                    <td class="text-center">
                        <input type="text" class="form-control form-control-sm text-center" 
                               value="${data.time}" 
                               data-prayer-key="${key}"
                               oninput="updatePrayerTimeByElement(this)"
                               onchange="updatePrayerTimeByElement(this)"
                               placeholder="HH:MM"
                               pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                               style="font-family: monospace; font-size: 14px; width: 100px;">
                    </td>
                </tr>
            `;
        }
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    editTable.innerHTML = tableHTML;
    
    // שמירת הנתונים הערוכים
    editedPrayerTimes = JSON.parse(JSON.stringify(prayerTimes));
}

// עדכון זמן תפילה ספציפי
function updatePrayerTime(prayer, newTime) {
    editedPrayerTimes[prayer] = newTime;
    updatePreview();
}

// עדכון זמן תפילה או כותרת דרך אלמנט
function updatePrayerTimeByElement(element) {
    const prayerKey = element.getAttribute('data-prayer-key');
    const newValue = element.value;
    
    if (editedPrayerTimes[prayerKey]) {
        if (editedPrayerTimes[prayerKey].isHeader) {
            // עדכון כותרת
            editedPrayerTimes[prayerKey].displayName = newValue;
            editedPrayerTimes[prayerKey].originalHTML = `<h2 style="color: #2c5530; margin-bottom: 20px;">${newValue}</h2>`;
        } else {
            // עדכון זמן
            editedPrayerTimes[prayerKey].time = newValue;
        }
        updatePreview();
    }
}

// עדכון תצוגה מקדימה
function updatePreview() {
    const previewContainer = document.getElementById('previewContainer');
    const selectedYear = document.getElementById('hebrew-year').value;
    const holiday = document.getElementById('holiday').value;
    
    // יצירת HTML מעודכן עם הנתונים הערוכים
    let previewHTML = `
        <div style="font-family: 'Noto Sans Hebrew', Arial, sans-serif; direction: rtl; text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
            <h6 style="color: #2c5530; margin-bottom: 15px;">זמני תפילה ${getHebrewHolidayTitle(holiday)} ${selectedYear}</h6>
            <table style="margin: 0 auto; border-collapse: collapse; width: 100%; max-width: 350px;">
    `;
    
    Object.entries(editedPrayerTimes).forEach(([key, data]) => {
        if (data.isHeader) {
            // כותרת משנה
            previewHTML += `
                </table>
                <h6 style="color: #2c5530; margin: 20px 0 15px 0; font-weight: bold;">${data.displayName}</h6>
                <table style="margin: 0 auto; border-collapse: collapse; width: 100%; max-width: 350px;">
            `;
        } else {
            // שורת זמן רגילה
            previewHTML += `
                <tr>
                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd; font-weight: bold; background: #f8f9fa;">${data.displayName}:</td>
                    <td style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 16px;">${data.time}</td>
                </tr>
            `;
        }
    });
        
    previewContainer.innerHTML = previewHTML;
}

// יצירת תמונה סופית עם הנתונים הערוכים
function generateFinalImageFromEdited() {
    const loadingData = showLoadingModal('יצירת קובץ', 'מעבד ויוצר את התמונה...');
    
    setTimeout(() => {
        try {
            const selectedYear = document.getElementById('hebrew-year').value;
            const holiday = document.getElementById('holiday').value;
      
    // יצירת HTML מעודכן עם הנתונים הערוכים באמצעות השמות המקוריים
    let editedHTML = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;
    
    Object.entries(editedPrayerTimes).forEach(([key, data]) => {
        if (data.isHeader) {
            // כותרת משנה
            editedHTML += `
            </table>
            ${data.originalHTML}
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
            `;
        } else {
            // שורת זמן רגילה
            editedHTML += `
                <tr>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${data.originalHTML}</td>
                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${data.time}</td>
                </tr>
            `;
        }
    });
    
    // יצירת התמונה עם התוכן הערוך
    generateImageDocument(editedHTML, selectedYear, holiday);
    
    // סגירת המודאל
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    if (modal) {
        modal.hide();
    }
        } catch (error) {
            console.error('שגיאה ביצירת התמונה:', error);
            alert('אירעה שגיאה ביצירת התמונה');
        } finally {
            hideLoadingModal(loadingData);
        }
    }, 1000); // השהיה של שנייה
}

// יצירת HTML מעודכן
function createEditedHTML() {
    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;
    
    Object.entries(editedPrayerTimes).forEach(([prayer, time]) => {
        htmlContent += `
            <tr>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>${prayer}:</strong></td>
                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${time}</td>
            </tr>
        `;
    });
    
    htmlContent += `
            </table>
        </div>
    `;
    
    return htmlContent;
}

// פונקציה עזר ליצירת תמונה עם תוכן מסוים
function generateImageWithContent(holidayContent, selectedYear, holiday) {
    // יצירת קנבס
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    
    // טעינת תמונת הרקע
    const backgroundImg = new Image();
    backgroundImg.crossOrigin = "Anonymous";
    backgroundImg.src = 'frame_template.png';
    
    backgroundImg.onload = function() {
        // ציור תמונת הרקע על הקנבס
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        
        // חישוב גודל פונט דינמי לפי כמות הטקסט
        const textLength = holidayContent.replace(/<[^>]*>/g, '').length;
        let contentFontSize;
        if (textLength < 200) {
            contentFontSize = 24;
        } else if (textLength < 400) {
            contentFontSize = 20;
        } else if (textLength < 600) {
            contentFontSize = 18;
        } else if (textLength < 800) {
            contentFontSize = 16;
        } else {
            contentFontSize = 14;
        }
        
        // יצירת מיכל HTML עם התוכן המלא
        const container = document.createElement('div');
        container.style.cssText = `
            width: 450px;
            padding: 40px 30px 20px 30px;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
            direction: rtl;
            text-align: center;
            background: transparent;
            margin: 0;
            position: relative;
        `;
        
        // הוספת כותרת
        const title = document.createElement('h1');
        title.style.cssText = `
            color: #2c5530;
            font-size: ${Math.min(contentFontSize + 6, 30)}px;
            margin-bottom: 20px;
            font-weight: bold;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
        `;
        title.innerHTML = `זמני תפילה ${getHebrewHolidayTitle(holiday)} ${selectedYear}`;
        container.appendChild(title);
        
        // הוספת התוכן של החג
        const content = document.createElement('div');
        content.style.cssText = `
            font-size: ${contentFontSize}px;
            line-height: 1.4;
            color: #333;
            text-align: center;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
        `;
        content.innerHTML = holidayContent;
        container.appendChild(content);
        
        // הוספה זמנית למסמך
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);
        
        // המתנה קצרה לטעינת הסגנונות ואז המרה לתמונה
        setTimeout(() => {
            html2canvas(container, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true
            }).then(contentCanvas => {
                // ציור התוכן ממורכז ברוחב אבל מתחיל מלמעלה
                const x = (canvas.width - contentCanvas.width / 2) / 2;
                const y = 140; // מרווח מוגדל מלמעלה
                ctx.drawImage(contentCanvas, x, y, contentCanvas.width / 2, contentCanvas.height / 2);
                
                // הורדת התמונה
                const imgData = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = `זמני_תפילה_${getHolidayName(holiday)}_${selectedYear}.png`;
                link.href = imgData;
                link.click();
                
                // ניקוי
                document.body.removeChild(container);
            }).catch(error => {
                console.error('שגיאה ביצירת התמונה:', error);
                document.body.removeChild(container);
                alert('שגיאה ביצירת התמונה. אנא נסה שוב.');
            });
        }, 500);
    };
    
    backgroundImg.onerror = function() {
        alert('שגיאה בטעינת תמונת הרקע. אנא ודא שקובץ frame_template.png קיים בתיקיית הפרויקט.');
    };
}
