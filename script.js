// main.js

(function() {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

var year = "";
var numericYear;
var currentHebrewYear = "";

// פונקציה להמרת מספר לאותיות עבריות
function convertToHebrewLetters(num) {
    const hebrewLetters = {
        1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
        10: 'י', 20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס', 70: 'ע', 80: 'פ', 90: 'צ',
        100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת'
    };

    let result = '';
    let remaining = num % 1000; // נוריד את האלפים

    // המרה לאותיות עבריות
    [400, 300, 200, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].forEach(value => {
        while (remaining >= value) {
            result += hebrewLetters[value];
            remaining -= value;
        }
    });

    return result;
}

// פונקציה לטעינת שנות עבריות לרשימה
function loadHebrewYears() {
    const startYear = 5770; // תש"ע
    const endYear = 6000;   // ת"ת
    const datalist = document.getElementById('hebrew-years');
    
    for (let y = startYear; y <= endYear; y++) {
        const option = document.createElement('option');
        const hebrewYear = convertToHebrewLetters(y);
        option.value = hebrewYear;
        option.setAttribute('data-numeric', y);
        datalist.appendChild(option);
    }
}

// פונקציה לעדכון השנה בהתאם לבחירת המשתמש
function updateSelectedYear() {
    const input = document.getElementById('hebrew-year');
    const selectedYear = input.value;
    
    if (selectedYear) {
        // מצא את השנה המספרית המתאימה
        const options = document.querySelectorAll('#hebrew-years option');
        for (let option of options) {
            if (option.value === selectedYear) {
                numericYear = parseInt(option.getAttribute('data-numeric'));
                year = selectedYear;
                console.log("נבחרה שנה: " + year + " (" + numericYear + ")");
                
                // עדכן את זמן השקיעה בהתאם לשנה החדשה
                const holiday = document.getElementById('holiday').value;
                if (holiday) {
                    getPesachSunset(holiday).then((holidaySunset) => {
                        console.log("holiday sunset for selected year: " + holidaySunset);
                        setSunsetTime(holidaySunset);
                    });
                }
                break;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // טען את רשימת השנים
    loadHebrewYears();
    
    // קבע את החג כראש השנה כברירת מחדל
    document.getElementById('holiday').value = 'rosh_hashana';
    updateDayOptions(); // עדכן את הימים האפשריים בהתאם לחג שנבחר

    // קבע את היום הנבחר כברירת מחדל ליום ראשון
    document.getElementById('day-of-week').value = 'sunday';
	
	document.getElementById('holiday').addEventListener('change', updateDayOptions);
    document.getElementById('hebrew-year').addEventListener('change', updateSelectedYear);
    document.getElementById('hebrew-year').addEventListener('input', updateSelectedYear);
	
	  getHebrewYear().then((hebrewYear) => {
		  
  if (hebrewYear) {
	  year = hebrewYear;
      currentHebrewYear = hebrewYear;
      // הגדר את השנה הנוכחית כברירת מחדל
      document.getElementById('hebrew-year').value = hebrewYear;
    console.log("השנה העברית הנוכחית היא: " + hebrewYear);
	
	// Example usage: get the sunset time for Pesach in the year 2025
    getPesachSunset(numericYear).then((pesachSunset) => {
	console.log("pesach: "+pesachSunset);
	
	setSunsetTime(pesachSunset);
		
	});
	

  }
});

});




async function getHebrewYear() {
  try {
    const response = await fetch('https://www.hebcal.com/converter?cfg=json&gy=2024&gm=10&gd=20&g2h=1');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
	numericYear = data.hy;
    return data.heDateParts.y; // שדה "hy" מייצג את השנה העברית
  } catch (error) {
    console.error('Error fetching Hebrew year:', error);
  }
}

function updateDayOptions() {
    const holiday = document.getElementById('holiday').value;
    const daySelect = document.getElementById('day-of-week');

    daySelect.innerHTML = `
        <option value="sunday">ראשון</option>
        <option value="monday">שני</option>
        <option value="tuesday">שלישי</option>
        <option value="wednesday">רביעי</option>
        <option value="thursday">חמישי</option>
        <option value="friday">שישי</option>
        <option value="saturday">שבת</option>
    `;

    let allowedDays;

    switch (holiday) {
        case 'rosh_hashana':
		case 'sukkot':
		case 'simchat_torah':
            allowedDays = ['monday', 'tuesday', 'thursday', 'saturday'];
            break;
        case 'yom_kippur':
            allowedDays = ['monday', 'wednesday', 'thursday', 'saturday'];
            break;
        case 'pesach':
            allowedDays = ['sunday', 'tuesday', 'thursday', 'saturday'];
            break;
        case 'shavuot':
            allowedDays = ['sunday', 'monday', 'wednesday', 'friday'];
            break;
		case 'shabat_chol_hamoed_sukkot':
		case 'shabat_chol_hamoed_pesach':
			allowedDays = ['saturday'];
			break;
		case 'shvii_pesach':
			allowedDays = ['saturday', 'monday', 'wednesday', 'friday'];
			break;
		case 'tisha_beav':
			allowedDays = ['sunday', 'tuesday', 'thursday'];
			break;
        default:
            allowedDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    }

    Array.from(daySelect.options).forEach(option => {
        if (!allowedDays.includes(option.value)) {
            option.disabled = true;
        }
    });
	
	    // הגדר את היום הראשון האפשרי כברירת מחדל
    for (let option of daySelect.options) {
        if (!option.disabled) {
            daySelect.value = option.value;
            break;
        }
    }
	
	getPesachSunset(holiday).then((pesachSunset) => {
	console.log("holiday sunset: "+pesachSunset);
	
	setSunsetTime(pesachSunset);
		
	});
}

function addMinutesToTime(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(mins + minutes);
    return date.toTimeString().slice(0, 5);
}

// פונקציה כללית שמזמינה את יצירת המסמך לכל חג ספציפי
function generateWordDocument() {
    const holiday = document.getElementById('holiday').value;
    const selectedYear = document.getElementById('hebrew-year').value || year;
    
    switch (holiday) {
        case 'rosh_hashana':
            generateRoshHashanaDocument(selectedYear);
            break;
        case 'yom_kippur':
            generateYomKippurDocument(selectedYear);
            break;
			case 'sukkot':
			generateSukkotDocument(selectedYear);
			break;
			case 'shabat_chol_hamoed_sukkot':
			generateShabbatHolHamoedSukkotDocument(selectedYear);
			break;
			case 'simchat_torah':
			generateSimchatTorahDocument(selectedYear);
			break;
			case 'pesach':
			generatePesachDocument(selectedYear);
			break;
			case 'shabat_chol_hamoed_pesach':
			generateShabbatHolHamoedPesachDocument(selectedYear);
			break;
			case 'shvii_pesach':
			generateShviiPesachDocument(selectedYear);
			break;
			case 'shavuot':
			generateShavuotDocument(selectedYear);
			break;
			case 'tisha_beav':
			generateTishaBeAvDocument(selectedYear);
			break;
        // הוסף כאן קריאה לפונקציות עבור חגים אחרים
        default:
            console.error('Holiday not supported');
    }
}

function setSunsetTime(sunsetDateTime) {
	
    const sunsetTime = sunsetDateTime.split('T')[1].split('+')[0].slice(0, 5);
    document.getElementById('sunset-time').value = sunsetTime;
}

// Function to get the Gregorian date of Pesach and sunset time for a given year
async function getPesachSunset(selectedHoliday) {
  try {
	  var holidayName = "";
	  switch (selectedHoliday) {
	  
	    case 'rosh_hashana':
            holidayName = "Rosh Hashana ";
            break;
        case 'yom_kippur':
            holidayName = "Yom Kippur";
            break;
		case 'sukkot':
			holidayName = "Sukkot I";
			break;
		case 'shabat_chol_hamoed_sukkot':
			holidayName = "Parashat Sukkot Shabbat Chol ha-Moed";
			break;
		case 'simchat_torah':
			holidayName = "Shmini Atzeret";
			break;
		case 'pesach':
			holidayName = "Pesach I";
			break;
		case 'shabat_chol_hamoed_pesach':
			holidayName = "Parashat Pesach Shabbat Chol ha-Moed";
			break;
		case 'shvii_pesach':
			holidayName = "Pesach VII";
			break;
		case 'shavuot':
			holidayName = "Shavuot I";
			break;
		case 'tisha_beav':
			holidayName = "Tish’a B’Av";
				
		break;
	  }
    // Hebcal API URL to get the Jewish holiday dates for the given year
    const yearToUse = numericYear || 'now';
    const holidayUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=${yearToUse}&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&M=on&s=on&yt=H`;
    
    // Make an HTTP GET request to fetch the holiday dates using fetch
    const holidayResponse = await fetch(holidayUrl);
    if (!holidayResponse.ok) {
      throw new Error('Failed to fetch holiday dates');
    }
    const holidayData = await holidayResponse.json();
    
    // Extract the holidays array from the response
    const holidays = holidayData.items;

    // Find the Pesach date
    let holidayDate = null;
	
	if(selectedHoliday === 'shabat_chol_hamoed_pesach' || selectedHoliday === 'shabat_chol_hamoed_sukkot'){
	 for (let holiday of holidays) {
		 
		 if(selectedHoliday === 'shabat_chol_hamoed_pesach'){
			 if(holiday.title.includes('Pesach ') && holiday.leyning["6"] != undefined){
				 holidayDate = holiday.date;
				 console.log(`Pesach in ${year} starts on: ${holidayDate}`);
				 break;
			 }
		 }else if(selectedHoliday === 'shabat_chol_hamoed_sukkot'){
			 if(holiday.title.includes('Sukkot ') && holiday.leyning["6"] != undefined){
				 holidayDate = holiday.date;
				 console.log(`Pesach in ${year} starts on: ${holidayDate}`);
				 break;
			 }			 
		 }
    }	
		
	} else {
	 for (let holiday of holidays) {
      if (holiday.title.includes(holidayName)) {
        holidayDate = holiday.date;
        console.log(`Pesach in ${year} starts on: ${holidayDate}`);
        break;
      }
    }
		
	}


    if (!holidayDate) {
      console.log('holidayDate date not found');
      return null;
    }
	console.log("holidayDate: "+holidayDate);


	    const options = {
            date: holidayDate,
            timeZoneId: "Asia/Jerusalem",
            latitude: Number.parseFloat(31.849436),
            longitude: Number.parseFloat(35.035721)
          };

          // Calculate the zmanim to a JSON object
          const json = KosherZmanim.getZmanimJson(options);
	
    return json.BasicZmanim.Sunset;
  } catch (error) {
    console.error('Error fetching Pesach sunset time:', error);
    return null;
  }
}

// פונקציה להמרת קוד החג לשם החג בעברית
function getHolidayName(holiday) {
    switch (holiday) {
        case 'rosh_hashana': return "ראש_השנה";
        case 'yom_kippur': return "יום_כיפור";
        case 'sukkot': return "סוכות";
        case 'shabat_chol_hamoed_sukkot': return "שבת_חול_המועד_סוכות";
        case 'simchat_torah': return "שמחת_תורה";
        case 'pesach': return "פסח";
        case 'shabat_chol_hamoed_pesach': return "שבת_חול_המועד_פסח";
        case 'shvii_pesach': return "שביעי_של_פסח";
        case 'shavuot': return "שבועות";
        case 'tisha_beav': return "תשעה_באב";
        default: return "חג";
    }
}

// פונקציה להצגת שם החג בעברית בכותרת
function getHebrewHolidayTitle(holiday) {
    switch (holiday) {
        case 'rosh_hashana': return "ראש השנה";
        case 'yom_kippur': return "יום כיפור";
        case 'sukkot': return "סוכות";
        case 'shabat_chol_hamoed_sukkot': return "שבת חול המועד סוכות";
        case 'simchat_torah': return "שמחת תורה";
        case 'pesach': return "פסח";
        case 'shabat_chol_hamoed_pesach': return "שבת חול המועד פסח";
        case 'shvii_pesach': return "שביעי של פסח";
        case 'shavuot': return "שבועות";
        case 'tisha_beav': return "תשעה באב";
        default: return "חג";
    }
}

// פונקציה ליצירת תמונה מעוצבת
function generateImageDocument() {
    const holiday = document.getElementById('holiday').value;
    const selectedYear = document.getElementById('hebrew-year').value || year;
    
    // קבלת התוכן של החג תחילה
    let holidayContent = '';
    switch (holiday) {
        case 'rosh_hashana':
            if (typeof generateRoshHashanaContent === 'function') {
                holidayContent = generateRoshHashanaContent(selectedYear);
            }
            break;
        case 'yom_kippur':
            if (typeof generateYomKippurContent === 'function') {
                holidayContent = generateYomKippurContent(selectedYear);
            }
            break;
        case 'sukkot':
            if (typeof generateSukkotContent === 'function') {
                holidayContent = generateSukkotContent(selectedYear);
            }
            break;
        case 'shabat_chol_hamoed_sukkot':
            if (typeof generateShabbatHolHamoedSukkotContent === 'function') {
                holidayContent = generateShabbatHolHamoedSukkotContent(selectedYear);
            }
            break;
        case 'simchat_torah':
            if (typeof generateSimchatTorahContent === 'function') {
                holidayContent = generateSimchatTorahContent(selectedYear);
            }
            break;
        case 'pesach':
            if (typeof generatePesachContent === 'function') {
                holidayContent = generatePesachContent(selectedYear);
            }
            break;
        case 'shabat_chol_hamoed_pesach':
            if (typeof generateShabbatHolHamoedPesachContent === 'function') {
                holidayContent = generateShabbatHolHamoedPesachContent(selectedYear);
            }
            break;
        case 'shvii_pesach':
            if (typeof generateShviiPesachContent === 'function') {
                holidayContent = generateShviiPesachContent(selectedYear);
            }
            break;
        case 'shavuot':
            if (typeof generateShavuotContent === 'function') {
                holidayContent = generateShavuotContent(selectedYear);
            }
            break;
        case 'tisha_beav':
            if (typeof generateTishaBeAvContent === 'function') {
                holidayContent = generateTishaBeAvContent(selectedYear);
            }
            break;
        default:
            holidayContent = '<p>תוכן החג יוצג כאן</p>';
    }
    
    // יצירת קנבס לעבודה עם תמונה
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    
    // טעינת תמונת הרקע
    const backgroundImg = new Image();
    backgroundImg.crossOrigin = "Anonymous";
    backgroundImg.src = 'frame_template.png';
    
    backgroundImg.onload = function() {
        // ציור תמונת הרקע על הקנבס
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
        
        // חישוב גודל פונט דינמי לפי כמות הטקסט
        const textLength = holidayContent.replace(/<[^>]*>/g, '').length;
        let contentFontSize;
        if (textLength < 200) {
            contentFontSize = 24;
        } else if (textLength < 400) {
            contentFontSize = 20;
        } else if (textLength < 600) {
            contentFontSize = 18;
        } else if (textLength < 800) {
            contentFontSize = 16;
        } else {
            contentFontSize = 14;
        }
        
        // יצירת מיכל HTML עם התוכן המלא
        const container = document.createElement('div');
        container.style.cssText = `
            width: 450px;
            padding: 40px 30px 20px 30px;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
            direction: rtl;
            text-align: center;
            background: transparent;
            margin: 0;
            position: relative;
        `;
        
        // הוספת כותרת
        const title = document.createElement('h1');
        title.style.cssText = `
            color: #2c5530;
            font-size: ${Math.min(contentFontSize + 6, 30)}px;
            margin-bottom: 20px;
            font-weight: bold;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
        `;
        title.innerHTML = `זמני תפילה ${getHebrewHolidayTitle(holiday)} ${selectedYear}`;
        container.appendChild(title);
        
        // הוספת התוכן של החג
        const content = document.createElement('div');
        content.style.cssText = `
            font-size: ${contentFontSize}px;
            line-height: 1.4;
            color: #333;
            text-align: center;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
        `;
        content.innerHTML = holidayContent;
        container.appendChild(content);
        
        // הוספת תחתית
        const footer = document.createElement('div');
        footer.style.cssText = `
            margin-top: 25px;
            font-size: ${Math.max(contentFontSize - 4, 10)}px;
            color: #666;
            font-style: italic;
            font-family: 'Noto Sans Hebrew', 'Arial', sans-serif;
        `;
        footer.innerHTML = 'מניין תימני מבוא חורון';
        container.appendChild(footer);
        
        // הוספה זמנית למסמך
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);
        
        // המתנה קצרה לטעינת הסגנונות ואז המרה לתמונה
        setTimeout(() => {
            html2canvas(container, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true
            }).then(contentCanvas => {
                // ציור התוכן ממורכז ברוחב אבל מתחיל מלמעלה
                const x = (canvas.width - contentCanvas.width / 2) / 2;
                const y = 140; // מרווח מוגדל מלמעלה
                ctx.drawImage(contentCanvas, x, y, contentCanvas.width / 2, contentCanvas.height / 2);
                
                // הורדת התמונה
                const imgData = canvas.toDataURL('image/png', 1.0);
                const link = document.createElement('a');
                link.download = `זמני_תפילה_${getHolidayName(holiday)}_${selectedYear}.png`;
                link.href = imgData;
                link.click();
                
                // ניקוי
                document.body.removeChild(container);
            }).catch(error => {
                console.error('שגיאה ביצירת התמונה:', error);
                document.body.removeChild(container);
                alert('שגיאה ביצירת התמונה. אנא נסה שוב.');
            });
        }, 500);
    };
    
    backgroundImg.onerror = function() {
        alert('שגיאה בטעינת תמונת הרקע. אנא ודא שקובץ frame_template.png קיים בתיקיית הפרויקט.');
    };
}

