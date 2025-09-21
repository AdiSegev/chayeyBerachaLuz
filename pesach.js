// pesach.js

// פונקציה מרכזית לחישוב זמני פסח
function calculatePesachTimes(selectedDay, sunsetTime) {
    let times;
    if (selectedDay === 'tuesday' || selectedDay === 'thursday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            shachrit: "8:30",
            shirHashirim: addMinutesToTime(sunsetTime, -75),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30),
            shachritCholHamoed: "7:00"
        };
    } else if (selectedDay === 'saturday') {
        times = {
            shirHashirimBeforeMincha: addMinutesToTime(sunsetTime, -45),
            minchaErevChag: addMinutesToTime(sunsetTime, -25),
            shachrit: "8:30",
            shirHashirim: addMinutesToTime(sunsetTime, -150),
            mincha: addMinutesToTime(sunsetTime, -90),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30),
            shachritCholHamoed: "7:00"
        };
    } else if (selectedDay === 'sunday') {
        times = {
            mizmorShelChag: addMinutesToTime(sunsetTime, 5),
            shachrit: "8:30",
            shirHashirim: addMinutesToTime(sunsetTime, -85),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30),
            shachritCholHamoed: "7:00"
        };
    }
    return times;
}

// פונקציה שמחזירה את התוכן HTML בלבד
function generatePesachContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    const times = calculatePesachTimes(selectedDay, sunsetTime);

    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    if (selectedDay === 'saturday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirimBeforeMincha}</td></tr>
        `;
    } else if (selectedDay === 'sunday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מזמור של חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mizmorShelChag}</td></tr>
        `;
    }

    // הוספת מנחה ערב חג רק אם זה לא ראשון (שמתחיל במזמור של חג)
    if (selectedDay !== 'sunday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevChag}</td></tr>
        `;
    }
    
    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mincha}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית מוצאי חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvitMotzaiChag}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית חול המועד:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachritCholHamoed}</td></tr>
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                חג כשר ושמח - זמן חרותנו
            </p>
        </div>
    `;

    return htmlContent;
}

function generatePesachDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;
    const selectedYear = document.getElementById('hebrew-year').value;

    const times = calculatePesachTimes(selectedDay, sunsetTime);

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
                        text: "זמני תפילה חג פסח "+selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
					new docx.Paragraph(""),
					
                    
                    // זמני היום
                    selectedDay === 'saturday' ? new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirimBeforeMincha}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: "",
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
					
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
                        text: `שחרית: ${times.shachrit}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirim}`,
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
                        text: `ערבית מוצאי חג: ${times.arvitMotzaiChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
					new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית חול המועד: ${times.shachritCholHamoed}`,
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
        saveAs(blob, "prayer_schedule_pesach.docx");
    });
}

// יצירת קובץ Word מהנתונים הערוכים
function generatePesachWordFromEdited(editedData, selectedYear) {
    // חילוץ הזמנים מהנתונים הערוכים
    const times = {};
    let selectedDay = '';
    
    // המרת הנתונים הערוכים למערך לזיהוי קל יותר
    const prayerArray = Object.values(editedData).filter(item => !item.isHeader);
    
    // זיהוי יום השבוע לפי הזמן הראשון
    if (prayerArray.length > 0) {
        const firstPrayer = prayerArray[0].displayName;
        
        if (firstPrayer === 'שיר השירים') {
            selectedDay = 'saturday';
            times.shirHashirimBeforeMincha = prayerArray[0].time;
            times.minchaErevChag = prayerArray[1].time;
            times.shachrit = prayerArray[2].time;
            times.shirHashirim = prayerArray[3].time;
            times.mincha = prayerArray[4].time;
            times.arvitMotzaiChag = prayerArray[5].time;
            times.shachritCholHamoed = prayerArray[6].time;
        } else if (firstPrayer === 'מזמור של חג') {
            selectedDay = 'sunday';
            times.mizmorShelChag = prayerArray[0].time;
            times.shachrit = prayerArray[1].time;
            times.shirHashirim = prayerArray[2].time;
            times.mincha = prayerArray[3].time;
            times.arvitMotzaiChag = prayerArray[4].time;
            times.shachritCholHamoed = prayerArray[5].time;
        } else {
            // שלישי או חמישי (מתחיל במנחה ערב חג)
            selectedDay = 'tuesday';
            times.minchaErevChag = prayerArray[0].time;
            times.shachrit = prayerArray[1].time;
            times.shirHashirim = prayerArray[2].time;
            times.mincha = prayerArray[3].time;
            times.arvitMotzaiChag = prayerArray[4].time;
            times.shachritCholHamoed = prayerArray[5].time;
        }
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
                        text: "זמני תפילה חג פסח "+selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
					new docx.Paragraph(""),
					
                    
                    // זמני היום
                    selectedDay === 'saturday' ? new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirimBeforeMincha}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: "",
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
					
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
                        text: `שחרית: ${times.shachrit}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirim}`,
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
                        text: `ערבית מוצאי חג: ${times.arvitMotzaiChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
					new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `שחרית חול המועד: ${times.shachritCholHamoed}`,
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
        saveAs(blob, `זמני_תפילה_פסח_${selectedYear}_ערוך.docx`);
    });
}
