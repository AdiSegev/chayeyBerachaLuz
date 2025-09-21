// yom_kippur.js

// פונקציה מרכזית לחישוב זמני יום כיפור
function calculateYomKippurTimes(selectedDay, sunsetTime) {
    let times;
    if (selectedDay === 'saturday') {
        times = {
            minchaErevKipur: "13:00",
            kabalatShabbat: addMinutesToTime(sunsetTime, -25),
            lechaEli: addMinutesToTime(sunsetTime, -10),
            shachrit: "7:30",
            mincha: addMinutesToTime(sunsetTime, -135),
            neilah: addMinutesToTime(sunsetTime, -40),
            arvit: addMinutesToTime(sunsetTime, 20),
            endTzom: addMinutesToTime(sunsetTime, 33)
        };
    } else {
        times = {
            minchaErevKipur: "13:00",
            lechaEli: addMinutesToTime(sunsetTime, -10),
            shachrit: "7:30",
            mincha: addMinutesToTime(sunsetTime, -135),
            neilah: addMinutesToTime(sunsetTime, -40),
            arvit: addMinutesToTime(sunsetTime, 20),
            endTzom: addMinutesToTime(sunsetTime, 33)
        };
    }
    return times;
}

// פונקציה שמחזירה את התוכן HTML בלבד
function generateYomKippurContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    const times = calculateYomKippurTimes(selectedDay, sunsetTime);

    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    // זמני יום כיפור
    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב כיפור:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevKipur}</td></tr>
    `;

    if (selectedDay === 'saturday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>קבלת שבת:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.kabalatShabbat}</td></tr>
        `;
    }

    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>לכה אלי:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.lechaEli}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mincha}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>נעילה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.neilah}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvit}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>סיום הצום:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.endTzom}</td></tr>
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                גמר חתימה טובה
            </p>
        </div>
    `;

    return htmlContent;
}

function generateYomKippurDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;
    const selectedYear = document.getElementById('hebrew-year').value;

    const times = calculateYomKippurTimes(selectedDay, sunsetTime);

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
                        text: "זמני תפילה יום כיפורים " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    // זמני היום
                    ...(selectedDay === 'saturday'
                        ? [
                            new docx.Paragraph({
                                text: `מנחה ערב כיפור : ${times.minchaErevKipur}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),

                            new docx.Paragraph({
                                text: `קבלת שבת : ${times.kabalatShabbat}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `לך אלי : ${times.lechaEli}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `שחרית : ${times.shachrit}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `מנחה : ${times.mincha}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `נעילה : ${times.neilah}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `ערבית : ${times.arvit}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `סיום הצום : ${times.endTzom}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]
                        : [
                            new docx.Paragraph({
                                text: `מנחה ערב כיפור : ${times.minchaErevKipur}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `לך אלי : ${times.lechaEli}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `שחרית : ${times.shachrit}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `מנחה : ${times.mincha}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `נעילה : ${times.neilah}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `ערבית : ${times.arvit}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `סיום הצום: ${times.endTzom}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]),

                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: "\"תבושרו במחילה וסליחה וכפרה\"",
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "subHeaderStyle"
                    }),
                ],
            },
        ],
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "prayer_schedule_yom_kippur.docx");
    });
}

// יצירת קובץ Word מהנתונים הערוכים
function generateYomKippurWordFromEdited(editedData, selectedYear) {
    // חילוץ הזמנים מהנתונים הערוכים
    const times = {};
    let selectedDay = '';

    // המרת הנתונים הערוכים למערך לזיהוי קל יותר
    const prayerArray = Object.values(editedData).filter(item => !item.isHeader);

    // זיהוי יום השבוע לפי הזמנים הקיימים
    if (prayerArray.length > 0) {
        const firstPrayer = prayerArray[0].displayName;

        if (firstPrayer === 'מנחה ערב כיפור') {
            // זיהוי אם זה שבת או יום רגיל לפי כמות הזמנים
            if (prayerArray.length === 8) {
                // שבת - יש קבלת שבת
                selectedDay = 'saturday';
                times.minchaErevKipur = prayerArray[0].time;
                times.kabalatShabbat = prayerArray[1].time;
                times.lechaEli = prayerArray[2].time;
                times.shachrit = prayerArray[3].time;
                times.mincha = prayerArray[4].time;
                times.neilah = prayerArray[5].time;
                times.arvit = prayerArray[6].time;
                times.endTzom = prayerArray[7].time;
            } else {
                // יום רגיל - אין קבלת שבת
                selectedDay = 'other';
                times.minchaErevKipur = prayerArray[0].time;
                times.lechaEli = prayerArray[1].time;
                times.shachrit = prayerArray[2].time;
                times.mincha = prayerArray[3].time;
                times.neilah = prayerArray[4].time;
                times.arvit = prayerArray[5].time;
                times.endTzom = prayerArray[6].time;
            }
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
                        text: "זמני תפילה יום כיפורים " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),

                    // זמני יום כיפור
                    new docx.Paragraph({
                        text: `מנחה ערב כיפור: ${times.minchaErevKipur}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

                    ...(selectedDay === 'saturday'
                        ? [

                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `קבלת שבת: ${times.kabalatShabbat}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph("")
                        ] : [
                            new docx.Paragraph(""),
                            new docx.Paragraph("")
                        ]),

                    new docx.Paragraph({
                        text: `לכה אלי: ${times.lechaEli}`,
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
                        text: `מנחה: ${times.mincha}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `נעילה: ${times.neilah}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `ערבית: ${times.arvit}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `סיום הצום: ${times.endTzom}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: "תבושרו במחילה וסליחה וכפרה",
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
        saveAs(blob, `זמני_תפילה_יום_כיפור_${selectedYear}_ערוך.docx`);
    });
}