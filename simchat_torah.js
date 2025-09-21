// simchat_torah.js

// פונקציה מרכזית לחישוב זמני שמחת תורה
function calculateSimchatTorahTimes(selectedDay, sunsetTime) {
    let times;
    if (selectedDay === 'monday' || selectedDay === 'tuesday' || selectedDay === 'thursday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            shachrit: "7:30",
            hakafot: "12:30",
            minchaAfterHakafot: "מנחה לאחר ההקפות",
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30)
        };
    } else if (selectedDay === 'saturday') {
        times = {
            shirHashirim: addMinutesToTime(sunsetTime, -50),
            minchaErevChag: addMinutesToTime(sunsetTime, -25),
            shachrit: "7:30",
            hakafot: "12:30",
            minchaAfterHakafot: "מנחה לאחר ההקפות",
            kohelet: addMinutesToTime(sunsetTime, -25),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30)
        };
    }
    return times;
}

// פונקציה שמחזירה את התוכן HTML בלבד
function generateSimchatTorahContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    const times = calculateSimchatTorahTimes(selectedDay, sunsetTime);

    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    if (selectedDay === 'saturday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
        `;
    }

    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevChag}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>הקפות:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.hakafot}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">לאחר ההקפות</td></tr>
    `;

    if (selectedDay === 'saturday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>קהלת:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.kohelet}</td></tr>
        `;
    }

    // ערבית מוצאי חג בכל הימים (כולל שבת)
    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית מוצאי חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvitMotzaiChag}</td></tr>
    `;
    
    htmlContent += `
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                שמחת תורה ושמחת בית השואבה
            </p>
        </div>
    `;

    return htmlContent;
}

function generateSimchatTorahDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;
    const selectedYear = document.getElementById('hebrew-year').value;

    const times = calculateSimchatTorahTimes(selectedDay, sunsetTime);

    const doc = new docx.Document({
        styles: {
            paragraphStyles: [
                {
                    id: "headerStyle",
                    name: "Header Style",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 60,
                        bold: true,
                        underline: {},
                        color: "000000"
                    },
                },
                {
                    id: "subHeaderStyle",
                    name: "Sub Header Style",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 50,
                        color: "000000"
                    },
                },
                {
                    id: "normalStyle",
                    name: "Normal Style",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 44,
                        color: "000000"
                    },
                }
            ]
        },
        sections: [
            {
                children: [
                    new docx.Paragraph({
                        text: "בס\"ד",
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph({
                        text: "זמני תפילה שמחת תורה " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    // זמני היום
                    selectedDay === 'saturday' ? new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph(""),new docx.Paragraph(""),new docx.Paragraph({
                        text: `מנחה ערב חג: ${times.minchaErevChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית: ${times.shachrit}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `הקפות שמחת תורה: ${times.hakafot}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `${times.minchaAfterHakafot}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                
                    selectedDay === 'saturday' ? new docx.Paragraph({
                        text: `קהלת: ${times.kohelet}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph(""),
					selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `ערבית מוצאי חג: ${times.arvitMotzaiChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: "תוסיפו שנים רבות ומועדים טובים",
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "subHeaderStyle",
                        bidirectional: true
                    })
                ]
            }
        ]
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "prayer_schedule_simchat_torah.docx");
    });
}

// יצירת קובץ Word מהנתונים הערוכים
function generateSimchatTorahWordFromEdited(editedData, selectedYear) {
    // חילוץ הזמנים מהנתונים הערוכים
    const times = {};
    let selectedDay = '';
    
    // המרת הנתונים הערוכים למערך לזיהוי קל יותר
    const prayerArray = Object.values(editedData).filter(item => !item.isHeader);
    
    // Debug: בדיקה מה יש במערך
    console.log('prayerArray length:', prayerArray.length);
    console.log('prayerArray:', prayerArray.map(p => ({ displayName: p.displayName, time: p.time })));
    
    // זיהוי יום השבוע לפי הזמנים הקיימים
    if (prayerArray.length > 0 && prayerArray[0].displayName) {
        const firstPrayer = prayerArray[0].displayName;
        
        if (firstPrayer === 'שיר השירים') {
            // שבת - יש שיר השירים וקהלת
            selectedDay = 'saturday';
            
            // מיפוי לפי שמות התפילות במקום מיקום במערך
            prayerArray.forEach(prayer => {
                if (prayer.displayName === 'שיר השירים') {
                    times.shirHashirim = prayer.time;
                } else if (prayer.displayName === 'מנחה ערב חג') {
                    times.minchaErevChag = prayer.time;
                } else if (prayer.displayName === 'שחרית') {
                    times.shachrit = prayer.time;
                } else if (prayer.displayName === 'הקפות') {
                    times.hakafot = prayer.time;
                } else if (prayer.displayName === 'מנחה') {
                    times.minchaAfterHakafot = prayer.time;
                } else if (prayer.displayName === 'קהלת') {
                    times.kohelet = prayer.time;
                } else if (prayer.displayName === 'ערבית מוצאי חג') {
                    times.arvitMotzaiChag = prayer.time;
                }
            });
        } else if (firstPrayer === 'מנחה ערב חג') {
            // יום רגיל - שני/שלישי/חמישי
            selectedDay = 'other';
            
            // מיפוי לפי שמות התפילות במקום מיקום במערך
            prayerArray.forEach(prayer => {
                if (prayer.displayName === 'מנחה ערב חג') {
                    times.minchaErevChag = prayer.time;
                } else if (prayer.displayName === 'שחרית') {
                    times.shachrit = prayer.time;
                } else if (prayer.displayName === 'הקפות') {
                    times.hakafot = prayer.time;
                } else if (prayer.displayName === 'מנחה') {
                    times.minchaAfterHakafot = prayer.time;
                } else if (prayer.displayName === 'ערבית מוצאי חג') {
                    times.arvitMotzaiChag = prayer.time;
                }
            });
        }
    } else {
        alert('שגיאה: לא נמצאו נתונים תקינים ליצירת המסמך');
        return;
    }

    const doc = new docx.Document({
        styles: {
            paragraphStyles: [
                {
                    id: "headerStyle",
                    name: "Header Style",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 60,
                        bold: true,
                        underline: {},
                        color: "000000"
                    },
                },
                {
                    id: "subHeaderStyle",
                    name: "Sub Header Style",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 50,
                        color: "000000"
                    },
                },
                {
                    id: "normalStyle",
                    name: "Normal Style",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 44,
                        color: "000000"
                    },
                }
            ]
        },
        sections: [
            {
                children: [
                    new docx.Paragraph({
                        text: "בס\"ד",
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph({
                        text: "זמני תפילה שמחת תורה " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    
                    // זמני שמחת תורה
                    // שיר השירים רק בשבת
                    selectedDay === 'saturday' ? new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph(""),
                    
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    
                    new docx.Paragraph({
                        text: `מנחה ערב חג: ${times.minchaErevChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית: ${times.shachrit}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `הקפות: ${times.hakafot}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `מנחה: לאחר ההקפות`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    
                    // קהלת רק בשבת
                    selectedDay === 'saturday' ? new docx.Paragraph({
                        text: `קהלת: ${times.kohelet}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph(""),
                    
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    
                    // ערבית מוצאי חג בכל הימים (כולל שבת)
                    new docx.Paragraph({
                        text: `ערבית מוצאי חג: ${times.arvitMotzaiChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: "תוסיפו שנים רבות ומועדים טובים",
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "subHeaderStyle",
                        bidirectional: true
                    })
                ]
            }
        ]
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, `זמני_תפילה_שמחת_תורה_${selectedYear}_ערוך.docx`);
    });
}
