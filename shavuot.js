// shavuot.js

// פונקציה מרכזית לחישוב זמני שבועות
function calculateShavuotTimes(selectedDay, sunsetTime, dawnTime) {
    let resolvedDawn = dawnTime;
    if (!resolvedDawn && typeof shavuotHolidayDate !== 'undefined' && shavuotHolidayDate) {
        if (typeof DAWN_LOOKUP !== 'undefined' && DAWN_LOOKUP[shavuotHolidayDate]) {
            resolvedDawn = DAWN_LOOKUP[shavuotHolidayDate];
            shavuotDawnTime = resolvedDawn;
        } else {
            try {
                const json = KosherZmanim.getZmanimJson({
                    date: shavuotHolidayDate,
                    timeZoneId: "Asia/Jerusalem",
                    latitude: 31.849436,
                    longitude: 35.035721
                });
                if (json.BasicZmanim.Alos72) {
                    resolvedDawn = json.BasicZmanim.Alos72.split('T')[1].split('+')[0].slice(0, 5);
                    shavuotDawnTime = resolvedDawn;
                }
            } catch(e) {}
        }
    }
    const shachritA = resolvedDawn ? addMinutesToTime(resolvedDawn, 10) : '';
    let times;
    if (selectedDay === 'monday' || selectedDay === 'wednesday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            kriaMoed: "22:30",
            shachritA: shachritA,
            shachritB: "8:00",
            rut: addMinutesToTime(sunsetTime, -75),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30)
        };
    } else if (selectedDay === 'sunday') {
        times = {
            mizmorShelChag: addMinutesToTime(sunsetTime, 5),
            kriaMoed: "23:00",
            shachritA: shachritA,
            shachritB: "8:00",
            rut: addMinutesToTime(sunsetTime, -85),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30)
        };
    } else if (selectedDay === 'friday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            kriaMoed: "22:30",
            shachritA: shachritA,
            shachritB: "8:00",
            rut: addMinutesToTime(sunsetTime, -125),
            mincha: addMinutesToTime(sunsetTime, -50),
            shirHashirim: addMinutesToTime(sunsetTime, -25)
        };
    }
    return times;
}

// פונקציה שמחזירה את התוכן HTML בלבד
function generateShavuotContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    const times = calculateShavuotTimes(selectedDay, sunsetTime, typeof shavuotDawnTime !== 'undefined' ? shavuotDawnTime : '');

    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    if (selectedDay === 'sunday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מזמור של חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mizmorShelChag}</td></tr>
        `;
    } else {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevChag}</td></tr>
        `;
    }

    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>קריאי מועד:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.kriaMoed}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית (מניין א'):</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachritA}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית (מניין ב'):</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachritB}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>רות:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.rut}</td></tr>
    `;

    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mincha}</td></tr>
    `;

    if (selectedDay === 'friday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
        `;
    }

    if (selectedDay !== 'friday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית מוצאי חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvitMotzaiChag}</td></tr>
        `;
    }

    htmlContent += `
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                חג שבועות - זמן מתן תורתנו
            </p>
        </div>
    `;

    return htmlContent;
}

function generateShavuotDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;
    const selectedYear = document.getElementById('hebrew-year').value;

    const times = calculateShavuotTimes(selectedDay, sunsetTime, typeof shavuotDawnTime !== 'undefined' ? shavuotDawnTime : '');

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
                        text: "זמני תפילה לחג שבועות " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    
                    // זמני היום
					
					selectedDay === 'sunday' ? new docx.Paragraph({
                        text: `מזמור של חג: ${times.mizmorShelChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: `מנחה ערב חג: ${times.minchaErevChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `קריאי מועד: ${times.kriaMoed}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית (מניין א'): ${times.shachritA}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית (מניין ב'): ${times.shachritB}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `רות: ${times.rut}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `מנחה: ${times.mincha}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),

                    new docx.Paragraph({
                        text: selectedDay != 'friday' ? `ערבית מוצאי חג: ${times.arvitMotzaiChag}` : `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

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
        saveAs(blob, "prayer_schedule_shavuot.docx");
    });
}

// יצירת קובץ Word מהנתונים הערוכים
function generateShavuotWordFromEdited(editedData, selectedYear) {
    // חילוץ הזמנים מהנתונים הערוכים
    const times = {};
    let selectedDay = '';
    
    // המרת הנתונים הערוכים למערך לזיהוי קל יותר
    const prayerArray = Object.values(editedData).filter(item => !item.isHeader);
    
    // מיפוי לפי displayName
    prayerArray.forEach(prayer => {
        const name = prayer.displayName;
        if (name === 'מזמור של חג') { times.mizmorShelChag = prayer.time; selectedDay = 'sunday'; }
        else if (name === 'מנחה ערב חג') { times.minchaErevChag = prayer.time; if (!selectedDay) selectedDay = 'other'; }
        else if (name === 'קריאי מועד') { times.kriaMoed = prayer.time; }
        else if (name === "שחרית (מניין א')") { times.shachritA = prayer.time; }
        else if (name === "שחרית (מניין ב')") { times.shachritB = prayer.time; }
        else if (name === 'רות') { times.rut = prayer.time; }
        else if (name === 'מנחה') { times.mincha = prayer.time; }
        else if (name === 'שיר השירים') { times.shirHashirim = prayer.time; selectedDay = 'friday'; }
        else if (name === 'ערבית מוצאי חג') { times.arvitMotzaiChag = prayer.time; }
    });

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
                        text: "זמני תפילה לחג שבועות " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    
                    // זמני שבועות
                    // מזמור של חג רק בראשון
                    selectedDay === 'sunday' ? new docx.Paragraph({
                        text: `מזמור של חג: ${times.mizmorShelChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: `מנחה ערב חג: ${times.minchaErevChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `קריאי מועד: ${times.kriaMoed}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית (מניין א'): ${times.shachritA}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית (מניין ב'): ${times.shachritB}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `רות: ${times.rut}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `מנחה: ${times.mincha}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),

                    new docx.Paragraph({
                        text: selectedDay != 'friday' ? `ערבית מוצאי חג: ${times.arvitMotzaiChag}` : `שיר השירים: ${times.shirHashirim}`,
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
        saveAs(blob, `זמני_תפילה_שבועות_${selectedYear}_ערוך.docx`);
    });
}
