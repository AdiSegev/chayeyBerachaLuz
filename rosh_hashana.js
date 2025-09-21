// rosh_hashana.js

// פונקציה מרכזית לחישוב זמני ראש השנה
function calculateRoshHashanaTimes(selectedDay, sunsetTime) {
    let times;
    if (selectedDay === 'thursday') {
        times = {
            minchaErevYomtov: addMinutesToTime(sunsetTime, -20),
            shachrit: "7:30",
            tehillim: addMinutesToTime(sunsetTime, -80),
            minchaRoshHashana: addMinutesToTime(sunsetTime, -20),
            minchaYomTovSheni: addMinutesToTime(sunsetTime, -35),
            shirHashirim: sunsetTime,
            lechuNeranena: addMinutesToTime(sunsetTime, 25)
        };
    } else if (selectedDay === 'monday' || selectedDay === 'tuesday') {
        times = {
            minchaErevYomtov: addMinutesToTime(sunsetTime, -20),
            shachrit: "7:30",
            tehillim: addMinutesToTime(sunsetTime, -80),
            minchaRoshHashana: addMinutesToTime(sunsetTime, -20),
            tehillimYomTovSheni: addMinutesToTime(sunsetTime, -80),
            minchaYomTovSheni: addMinutesToTime(sunsetTime, -20),
            arvitYomTovSheni2: addMinutesToTime(sunsetTime, 30)
        };
    } else if (selectedDay === 'saturday') {
        times = {
            shirHashirim: addMinutesToTime(sunsetTime, -55),
            minchaErevYomtov: addMinutesToTime(sunsetTime, -30),
            shachrit: "7:30",
            tehillim: "16:00",
            minchaRoshHashana: "17:00",
            arvitYomTovSheni: addMinutesToTime(sunsetTime, 25),
            tehillimYomTovSheni: addMinutesToTime(sunsetTime, -80),
            minchaYomTovSheni: addMinutesToTime(sunsetTime, -20),
            arvitYomTovSheni2: addMinutesToTime(sunsetTime, 30)
        };
    }
    return times;
}

// פונקציה שמחזירה את התוכן HTML בלבד
function generateRoshHashanaContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    const times = calculateRoshHashanaTimes(selectedDay, sunsetTime);
    let firstDayTitle = "יום טוב ראשון";
    let secondDayTitle = "יום טוב שני";

    let htmlContent = `
        <div style="text-align: center;">
            <h2 style="color: #2c5530; margin-bottom: 20px;">${firstDayTitle}</h2>
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    // זמני היום הראשון
    if (selectedDay === 'saturday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב יו"ט:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevYomtov}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>תהילים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.tehillim}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaRoshHashana}</td></tr>
        `;
    } else {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב יו"ט:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevYomtov}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>תהילים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.tehillim}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaRoshHashana}</td></tr>
        `;
    }

    htmlContent += `
            </table>
            <br><br>
            <h2 style="color: #2c5530; margin-bottom: 20px;">${secondDayTitle}</h2>
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    // זמני היום השני
    if (selectedDay === 'thursday') {
        htmlContent += `           
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaYomTovSheni}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>לכו נרננה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.lechuNeranena}</td></tr>
        `;
    } else {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>תהילים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.tehillimYomTovSheni}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaYomTovSheni}</td></tr>
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvitYomTovSheni2}</td></tr>
        `;
    }

    htmlContent += `
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                בברכת תכתבו ותחתמו בספר החיים ובספר הזיכרון
            </p>
        </div>
    `;

    return htmlContent;
}

function generateRoshHashanaDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;
    const selectedYear = document.getElementById('hebrew-year').value;

    const times = calculateRoshHashanaTimes(selectedDay, sunsetTime);
    let firstDayTitle = "יום טוב ראשון";
    let secondDayTitle = "יום טוב שני";

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
                        size: 48,
                        color: "000000"
                    },
                },
                {
                    id: "subHeaderStyleUnderline",
                    name: "Sub Header Style Underline",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 50,
                        bold: true,
                        underline: {},
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
                        text: "זמני תפילה ראש השנה " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: firstDayTitle,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_2,
                        style: "subHeaderStyleUnderline"
                    }),
                    ...(selectedDay === 'saturday'
                        ? [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph(""),
                        ] : [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]),

                    // זמני היום הראשון
                    ...(selectedDay === 'saturday'
                        ? [
                            new docx.Paragraph({
                                text: `שיר השירים: ${times.shirHashirim}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `מנחה ערב יו"ט: ${times.minchaErevYomtov}`,
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
                                text: `תהילים: ${times.tehillim}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `מנחה: ${times.minchaRoshHashana}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),

                        ]
                        : [
                            new docx.Paragraph({
                                text: `מנחה ערב יו"ט: ${times.minchaErevYomtov}`,
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
                                text: `תהילים: ${times.tehillim}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `מנחה: ${times.minchaRoshHashana}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]),
                    new docx.Paragraph(""),
                    // כותרת יום טוב שני
                    new docx.Paragraph({
                        text: secondDayTitle,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_2,
                        style: "subHeaderStyleUnderline"
                    }),
                    ...(selectedDay === 'saturday'
                        ? [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph(""),
                        ] : [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]),
                    // זמני היום השני
                    ...(selectedDay === 'thursday'
                        ? [
                            new docx.Paragraph({
                                text: `שחרית : ${times.shachrit}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `מנחה: ${times.minchaYomTovSheni}`,
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
                                text: `לכו נרננה: ${times.lechuNeranena}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]
                        : selectedDay === 'saturday'
                            ? [
                                new docx.Paragraph({
                                    text: `ערבית : ${times.arvitYomTovSheni}`,
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
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                                new docx.Paragraph({
                                    text: `תהילים: ${times.tehillimYomTovSheni}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                                new docx.Paragraph({
                                    text: `מנחה: ${times.minchaYomTovSheni}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                                new docx.Paragraph({
                                    text: `ערבית: ${times.arvitYomTovSheni2}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                            ]
                            : [
                                new docx.Paragraph({
                                    text: `שחרית : ${times.shachrit}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                                new docx.Paragraph({
                                    text: `תהילים: ${times.tehillimYomTovSheni}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                                new docx.Paragraph({
                                    text: `מנחה: ${times.minchaYomTovSheni}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                                new docx.Paragraph({
                                    text: `ערבית: ${times.arvitYomTovSheni2}`,
                                    alignment: docx.AlignmentType.CENTER,
                                    bidirectional: true,
                                    style: "normalStyle"
                                }),
                                new docx.Paragraph(""),
                                new docx.Paragraph(""),
                            ]),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: "בברכת תכתבו ותחתמו בספר החיים ובספר הזיכרון",
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
        saveAs(blob, "prayer_schedule_rosh_hashana.docx");
    });
}

// יצירת קובץ Word מהנתונים הערוכים
function generateRoshHashanaWordFromEdited(editedData, selectedYear) {
    // חילוץ הזמנים מהנתונים הערוכים
    const times = {};
    let selectedDay = '';
    let firstDayTitle = "יום טוב ראשון";
    let secondDayTitle = "יום טוב שני";

    // המרת הנתונים הערוכים למערך לזיהוי קל יותר
    const prayerArray = Object.values(editedData).filter(item => !item.isHeader);

    // זיהוי יום השבוע לפי הזמנים הקיימים
    if (prayerArray.length > 0) {
        const firstPrayer = prayerArray[0].displayName;

        if (firstPrayer === 'שיר השירים') {
            selectedDay = 'saturday';
            // שבת - יום ראשון
            times.shirHashirim = prayerArray[0].time;
            times.minchaErevYomtov = prayerArray[1].time;
            times.shachrit = prayerArray[2].time;
            times.tehillim = prayerArray[3].time;
            times.minchaRoshHashana = prayerArray[4].time;
            // יום שני
            times.shachrit2 = prayerArray[5].time;
            times.tehillimYomTovSheni = prayerArray[6].time;
            times.minchaYomTovSheni = prayerArray[7].time;
            times.arvitYomTovSheni2 = prayerArray[8].time;
        } else if (firstPrayer === 'מנחה ערב יו"ט') {
            // זיהוי אם זה חמישי או שני/שלישי לפי כמות הזמנים
            if (prayerArray.length === 7) {
                // חמישי
                selectedDay = 'thursday';
                times.minchaErevYomtov = prayerArray[0].time;
                times.shachrit = prayerArray[1].time;
                times.tehillim = prayerArray[2].time;
                times.minchaRoshHashana = prayerArray[3].time;
                times.minchaYomTovSheni = prayerArray[4].time;
                times.shirHashirim = prayerArray[5].time;
                times.lechuNeranena = prayerArray[6].time;
            } else {
                // שני/שלישי
                selectedDay = 'monday';
                times.minchaErevYomtov = prayerArray[0].time;
                times.shachrit = prayerArray[1].time;
                times.tehillim = prayerArray[2].time;
                times.minchaRoshHashana = prayerArray[3].time;
                times.shachrit2 = prayerArray[4].time;
                times.tehillimYomTovSheni = prayerArray[5].time;
                times.minchaYomTovSheni = prayerArray[6].time;
                times.arvitYomTovSheni2 = prayerArray[7].time;
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
                        size: 48,
                        color: "000000"
                    },
                },
                {
                    id: "subHeaderStyleUnderline",
                    name: "Sub Header Style Underline",
                    basedOn: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Narkisim",
                        size: 50,
                        bold: true,
                        underline: {},
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
                        text: "זמני תפילה ראש השנה " + selectedYear,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),

                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: firstDayTitle,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_2,
                        style: "subHeaderStyleUnderline"
                    }),

                    // זמני היום הראשון
                    ...(selectedDay === 'saturday'
                        ? [
                            new docx.Paragraph(""),   // שורה ריקה
                            new docx.Paragraph(""),
                            new docx.Paragraph({
                                text: `שיר השירים: ${times.shirHashirim}`,
                                alignment: docx.AlignmentType.CENTER,
                                bidirectional: true,
                                style: "normalStyle"
                            }),
                            
                        ] : [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph("")
                            
                        ]),

                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `מנחה ערב יו"ט: ${times.minchaErevYomtov}`,
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
                        text: `תהילים: ${times.tehillim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `מנחה: ${times.minchaRoshHashana}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

                    // מרווח בין הימים
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    selectedDay === 'saturday' ? new docx.Paragraph("") : new docx.Paragraph(""),

                    new docx.Paragraph({
                        text: secondDayTitle,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_2,
                        style: "subHeaderStyleUnderline"
                    }),
                    ...(selectedDay === 'saturday'
                        ? [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph(""),
                        ] : [
                            new docx.Paragraph(""),  // שורה ריקה
                            new docx.Paragraph(""),
                            new docx.Paragraph(""),
                        ]),

                    // זמני היום השני
                    selectedDay === 'thursday' ? new docx.Paragraph({
                        text: `מנחה: ${times.minchaYomTovSheni}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: `שחרית: ${times.shachrit2 || times.shachrit}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

                    new docx.Paragraph(""),
                    new docx.Paragraph(""),

                    selectedDay === 'thursday' ? new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: `תהילים: ${times.tehillimYomTovSheni}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

                    new docx.Paragraph(""),
                    new docx.Paragraph(""),

                    selectedDay === 'thursday' ? new docx.Paragraph({
                        text: `לכו נרננה: ${times.lechuNeranena}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: `מנחה: ${times.minchaYomTovSheni}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

                    // ערבית רק לשני/שלישי/שבת
                    selectedDay !== 'thursday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    selectedDay !== 'thursday' ? new docx.Paragraph("") : new docx.Paragraph(""),
                    selectedDay !== 'thursday' ? new docx.Paragraph({
                        text: `ערבית: ${times.arvitYomTovSheni2}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph(""),

                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: "בברכת תכתבו ותחתמו בספר החיים ובספר הזיכרון",
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
        saveAs(blob, `זמני_תפילה_ראש_השנה_${selectedYear}_ערוך.docx`);
    });
}