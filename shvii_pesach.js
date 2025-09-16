// shvii_pesach.js

// פונקציה שמחזירה את התוכן HTML בלבד
function generateShviiPesachContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    let times;
    if (selectedDay === 'monday' || selectedDay === 'wednesday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            shachrit: "8:00",
            shirHashirim: addMinutesToTime(sunsetTime, -75),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 25)
        };
    } else if (selectedDay === 'saturday') {
        times = {
            shirHashirimBeforeMincha: addMinutesToTime(sunsetTime, -50),
            minchaErevChag: addMinutesToTime(sunsetTime, -25),
            shachrit: "8:00",
            shirHashirim: addMinutesToTime(sunsetTime, -150),
            mincha: addMinutesToTime(sunsetTime, -90),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30)
        };
    } else if (selectedDay === 'friday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -25),
            shachrit: "8:00",
            shirHashirim: addMinutesToTime(sunsetTime, -90),
            mincha: addMinutesToTime(sunsetTime, -25)
        };
    }

    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
    `;

    if (selectedDay === 'saturday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirimBeforeMincha}</td></tr>
        `;
    }

    htmlContent += `
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevChag}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
        <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mincha}</td></tr>
    `;

    if (selectedDay !== 'friday') {
        htmlContent += `
            <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית מוצאי חג:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvitMotzaiChag}</td></tr>
        `;
    }

    htmlContent += `
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                שביעי של פסח - זמן חרותנו
            </p>
        </div>
    `;

    return htmlContent;
}

function generateShviiPesachDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    let times;
    if (selectedDay === 'monday' || selectedDay === 'wednesday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            shachrit: "8:00",
            shirHashirim: addMinutesToTime(sunsetTime, -75),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 25)
            
        };
    } else if (selectedDay === 'saturday') {
        times = {
            shirHashirimBeforeMincha: addMinutesToTime(sunsetTime, -50),
            minchaErevChag: addMinutesToTime(sunsetTime, -25),
            shachrit: "8:00",
            shirHashirim: addMinutesToTime(sunsetTime, -150),
            mincha: addMinutesToTime(sunsetTime, -90),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 30)
        };
    } else if (selectedDay === 'friday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -25),
            shachrit: "8:00",
            shirHashirim: addMinutesToTime(sunsetTime, -90),
            mincha: addMinutesToTime(sunsetTime, -25)
            
        };
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
                        text: "זמני תפילה שביעי של פסח " + year,
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
                        text: `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: selectedDay != 'friday' ? `מנחה: ${times.mincha}` :  `מנחה ערב שבת: ${times.mincha}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
				
					selectedDay != 'friday' ? new docx.Paragraph({
                        text: `ערבית מוצאי חג: ${times.arvitMotzaiChag}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }) : new docx.Paragraph({
                        text: "",
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
        saveAs(blob, "prayer_schedule_shvii_pesach.docx");
    });
}
