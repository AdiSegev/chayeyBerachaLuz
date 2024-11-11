// shvii_pesach.js

function generateShavuotDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    let times;
    if (selectedDay === 'monday' || selectedDay === 'wednesday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            shachrit: "8:00",
            rut: addMinutesToTime(sunsetTime, -75),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 25)
            
        };
    } else if (selectedDay === 'sunday') {
        times = {
            mizmorShelChag: addMinutesToTime(sunsetTime, 5),
            shachrit: "8:00",
            rut: addMinutesToTime(sunsetTime, -85),
            mincha: addMinutesToTime(sunsetTime, -15),
            arvitMotzaiChag: addMinutesToTime(sunsetTime, 25),
        };
    } else if (selectedDay === 'friday') {
        times = {
            minchaErevChag: addMinutesToTime(sunsetTime, -15),
            shachrit: "8:00",
			rut: addMinutesToTime(sunsetTime, -120),
            shirHashirim: addMinutesToTime(sunsetTime, -55),
            mincha: addMinutesToTime(sunsetTime, -35)           
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
                        text: "זמני תפילה לחג שבועות " + year,
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
                        text: `שחרית: ${times.shachrit}`,
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
                        text: selectedDay != 'friday' ? `מנחה: ${times.mincha}` :  `שיר השירים: ${times.shirHashirim}`,
                        alignment: docx.AlignmentType.CENTER,
                        bidirectional: true,
                        style: "normalStyle"
                    }),
                    new docx.Paragraph(""),
                    new docx.Paragraph(""),
				
					new docx.Paragraph({
                        text: selectedDay != 'friday' ? `ערבית מוצאי חג: ${times.arvitMotzaiChag}` :  `מנחה: ${times.mincha}`,
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
        saveAs(blob, "prayer_schedule_shvii_pesach.docx");
    });
}
