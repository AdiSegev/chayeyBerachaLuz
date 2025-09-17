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

    // הוספת גרשיים לפני האות האחרונה
    if (result.length > 1) {
        result = result.slice(0, -1) + '"' + result.slice(-1);
    }
    
    return result;
}

// מערך גלובלי לשמירת כל השנים העבריות
let allHebrewYears = [];

// פונקציה לטעינת שנות עבריות לרשימה
function loadHebrewYears() {
    const loadingData = showLoadingModal('טוען שנים עבריות', 'משיכת נתונים מ-Hebcal...');
    
    setTimeout(() => {
        try {
            const startYear = 5700; // תש"ע
            const endYear = 5900;   // ת"ת
            
            // יצירת מערך השנים
            allHebrewYears = [];
            for (let y = startYear; y <= endYear; y++) {
                const hebrewYear = convertToHebrewLetters(y);
                allHebrewYears.push({
                    hebrew: hebrewYear,
                    numeric: y
                });
            }
            
            // הוספת event listeners לחיפוש
            setupYearSearch();
            
        } catch (error) {
            console.error('שגיאה בטעינת השנים העבריות:', error);
            alert('אירעה שגיאה בטעינת השנים העבריות');
        } finally {
            hideLoadingModal(loadingData);
        }
    }, 800); // השהיה של 0.8 שניות
}

// פונקציה להגדרת חיפוש השנים
function setupYearSearch() {
    const input = document.getElementById('hebrew-year');
    const dropdown = document.getElementById('hebrew-years-dropdown');
    
    input.addEventListener('input', function() {
        const searchValue = this.value.trim();
        console.log('Input changed:', searchValue); // לבדיקה
        filterAndShowYears(searchValue);
    });
    
    input.addEventListener('focus', function() {
        const searchValue = this.value.trim();
        console.log('Input focused:', searchValue); // לבדיקה
        filterAndShowYears(searchValue);
    });
    
    input.addEventListener('keyup', function() {
        const searchValue = this.value.trim();
        console.log('Key up:', searchValue); // לבדיקה
        filterAndShowYears(searchValue);
    });
    
    // כשמשתמש יוצא מהשדה, עדכן את השנה ואת זמני השקיעה
    input.addEventListener('blur', function() {
        const enteredYear = this.value.trim();
        console.log('User left field with value:', enteredYear); // לבדיקה
        
        // בדוק אם השנה שהוקלדה קיימת במערך
        // הסר גרשיים מהשנה שהוקלדה לצורך חיפוש
        const enteredYearWithoutGeresh = enteredYear.replace(/["׳״‟„"]/g, '');
        const yearData = allHebrewYears.find(y => {
            const yearWithoutGeresh = y.hebrew.replace(/["׳״‟„"]/g, '');
            return yearWithoutGeresh === enteredYearWithoutGeresh;
        });
        
        if (yearData) {
            console.log('Found matching year:', yearData); // לבדיקה
            // עדכן את המשתנים הגלובליים
            numericYear = yearData.numeric;
            year = enteredYear;
            
            // עדכן זמן שקיעה לשנה החדשה
            const holiday = document.getElementById('holiday').value;
            if (holiday) {
                getHolidaySunset(holiday, true).then((holidaySunset) => {
                    console.log("Updated sunset for new year:", holidaySunset);
                    setSunsetTime(holidaySunset);
                });
            }
        } else {
            console.log('Year not found in list:', enteredYear); // לבדיקה
        }
        
        // סגור את הרשימה
        dropdown.style.display = 'none';
    });
    
    // סגירת הרשימה כשלוחצים מחוץ לה
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// פונקציה לסינון והצגת השנים
function filterAndShowYears(searchValue) {
    const dropdown = document.getElementById('hebrew-years-dropdown');
    dropdown.innerHTML = '';
    
    console.log('Filtering years for:', searchValue); // לבדיקה
    console.log('Search value char codes:', searchValue.split('').map(char => `${char}(${char.charCodeAt(0)})`).join(' ')); // לבדיקה
    
    if (!searchValue) {
        // אם אין טקסט חיפוש, הצג את כל השנים
        const recentYears = allHebrewYears.slice(-50); // הצג 50 השנים האחרונות
        recentYears.forEach(year => {
            addYearToDropdown(year, dropdown);
        });
    } else {
        // סינון לפי הטקסט שהוקלד
        let filteredYears;
        
        // תמיד חפש שנים שמתחילות עם הטקסט
        filteredYears = allHebrewYears.filter(year => {
            // הסר גרשיים מהשנה ומהחיפוש לצורך השוואה
            const yearWithoutGeresh = year.hebrew.replace('"', '');
            const searchWithoutGeresh = searchValue.replace(/["׳״‟„"]$/, '');
            
            console.log(`Comparing: ${yearWithoutGeresh} starts with ${searchWithoutGeresh}?`, yearWithoutGeresh.startsWith(searchWithoutGeresh)); // לבדיקה
            
            // חפש התאמה לפי הטקסט בלי גרשיים
            return yearWithoutGeresh.startsWith(searchWithoutGeresh);
        });
        
        console.log('Filtered years count:', filteredYears.length); // לבדיקה
        
        // הגבל ל-20 תוצאות
        filteredYears.forEach(year => {
            addYearToDropdown(year, dropdown);
        });
    }
    
    dropdown.style.display = dropdown.children.length > 0 ? 'block' : 'none';
    console.log('Dropdown display:', dropdown.style.display); // לבדיקה
}

// פונקציה להוספת שנה לרשימה הנפתחת
function addYearToDropdown(year, dropdown) {
    const item = document.createElement('a');
    item.className = 'dropdown-item';
    item.href = '#';
    item.textContent = year.hebrew;
    item.setAttribute('data-numeric', year.numeric);
    
    item.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('hebrew-year').value = year.hebrew;
        dropdown.style.display = 'none';
        
        // עדכן את המשתנים הגלובליים
        numericYear = year.numeric;
        globalYear = year.hebrew;
        
        // עדכן זמן שקיעה
        updateSelectedYear();
    });
    
    dropdown.appendChild(item);
}

// פונקציה לאתחול הדף
function initializePage() {
    loadHebrewYears();
    updateDayOptions();
}

// פונקציה לעדכון השנה בהתאם לבחירת המשתמש
function updateSelectedYear() {
    const input = document.getElementById('hebrew-year');
    const selectedYear = input.value;
    
    if (selectedYear) {
        // מצא את השנה המספרית המתאימה במערך
        const yearData = allHebrewYears.find(y => y.hebrew === selectedYear);
        if (yearData) {
            numericYear = yearData.numeric;
            year = selectedYear;
            console.log("נבחרה שנה: " + year + " (" + numericYear + ")");
            
            // עדכן את זמן השקיעה בהתאם לשנה החדשה
            const holiday = document.getElementById('holiday').value;
            if (holiday) {
                getHolidaySunset(holiday, true).then((holidaySunset) => {
                    console.log("holiday sunset for selected year: " + holidaySunset);
                    setSunsetTime(holidaySunset);
                });
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
	
	  getHebrewYear().then((hebrewYear) => {
		  
  if (hebrewYear) {
	  year = hebrewYear;
      currentHebrewYear = hebrewYear;
      // הגדר את השנה הנוכחית כברירת מחדל
      document.getElementById('hebrew-year').value = hebrewYear;
    console.log("השנה העברית הנוכחית היא: " + hebrewYear);
	
	// Example usage: get the sunset time for the default holiday
    const defaultHoliday = 'rosh_hashana'; // החג שמוגדר כברירת מחדל
    getHolidaySunset(defaultHoliday, false).then((holidaySunset) => {
	console.log("holiday sunset: "+holidaySunset);
	
	setSunsetTime(holidaySunset);
		
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
	
	getHolidaySunset(holiday).then((pesachSunset) => {
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
    const loadingData = showLoadingModal('יצירת קובץ','מייצר קובץ Word...');
    
    // סימולציה של משיכת נתונים מ-Hebcal
    setTimeout(() => {
        try {
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
        } catch (error) {
            console.error('שגיאה ביצירת המסמך:', error);
            alert('אירעה שגיאה ביצירת המסמך');
        } finally {
            hideLoadingModal(loadingData);
        }
    }, 1500); // השהיה של 1.5 שניות לסימולציה
}

function setSunsetTime(sunsetDateTime) {
	
    const sunsetTime = sunsetDateTime.split('T')[1].split('+')[0].slice(0, 5);
    document.getElementById('sunset-time').value = sunsetTime;
}

// Function to get the Gregorian date of Pesach and sunset time for a given year
async function getHolidaySunset(selectedHoliday, showLoading = true) {
    let loadingData = null;
    if (showLoading) {
        loadingData = showLoadingModal('טוען זמני שקיעה', 'קבלת נתונים מ-Hebcal...');
    }
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
  } finally {
    if (loadingData) {
        hideLoadingModal(loadingData);
    }
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

// פונקציה להוספת גרשיים לפני האות האחרונה בשנה העברית
function addGereshToYear(year) {
    if (!year || year.length < 2) return year;
    
    // בדיקה אם כבר יש גרשיים בכל מקום בשנה
    if (year.includes('"')) {
        return year; // כבר יש גרשיים
    }
    
    // הוספת גרשיים לפני האות האחרונה
    return year.slice(0, -1) + '"' + year.slice(-1);
}

// פונקציות לניהול דיאלוג הטעינה
function showLoadingModal(title = 'טוען זמני תפילה', message = 'משיכת נתונים מ-Hebcal...') {
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
    
    // עדכון הטקסטים
    document.querySelector('#loadingModal h5').textContent = title;
    document.querySelector('#loadingModal p').textContent = message;
    
    loadingModal.show();
    
    // אנימציה של פס ההתקדמות
    const progressBar = document.querySelector('#loadingModal .progress-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressBar.style.width = progress + '%';
    }, 200);
    
    return { modal: loadingModal, interval: interval };
}

function hideLoadingModal(loadingData) {
    if (loadingData.interval) {
        clearInterval(loadingData.interval);
    }
    
    // השלמת פס ההתקדמות
    const progressBar = document.querySelector('#loadingModal .progress-bar');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    setTimeout(() => {
        loadingData.modal.hide();
        
        // וודא שהרקע נעלם לגמרי
        setTimeout(() => {
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            // איפוס פס ההתקדמות
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        }, 300);
    }, 500);
}

// פונקציה ליצירת תמונה מעוצבת
function generateImageDocument(customContent = null, customYear = null, customHoliday = null) {
    const holiday = customHoliday || document.getElementById('holiday').value;
    const selectedYear = customYear || document.getElementById('hebrew-year').value || year;
    
    // קבלת התוכן של החג - אם נשלח תוכן מותאם אישית, השתמש בו
    let holidayContent = customContent;
    
    // אם לא נשלח תוכן מותאם אישית, יצר אותו לפי החג
    if (!customContent) {
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
        
        console.log('Using holiday content for image:', holidayContent);
        
        // חישוב גודל פונט דינמי לפי כמות הטקסט (הגדלה פי 1.5)
        const textLength = holidayContent.replace(/<[^>]*>/g, '').length;
        let contentFontSize;
        if (textLength < 200) {
            contentFontSize = 36;
        } else if (textLength < 400) {
            contentFontSize = 30;
        } else if (textLength < 600) {
            contentFontSize = 27;
        } else if (textLength < 800) {
            contentFontSize = 24;
        } else {
            contentFontSize = 21;
        }
        
        // יצירת מיכל HTML עם התוכן המלא
        const container = document.createElement('div');
        container.style.cssText = `
            width: 500px;
            padding: 40px 20px 20px 20px;
            font-family: 'Pfennig', 'Arial', sans-serif;
            direction: rtl;
            text-align: center;
            background: transparent;
            color: #2c5530;
            line-height: 1.4;
            position: absolute;
            top: 140px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        // הוספת כותרת בשתי שורות
        const titleContainer = document.createElement('div');
        titleContainer.style.cssText = `
            margin-bottom: 40px;
            text-align: center;
        `;
        
        const mainTitle = document.createElement('div');
        mainTitle.style.cssText = `
            color: #2c5530;
            font-size: ${Math.min(contentFontSize + 9, 45)}px;
            font-weight: bold;
            font-family: 'Pfennig', 'Arial', sans-serif;
            margin-bottom: 5px;
        `;
        mainTitle.textContent = 'זמני תפילה - מניין תימני';
        
        const subTitle = document.createElement('div');
        subTitle.style.cssText = `
            color: #2c5530;
            font-size: ${Math.min(contentFontSize + 12, 48)}px;
            font-weight: normal;
            font-family: 'Pfennig', 'Arial', sans-serif;
        `;
        subTitle.textContent = `${getHebrewHolidayTitle(holiday)} ${selectedYear}`;
        
        titleContainer.appendChild(mainTitle);
        titleContainer.appendChild(subTitle);
        // הוספת בס"ד בפינה העליונה הימנית
        const bsdElement = document.createElement('div');
        bsdElement.style.cssText = `
            position: absolute;
            top: 20px;
            right: 40px;
            color: #2c5530;
            font-size: ${Math.min(contentFontSize - 4, 24)}px;
            font-weight: bold;
            font-family: 'Pfennig', 'Arial', sans-serif;
        `;
        bsdElement.textContent = 'בס"ד';
        container.appendChild(bsdElement);
        
        container.appendChild(titleContainer);
        
        // הוספת התוכן
        const contentElement = document.createElement('div');
        contentElement.style.cssText = `
            font-size: ${contentFontSize}px;
            color: #2c5530;
        `;
        contentElement.innerHTML = holidayContent;
        
        // תיקון רוחב טבלאות כדי למנוע שבירת שורות
        const tables = contentElement.querySelectorAll('table');
        tables.forEach(table => {
            table.style.width = '100%';
            table.style.maxWidth = 'none';
            table.style.borderCollapse = 'separate';
            table.style.borderSpacing = '0';
            
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 2) {
                    // שינוי פורמט הטבלה לשורה אחת עם מרווח קטן
                    const firstCell = cells[0];
                    const secondCell = cells[1];
                    
                    // יצירת תוכן משולב עם פונט מודגש לכותרת
                    const cellText = firstCell.innerHTML.replace(/<[^>]*>/g, '');
                    const timeText = secondCell.innerHTML;
                    const combinedContent = `<strong>${cellText}</strong> ${timeText}`;
                    
                    // עדכון התא הראשון עם התוכן המשולב
                    firstCell.innerHTML = combinedContent;
                    firstCell.style.cssText = 'white-space: nowrap; text-align: center; padding: 4px 0;';
                    
                    // הסתרת התא השני
                    secondCell.style.display = 'none';
                }
            });
        });
        
        // תיקון כותרות h2 והוספת מרווחים
        const headers = contentElement.querySelectorAll('h2');
        headers.forEach((header, index) => {
            header.style.whiteSpace = 'nowrap';
            header.style.fontSize = `${Math.min(contentFontSize + 6, 42)}px`;
            header.style.fontWeight = 'bold';
            if (index > 0) {
                header.style.marginTop = '30px';
            }
        });
        
        container.appendChild(contentElement);
        
        // הוספת איחול בחלק התחתון
        const greetingElement = document.createElement('div');
        greetingElement.style.cssText = `
            margin-top: 30px;
            text-align: center;
            color: #2c5530;
            font-size: ${Math.max(contentFontSize - 8, 16)}px;
            font-weight: bold;
            font-style: italic;
            font-family: 'Pfennig', 'Arial', sans-serif;
        `;
        
        // קביעת האיחול לפי החג
        let greetingText = '';
        switch (holiday) {
            case 'rosh_hashana':
                greetingText = 'בברכת תכתבו ותחתמו בספר החיים ובספר הזיכרון';
                break;
            case 'yom_kippur':
                greetingText = 'תבושרו במחילה וסליחה וכפרה';
                break;
            case 'tisha_beav':
                greetingText = 'בבניין ירושלים ננוחם';
                break;
            default:
                greetingText = 'תוסיפו שנים רבות ומועדים טובים';
                break;
        }
        
        greetingElement.textContent = greetingText;
        container.appendChild(greetingElement);
        
        // הסרת הטקסט התחתון
        
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

// משתנה גלובלי לשמירת הנתונים הערוכים
let editedPrayerTimes = {};

// פתיחת modal עריכה
function openEditModal() {
    const selectedYear = document.getElementById('hebrew-year').value;
    const holiday = document.getElementById('holiday').value;
    const selectedDay = document.getElementById('day-of-week').value;
    const sunsetTime = document.getElementById('sunset-time').value;
    
    if (!selectedYear || !holiday || !selectedDay || !sunsetTime) {
        alert('אנא מלא את כל השדות לפני עריכת הזמנים');
        return;
    }
    
    // קבלת התוכן המעובד לפי הלוגיקה
    const holidayContent = getHolidayContentForEdit(holiday, selectedYear);
    
    // חילוץ זמני תפילה מה-HTML
    const prayerTimes = extractPrayerTimesFromHTML(holidayContent);
    
    // יצירת טבלת עריכה
    createEditTable(prayerTimes);
    
    // עדכון תצוגה מקדימה
    updatePreview();
    
    // פתיחת ה-modal
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

// פונקציה לקבלת תוכן החג לעריכה
function getHolidayContentForEdit(holiday, selectedYear) {
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
    return holidayContent;
}

// יצירת תמונה סופית מהנתונים הערוכים
function generateFinalImage() {
    generateFinalImageFromEdited();
}
