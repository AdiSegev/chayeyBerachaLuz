// yom_kippur.js

function generateYomKippurDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    let times;
    if (selectedDay === 'saturday') {
        times = {
			minchaErevKipur: "13:00",
            kabalatShabbat: addMinutesToTime(sunsetTime, -25),
            lechaEli: addMinutesToTime(sunsetTime, -10),
            shachrit:"7:30",
			mincha: addMinutesToTime(sunsetTime, -135),
            neilah: addMinutesToTime(sunsetTime, -40),
            arvit: addMinutesToTime(sunsetTime, 20),
			endTzom: addMinutesToTime(sunsetTime, 33)
        };
    } else {
        times = {
			minchaErevKipur: "13:00",
            lechaEli: addMinutesToTime(sunsetTime, -10),
			shachrit:"7:30",
            mincha: addMinutesToTime(sunsetTime, -135),
            neilah: addMinutesToTime(sunsetTime, -40),
            arvit: addMinutesToTime(sunsetTime, 20),
			endTzom: addMinutesToTime(sunsetTime, 33)
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
                        text: "זמני תפילה יום כיפורים " +year,
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