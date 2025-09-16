// shabat_chol_hamoed_sukkot.js

// פונקציה שמחזירה את התוכן HTML בלבד
function generateShabbatHolHamoedSukkotContent(selectedYear) {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    let times = {
        shirHashirim: addMinutesToTime(sunsetTime, -40),
        minchaErevShabbat: addMinutesToTime(sunsetTime, -15),
        shachrit: "8:00",
        kohelet: addMinutesToTime(sunsetTime, -150),
        mincha: addMinutesToTime(sunsetTime, -90),
        arvitMotzaiShabbat: addMinutesToTime(sunsetTime, 30)
    };

    let htmlContent = `
        <div style="text-align: center;">
            <table style="margin: 0 auto; border-collapse: collapse; width: 60%; max-width: 400px;">
                <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שיר השירים:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shirHashirim}</td></tr>
                <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה ערב שבת:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.minchaErevShabbat}</td></tr>
                <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>שחרית:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.shachrit}</td></tr>
                <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>קהלת:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.kohelet}</td></tr>
                <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>מנחה:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.mincha}</td></tr>
                <tr><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;"><strong>ערבית מוצאי שבת:</strong></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${times.arvitMotzaiShabbat}</td></tr>
            </table>
            <br><br>
            <p style="color: #2c5530; font-weight: bold; font-style: italic;">
                שבת שלום וחג שמח
            </p>
        </div>
    `;

    return htmlContent;
}

function generateShabbatHolHamoedSukkotDocument() {
    const sunsetTime = document.getElementById('sunset-time').value;

    const times = {
        shirHashirim: addMinutesToTime(sunsetTime, -45),
        minchaErevChag: addMinutesToTime(sunsetTime, -25),
        shachrit: "8:00",
        kohelet: addMinutesToTime(sunsetTime, -150),
        mincha: addMinutesToTime(sunsetTime, -90),
		matamane: addMinutesToTime(sunsetTime, 5),
        arvitMotzaiShabbat: addMinutesToTime(sunsetTime, 30)
    };

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
                        size: 58,
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
                        text: "זמני תפילה שבת חול המועד סוכות "+year,
                        alignment: docx.AlignmentType.CENTER,
                        heading: docx.HeadingLevel.HEADING_1,
                        style: "headerStyle"
                    }),
                    new docx.Paragraph(""),  // שורה ריקה
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    // זמני היום
                    new docx.Paragraph({
                        text: `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
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
                        text: `קהלת: ${times.kohelet}`,
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
                        text: `מת'אמנה: ${times.matamane}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
                    new docx.Paragraph({
                        text: `ערבית מוצאי שבת: ${times.arvitMotzaiShabbat}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),

                ]
            }
        ]
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "prayer_schedule_shabbat_hol_hamoed_sukkot.docx");
    });
}
