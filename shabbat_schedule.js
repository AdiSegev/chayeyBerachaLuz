// shabbat_schedule.js
// חישוב זמני תפילות שבת עונתיים

// מיפוי שם פרשה אנגלי (Hebcal) לעברי
const PARASHA_MAP = {
    "Parashat Bereshit": "בראשית",
    "Parashat Noach": "נח",
    "Parashat Lech-Lecha": "לך לך",
    "Parashat Vayera": "וירא",
    "Parashat Chayei Sara": "חיי שרה",
    "Parashat Toldot": "תולדות",
    "Parashat Vayetzei": "ויצא",
    "Parashat Vayishlach": "וישלח",
    "Parashat Vayeshev": "וישב",
    "Parashat Miketz": "מקץ",
    "Parashat Vayigash": "ויגש",
    "Parashat Vayechi": "ויחי",
    "Parashat Shemot": "שמות",
    "Parashat Vaera": "וארא",
    "Parashat Va'era": "וארא",
    "Parashat Bo": "בא",
    "Parashat Beshalach": "בשלח",
    "Parashat Yitro": "יתרו",
    "Parashat Mishpatim": "משפטים",
    "Parashat Terumah": "תרומה",
    "Parashat Tetzaveh": "תצוה",
    "Parashat Ki Tisa": "כי תשא",
    "Parashat Vayakhel-Pekudei": "ויקהל פקודי",
    "Parashat Vayakhel": "ויקהל",
    "Parashat Pekudei": "פקודי",
    "Parashat Vayikra": "ויקרא",
    "Parashat Tzav": "צו",
    "Parashat Shmini": "שמיני",
    "Parashat Shemini": "שמיני",
    "Parashat Tazria-Metzora": "תזריע מצורע",
    "Parashat Tazria": "תזריע",
    "Parashat Metzora": "מצורע",
    "Parashat Achrei Mot-Kedoshim": "אחרי - קדושים",
    "Parashat Achrei Mot": "אחרי מות",
    "Parashat Kedoshim": "קדושים",
    "Parashat Emor": "אמור",
    "Parashat Behar-Bechukotai": "בהר - בחוקותי",
    "Parashat Behar": "בהר",
    "Parashat Bechukotai": "בחוקותי",
    "Parashat Bamidbar": "במדבר",
    "Parashat Nasso": "נשא",
    "Parashat Beha'alotcha": "בהעלותך",
    "Parashat Sh'lach": "שלח",
    "Parashat Shlach": "שלח",
    "Parashat Korach": "קורח",
    "Parashat Chukat": "חוקת",
    "Parashat Chukat-Balak": "חוקת בלק",
    "Parashat Balak": "בלק",
    "Parashat Pinchas": "פנחס",
    "Parashat Matot-Masei": "מטות מסעי",
    "Parashat Matot": "מטות",
    "Parashat Masei": "מסעי",
    "Parashat Devarim": "דברים",
    "Parashat Vaetchanan": "ואתחנן",
    "Parashat Eikev": "עקב",
    "Parashat Re'eh": "ראה",
    "Parashat Shoftim": "שופטים",
    "Parashat Ki Teitzei": "כי תצא",
    "Parashat Ki Tavo": "כי תבוא",
    "Parashat Nitzavim-Vayeilech": "ניצבים-וילך",
    "Parashat Nitzavim": "ניצבים",
    "Parashat Vayeilech": "וילך",
    "Parashat Ha'Azinu": "האזינו",
    "Parashat Haazinu": "האזינו"
};

// אותיות עבריות לפרקים
const HEB_NUMS = [
    '', "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ז'", "ח'", "ט'", "י'",
    'י"א', 'י"ב', 'י"ג', 'י"ד', 'ט"ו', 'ט"ז', 'י"ז', 'י"ח', 'י"ט', "כ'",
    'כ"א', 'כ"ב', 'כ"ג', 'כ"ד', 'כ"ה', 'כ"ו', 'כ"ז', 'כ"ח', 'כ"ט', "ל'", 'ל"א'
];

// זוגות פרקי משלי לקיץ
function getMishleiText(pairIndex) {
    // pairIndex=0 → א'-ב', 1 → ג'-ד', ... 14 → כ"ט-ל', 15 → ל"א
    if (pairIndex >= 15) return HEB_NUMS[31]; // ל"א בלבד
    const a = pairIndex * 2 + 1;
    const b = a + 1;
    return HEB_NUMS[a] + '-' + HEB_NUMS[b];
}

// השוואת שעות כ-string "HH:MM" — מחזיר את הקטן/גדול
function timeMinStr(a, b) {
    return a <= b ? a : b;
}
function timeMaxStr(a, b) {
    return a >= b ? a : b;
}

// עיגול לדקות כפולות של 5
function roundToNearest5(timeStr, direction) {
    const [h, m] = timeStr.split(':').map(Number);
    let totalMin = h * 60 + m;
    let rounded;
    if (direction === 'down') {
        rounded = Math.round(totalMin / 5) * 5;  // nearest-5 (summer מנחה)
    } else {
        rounded = Math.ceil(totalMin / 5) * 5;   // always up (winter)
    }
    const rh = Math.floor(rounded / 60);
    const rm = rounded % 60;
    return String(rh).padStart(2, '0') + ':' + String(rm).padStart(2, '0');
}

// עיגול למטה (floor) לדקות כפולות של 5 — לערבית קיץ
function roundFloor5(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMin = h * 60 + m;
    const rounded = Math.floor(totalMin / 5) * 5;
    return String(Math.floor(rounded / 60)).padStart(2, '0') + ':' + String(rounded % 60).padStart(2, '0');
}

// בדיקה האם תאריך נמצא בשעון קיץ ישראלי
function isInDST(dateStr) {
    // ישראל 2025: 30.3 – 25.10 | ישראל 2026: 29.3 – 25.10
    return (dateStr >= '2025-03-30' && dateStr <= '2025-10-25') ||
           (dateStr >= '2026-03-29' && dateStr <= '2026-10-25');
}

// מחזיר תאריך שישי מתוך תאריך שבת (YYYY-MM-DD)
function getFridayDateStr(satDateStr) {
    const d = new Date(satDateStr + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

// ----------------------------------------------------------------
// הגדרות חישוב
// ----------------------------------------------------------------
function getSettings() {
    const v = (id, def) => {
        const el = document.getElementById(id);
        return el ? el.value : def;
    };
    const n = (id, def) => parseInt(v(id, def)) || def;
    return {
        minchaOffset:         n('setting-mincha-offset', 20),
        minchaRoundSummer:    v('setting-mincha-round-summer', 'floor'),
        minchaRoundWinter:    v('setting-mincha-round-winter', 'nearest'),
        arvitOffsetSummer:    n('setting-arvit-offset-summer', 35),
        arvitOffsetWinter:    n('setting-arvit-offset-winter', 40),
        arvitCap:             v('setting-arvit-cap', '20:15'),
        arvitMinGap:          n('setting-arvit-min-gap', 30),
        minchaShabbatSummer:  v('setting-mincha-shabbat-summer', '17:00'),
        minchaShabbatWinter:  v('setting-mincha-shabbat-winter', '12:45'),
        shirOffset:           n('setting-shir-offset', 25),
        tamhanaOffset:        n('setting-tamhana-offset', 25),
    };
}

function resetShabbatSettings() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('setting-mincha-offset', 20);
    set('setting-mincha-round-summer', 'floor');
    set('setting-mincha-round-winter', 'nearest');
    set('setting-arvit-offset-summer', 35);
    set('setting-arvit-offset-winter', 40);
    set('setting-arvit-cap', '20:15');
    set('setting-arvit-min-gap', 30);
    set('setting-mincha-shabbat-summer', '17:00');
    set('setting-mincha-shabbat-winter', '12:45');
    set('setting-shir-offset', 25);
    set('setting-tamhana-offset', 25);
}

// שליפת זמן שקיעה מהטבלה הסטטית
function getSunsetFromLookup(dateStr) {
    const t = SUNSET_LOOKUP[dateStr];
    if (!t) throw new Error(`No sunset data for ${dateStr}`);
    return t;
}

// חישוב זמני שבת אחת
function calcOneShabbatTimes(friDateStr, satDateStr, season, settings) {
    const s = settings || getSettings();
    const friSunset = getSunsetFromLookup(friDateStr);
    const satSunset = getSunsetFromLookup(satDateStr);

    // מנחה ערב שבת
    const minchaRaw = addMinutesToTime(friSunset, -s.minchaOffset);
    const minchaRound = isInDST(friDateStr) ? s.minchaRoundSummer : s.minchaRoundWinter;
    const mincha = minchaRound === 'floor' ? roundFloor5(minchaRaw) : roundToNearest5(minchaRaw, 'down');

    // ערבית מוצאי שבת
    let arvit;
    if (isInDST(satDateStr)) {
        const arvitBase  = addMinutesToTime(satSunset, s.arvitOffsetSummer);
        const arvitFloor = roundFloor5(arvitBase);
        const minGap     = addMinutesToTime(satSunset, s.arvitMinGap);
        if (arvitFloor > s.arvitCap && s.arvitCap >= minGap) {
            arvit = s.arvitCap;
        } else {
            arvit = arvitFloor;
        }
    } else {
        const arvitBase = addMinutesToTime(satSunset, s.arvitOffsetWinter);
        arvit = roundToNearest5(arvitBase, 'down');
    }

    return { mincha, arvit };
}

// ----------------------------------------------------------------
// שליפת נתוני Hebcal ובניית שורות הלוח
// ----------------------------------------------------------------
async function fetchHebrewCalendar(yearNum) {
    const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${yearNum}&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&M=on&s=on&yt=H&i=on`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Hebcal fetch failed');
    return (await resp.json()).items;
}

// נרמול אפוסטרוף לפני חיפוש במיפוי (Hebcal מחזיר U+2019 במקום U+0027)
function translateParasha(title) {
    const normalized = title.replace(/[\u2018\u2019\u02bc\u02b9]/g, "'");
    return PARASHA_MAP[normalized] || PARASHA_MAP[normalized.replace(/ha'a/i, "Ha'A")] || normalized;
}

// מחזיר תאריך (YYYY-MM-DD) של חג לפי שם אנגלי חלקי
function findHolidayDate(items, titleIncludes) {
    const item = items.find(i => i.title && i.title.includes(titleIncludes));
    return item ? item.date : null;
}

async function buildShabbatRows(season) {
    const yearNum = numericYear;
    const items = await fetchHebrewCalendar(yearNum);

    // גבולות עונה
    const pesachVIIDate  = findHolidayDate(items, 'Pesach VII');
    const shavuotDate    = findHolidayDate(items, 'Shavuot I') || findHolidayDate(items, 'Shavuot');
    const simchatTorah   = findHolidayDate(items, 'Shmini Atzeret') || findHolidayDate(items, 'Simchat Torah');

    // שבתות (פרשיות): category=parashat, יש date
    const shabbatot = items.filter(i => i.category === 'parashat' && i.date);

    let filtered;
    if (season === 'summer') {
        // אחרי שביעי של פסח ועד סוף השנה
        filtered = shabbatot.filter(i => i.date > pesachVIIDate);
    } else {
        // חורף: אחרי שמחת תורה ועד לפני שביעי של פסח — שניהם בתוך אותה שנה עברית
        filtered = shabbatot.filter(i => i.date > simchatTorah && i.date < pesachVIIDate);
    }

    // מיין לפי תאריך
    filtered.sort((a, b) => a.date.localeCompare(b.date));

    // בניית שורות
    const rows = [];
    let avotIndex = 0;     // 0–5 → פרקי אבות א'–ו'
    let mishleiIndex = 0;  // 0+ → זוגות משלי
    let passedShavuot = false;
    let firstAfterShavuot = false; // נשא - השבת הראשונה אחרי שבועות

    const settings = getSettings();
    for (const shab of filtered) {
        const satDate = shab.date;
        const friDate = getFridayDateStr(satDate);
        const times   = calcOneShabbatTimes(friDate, satDate, season, settings);

        const hebrewName = translateParasha(shab.title);

        let limud = '';
        let shirHashirimTime = null;

        if (season === 'summer') {
            if (!passedShavuot && shavuotDate && satDate < shavuotDate) {
                // לפני שבועות: פרקי אבות
                limud = 'אבות ' + (HEB_NUMS[avotIndex + 1] || '');
                avotIndex++;
            } else {
                if (!passedShavuot) {
                    passedShavuot = true;
                    firstAfterShavuot = true;
                }
                if (firstAfterShavuot) {
                    // שבת ראשונה אחרי שבועות: שיר השירים + משלי א'-ב'
                    shirHashirimTime = addMinutesToTime(times.mincha, -settings.shirOffset);
                    limud = 'משלי ' + getMishleiText(mishleiIndex);
                    mishleiIndex++;
                    firstAfterShavuot = false;
                } else {
                    limud = 'משלי ' + getMishleiText(mishleiIndex);
                    mishleiIndex++;
                }
            }
        }

        rows.push({
            parasha: hebrewName,
            mincha: times.mincha,
            shirHashirimTime,  // null אלא אם שבת ראשונה אחרי שבועות
            limud,
            arvit: times.arvit,
            date: satDate
        });
    }

    return rows;
}

// ----------------------------------------------------------------
// יצירת HTML לתצוגה
// ----------------------------------------------------------------
function generateShabbatScheduleHTML(rows, season, hebrewYear) {
    const isSummer = season === 'summer';
    const title = `זמני תפילות ${isSummer ? 'קיץ' : 'חורף'} ${hebrewYear} - מניין תימני - חיי ברכה`;

    // פיצול זהה לייצוא Word: קיץ→דברים, חורף→יתרו
    const splitParasha = isSummer ? 'דברים' : 'יתרו';
    const splitIdx = rows.findIndex(r => r.parasha === splitParasha);
    const part1 = splitIdx >= 0 ? rows.slice(0, splitIdx) : rows;
    const part2 = splitIdx >= 0 ? rows.slice(splitIdx) : [];

    const colHeaders = isSummer
        ? `<th>פרשה</th><th>מנחה ערב שבת</th><th>לימוד</th><th>ערבית מוצ"ש</th>`
        : `<th>פרשה</th><th>מנחה ערב שבת</th><th>ערבית מוצ"ש</th>`;

    function buildRows(rowList) {
        return rowList.map(r => {
            let minchaCell = r.mincha;
            if (r.shirHashirimTime) {
                minchaCell = `שיר השירים ${r.shirHashirimTime}<br><small>(מנחה ${r.mincha})</small>`;
            }
            if (isSummer) {
                return `<tr>
                    <td>${r.parasha}</td>
                    <td>${minchaCell}</td>
                    <td>${r.limud}</td>
                    <td>${r.arvit}</td>
                </tr>`;
            } else {
                return `<tr>
                    <td>${r.parasha}</td>
                    <td>${minchaCell}</td>
                    <td>${r.arvit}</td>
                </tr>`;
            }
        }).join('');
    }

    const s2 = getSettings();
    const minchaShabbat = isSummer ? s2.minchaShabbatSummer : s2.minchaShabbatWinter;
    const footer = `
        <div class="schedule-footer">
            <p>שיר השירים ערב שבת – ${s2.shirOffset} דק' לפני מנחה.</p>
            <p>מנחה בשבת – ${minchaShabbat}.</p>
            <p>מת'אמנה במוצ"ש – ${s2.tamhanaOffset} דק' לפני ערבית.</p>
        </div>`;

    let html = `
        <div id="shabbat-schedule-output" dir="rtl">
            <h2 class="schedule-title">${title}</h2>
            <table class="schedule-table">
                <thead><tr>${colHeaders}</tr></thead>
                <tbody>${buildRows(part1)}</tbody>
            </table>
            ${footer}`;

    if (part2.length > 0) {
        html += `
            <table class="schedule-table" style="margin-top:20px;">
                <thead><tr>${colHeaders}</tr></thead>
                <tbody>${buildRows(part2)}</tbody>
            </table>
            ${footer}`;
    }

    html += `</div>`;
    return html;
}

// ----------------------------------------------------------------
// ייצוא Word
// ----------------------------------------------------------------
function buildDocxTable(rows, isSummer) {
    const headerCells = isSummer
        ? ['פרשה', 'מנחה ערב שבת', 'לימוד', 'ערבית מוצ"ש']
        : ['פרשה', 'מנחה ערב שבת', 'ערבית מוצ"ש'];

    // docx.js מרנדר עמודות LTR — הופכים את הסדר כדי שהתצוגה תהיה RTL נכון
    headerCells.reverse();
    const colCount = headerCells.length;
    const COL_DXA = 2189;
    const FONT = 'Calibri';
    const FONT_SIZE = 30; // 15pt
    const ROW_SHADES = ['FFF2CC', 'C5E0B3'];

    function makeCell(text, isHeader, rowIndex) {
        const shade = isHeader ? 'D9D9D9' : ROW_SHADES[rowIndex % 2];
        return new docx.TableCell({
            children: [new docx.Paragraph({
                children: [new docx.TextRun({
                    text,
                    font: FONT,
                    size: FONT_SIZE,
                    bold: isHeader
                })],
                alignment: docx.AlignmentType.CENTER,
                bidirectional: true,
                spacing: { line: 360, lineRule: 'auto' }
            })],
            width: { size: COL_DXA, type: 'dxa' },
            shading: { fill: shade, type: 'clear', color: 'auto' },
            verticalAlign: 'center'
        });
    }

    function makeCellMultiLine(lines, rowIndex) {
        const shade = ROW_SHADES[rowIndex % 2];
        const paragraphs = lines.map(line => new docx.Paragraph({
            children: [new docx.TextRun({ text: line, font: FONT, size: FONT_SIZE, bold: false })],
            alignment: docx.AlignmentType.CENTER,
            bidirectional: true,
            spacing: { line: 360, lineRule: 'auto' }
        }));
        return new docx.TableCell({
            children: paragraphs,
            width: { size: COL_DXA, type: 'dxa' },
            shading: { fill: shade, type: 'clear', color: 'auto' },
            verticalAlign: 'center'
        });
    }

    // שורת כותרת
    const headerRow = new docx.TableRow({
        children: headerCells.map(h => makeCell(h, true, 0)),
        height: { value: 1138, rule: 'exact' }
    });

    // שורות נתונים
    const dataRows = rows.map((r, idx) => {
        let minchaCell;
        if (r.shirHashirimTime) {
            minchaCell = makeCellMultiLine([`שיר השירים ${r.shirHashirimTime}`, `(מנחה ${r.mincha})`], idx);
        } else {
            minchaCell = makeCell(r.mincha, false, idx);
        }

        // סדר הפוך (LTR→RTL): ערבית, [לימוד], מנחה, פרשה
        const cells = [];
        cells.push(makeCell(r.arvit, false, idx));
        if (isSummer) cells.push(makeCell(r.limud, false, idx));
        cells.push(minchaCell);
        cells.push(makeCell(r.parasha, false, idx));

        return new docx.TableRow({
            children: cells,
            height: { value: 518, rule: 'exact' }
        });
    });

    return new docx.Table({
        rows: [headerRow, ...dataRows],
        width: { size: 5000, type: 'pct' },
        columnWidths: Array(colCount).fill(COL_DXA)
    });
}

function buildFooterParagraphs(isSummer) {
    const s = getSettings();
    const minchaShabbat = isSummer ? s.minchaShabbatSummer : s.minchaShabbatWinter;
    const lines = [
        `שיר השירים ערב שבת – ${s.shirOffset} דק' לפני מנחה.`,
        `מנחה בשבת – ${minchaShabbat}.`,
        `מת'אמנה במוצ"ש – ${s.tamhanaOffset} דק' לפני ערבית.`
    ];
    // ללא alignment וללא bidirectional — run עם rightToLeft גורם לטקסט להיישר לימין כברירת מחדל
    return lines.map(line => new docx.Paragraph({
        children: [new docx.TextRun({ text: line, font: 'Calibri', size: 36, bold: true, rightToLeft: true })]
    }));
}

async function generateShabbatScheduleDocument() {
    const season = document.getElementById('shabbat-season').value;
    const hebrewYear = document.getElementById('hebrew-year').value || year;
    const isSummer = season === 'summer';

    const loadingData = showLoadingModal('טוען לוח שבתות', 'מחשב זמני תפילה...');
    try {
        const rows = await buildShabbatRows(season);

        // פיצול: קיץ→דברים, חורף→יתרו
        const splitParasha = isSummer ? 'דברים' : 'יתרו';
        const splitIndex = rows.findIndex(r => r.parasha === splitParasha);
        const part1 = splitIndex >= 0 ? rows.slice(0, splitIndex) : rows;
        const part2 = splitIndex >= 0 ? rows.slice(splitIndex) : [];

        const title = `זמני תפילות ${isSummer ? 'קיץ' : 'חורף'} ${hebrewYear} - מניין תימני - חיי ברכה`;

        function makeTitleParagraph(pageBreak = false) {
            return new docx.Paragraph({
                children: [new docx.TextRun({
                    text: title,
                    font: 'Calibri',
                    size: 36,
                    bold: true,
                    underline: { type: 'single' }
                })],
                alignment: docx.AlignmentType.CENTER,
                bidirectional: true,
                pageBreakBefore: pageBreak
            });
        }

        const children = [
            makeTitleParagraph(false),
            new docx.Paragraph(""),
            buildDocxTable(part1, isSummer),
            new docx.Paragraph(""),
            ...buildFooterParagraphs(isSummer)
        ];

        if (part2.length > 0) {
            children.push(makeTitleParagraph(true));
            children.push(new docx.Paragraph(""));
            children.push(buildDocxTable(part2, isSummer));
            children.push(new docx.Paragraph(""));
            children.push(...buildFooterParagraphs(isSummer));
        }

        const doc = new docx.Document({ sections: [{ children }] });
        const blob = await docx.Packer.toBlob(doc);
        const seasonHe = isSummer ? 'קיץ' : 'חורף';
        const filename = `זמני_תפילות_${seasonHe}_${hebrewYear}_מניין_תימני.docx`;
        saveAs(blob, filename);
    } catch (err) {
        console.error('שגיאה ביצירת מסמך שבת:', err);
        alert('אירעה שגיאה ביצירת המסמך: ' + err.message);
    } finally {
        hideLoadingModal(loadingData);
    }
}

// ----------------------------------------------------------------
// ייצוא תמונה
// ----------------------------------------------------------------
async function generateShabbatScheduleImage() {
    const el = document.getElementById('shabbat-schedule-output');
    if (!el) { alert('יש לחשב את הלוח תחילה'); return; }

    const season2   = document.getElementById('shabbat-season').value;
    const year2     = document.getElementById('hebrew-year').value || year;
    const seasonHe2 = season2 === 'summer' ? 'קיץ' : 'חורף';
    const titleText = el.querySelector('.schedule-title')?.textContent || '';

    const PAGE_W = 800;
    const PAD    = 60;
    const FONT   = 'Calibri, Arial, sans-serif';

    // בנה div עמוד עם עיצוב Word
    function buildPageDiv(childNodes) {
        const page = document.createElement('div');
        page.style.cssText = `width:${PAGE_W}px;padding:${PAD}px;box-sizing:border-box;background:#fff;font-family:${FONT};direction:rtl;`;

        // כותרת
        const h = document.createElement('h2');
        h.textContent = titleText;
        h.style.cssText = `font-family:${FONT};font-size:22px;font-weight:bold;text-decoration:underline;text-align:center;margin:0 0 16px 0;color:#000;`;
        page.appendChild(h);

        childNodes.forEach(c => {
            const clone = c.cloneNode(true);
            if (clone.classList?.contains('schedule-table')) {
                clone.style.cssText = `width:100%;border-collapse:collapse;margin-bottom:10px;font-family:${FONT};font-size:18px;`;
                clone.querySelectorAll('th').forEach(th => { th.style.cssText = 'background:#d9d9d9;font-weight:bold;padding:7px;text-align:center;border:1px solid #999;'; });
                clone.querySelectorAll('tbody tr').forEach((tr, i) => {
                    tr.style.background = i % 2 === 0 ? '#fff2cc' : '#c5e0b3';
                    tr.querySelectorAll('td').forEach(td => { td.style.cssText = 'padding:6px;text-align:center;border:1px solid #999;font-weight:normal;'; });
                });
            }
            if (clone.classList?.contains('schedule-footer')) {
                clone.querySelectorAll('p').forEach(p => { p.style.cssText = `font-family:${FONT};font-size:18px;font-weight:bold;text-align:right;direction:rtl;margin:2px 0;`; });
            }
            page.appendChild(clone);
        });
        return page;
    }

    // מצא פיצול: טבלה 1 + footer 1 = עמוד 1, טבלה 2 + footer 2 = עמוד 2
    const children = Array.from(el.children).filter(c => !c.classList.contains('schedule-title'));
    const tables = el.querySelectorAll('.schedule-table');

    let pages;
    if (tables.length >= 2) {
        let count = 0, splitAt = -1;
        for (let i = 0; i < children.length; i++) {
            if (children[i].classList.contains('schedule-table') && ++count === 2) { splitAt = i; break; }
        }
        pages = [children.slice(0, splitAt), children.slice(splitAt)];
    } else {
        pages = [children];
    }

    // צלם כל עמוד בנפרד
    const SEP = 30; // פיקסלים מפריד בין עמודים
    const canvases = [];
    for (const pageChildren of pages) {
        const div = buildPageDiv(pageChildren);
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        div.style.zIndex = '99999';
        document.body.appendChild(div);
        const c = await html2canvas(div, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
        document.body.removeChild(div);
        canvases.push(c);
    }

    // חבר לקנבס אחד עם הפרדה אפורה
    const totalH = canvases.reduce((s, c) => s + c.height, 0) + (canvases.length - 1) * SEP * 2;
    const finalW = canvases[0].width;
    const out = document.createElement('canvas');
    out.width  = finalW;
    out.height = totalH;
    const ctx = out.getContext('2d');
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, finalW, totalH);
    let y = 0;
    canvases.forEach((c, i) => {
        ctx.drawImage(c, 0, y);
        y += c.height + SEP * 2;
    });

    out.toBlob(blob => saveAs(blob, `זמני_תפילות_${seasonHe2}_${year2}_מניין_תימני.png`), 'image/png');
}

// ----------------------------------------------------------------
// נקודת כניסה ראשית
// ----------------------------------------------------------------
async function calculateShabbatSchedule() {
    const season = document.getElementById('shabbat-season').value;
    const hebrewYear = document.getElementById('hebrew-year').value || year;

    if (!numericYear) {
        alert('אנא בחר שנה עברית תחילה');
        return;
    }

    const loadingData = showLoadingModal('טוען לוח שבתות', 'מחשב זמני תפילה...');
    try {
        const rows = await buildShabbatRows(season);
        const html  = generateShabbatScheduleHTML(rows, season, hebrewYear);
        document.getElementById('shabbat-schedule-container').innerHTML = html;
    } catch (err) {
        console.error('שגיאה בחישוב לוח שבתות:', err);
        alert('אירעה שגיאה: ' + err.message);
    } finally {
        hideLoadingModal(loadingData);
    }
}
