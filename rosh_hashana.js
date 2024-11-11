// rosh_hashana.js

function generateRoshHashanaDocument() {
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;

    let times;
    let firstDayTitle = "יום טוב ראשון";
    let secondDayTitle = "יום טוב שני";

    if (selectedDay === 'thursday') {
        times = {
            minchaErevYomtov: addMinutesToTime(sunsetTime, -20),
			shachrit:"7:30",
            tehillim: addMinutesToTime(sunsetTime, -80),
            minchaRoshHashana: addMinutesToTime(sunsetTime, -20),
            arvitYomTovSheni: addMinutesToTime(sunsetTime, 25),
            minchaYomTovSheni: addMinutesToTime(sunsetTime, -35),
            shirHashirim: sunsetTime,
            lechuNeranena: addMinutesToTime(sunsetTime, 25)
        };
    } else if (selectedDay === 'monday' || selectedDay === 'tuesday') {
        times = {
            minchaErevYomtov: addMinutesToTime(sunsetTime, -20),
			shachrit:"7:30",
            tehillim: addMinutesToTime(sunsetTime, -80),
            minchaRoshHashana: addMinutesToTime(sunsetTime, -20),
            arvitYomTovSheni: addMinutesToTime(sunsetTime, 25),
            tehillimYomTovSheni: addMinutesToTime(sunsetTime, -80),
            minchaYomTovSheni: addMinutesToTime(sunsetTime, -20),
            arvitYomTovSheni2: addMinutesToTime(sunsetTime, 25)
        };
    } else if (selectedDay === 'saturday') {
        times = {
            shirHashirim: addMinutesToTime(sunsetTime, -55),
            minchaErevYomtov: addMinutesToTime(sunsetTime, -30),
			shachrit:"7:30",
            tehillim: "16:00",
            minchaRoshHashana: "17:00",
            arvitYomTovSheni: addMinutesToTime(sunsetTime, 25),
            tehillimYomTovSheni: addMinutesToTime(sunsetTime, -80),
            minchaYomTovSheni: addMinutesToTime(sunsetTime, -20),
            arvitYomTovSheni2: addMinutesToTime(sunsetTime, 25)
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
                        text: "זמני תפילה ראש השנה " +year,
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
                    new docx.Paragraph(""),  // שורה ריקה
					new docx.Paragraph(""),
					new docx.Paragraph(""),
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
                    new docx.Paragraph(""),  // שורה ריקה
					new docx.Paragraph(""),
					new docx.Paragraph(""),
                    // זמני היום השני
                    ...(selectedDay === 'thursday'
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