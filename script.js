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
document.addEventListener("DOMContentLoaded", function () {
    // קבע את החג כראש השנה כברירת מחדל
    document.getElementById('holiday').value = 'rosh_hashana';
    updateDayOptions(); // עדכן את הימים האפשריים בהתאם לחג שנבחר

    // קבע את היום הנבחר כברירת מחדל ליום ראשון
    document.getElementById('day-of-week').value = 'sunday';
	
	document.getElementById('holiday').addEventListener('change', updateDayOptions);
	
	  getHebrewYear().then((hebrewYear) => {
		  
  if (hebrewYear) {
	  year = hebrewYear;
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
    switch (holiday) {
        case 'rosh_hashana':
            generateRoshHashanaDocument();
            break;
        case 'yom_kippur':
            generateYomKippurDocument();
            break;
			case 'sukkot':
			generateSukkotDocument();
			break;
			case 'shabat_chol_hamoed_sukkot':
			generateShabbatHolHamoedSukkotDocument();
			break;
			case 'simchat_torah':
			generateSimchatTorahDocument();
			break;
			case 'pesach':
			generatePesachDocument();
			break;
			case 'shabat_chol_hamoed_pesach':
			generateShabbatHolHamoedPesachDocument();
			break;
			case 'shvii_pesach':
			generateShviiPesachDocument();
			break;
			case 'shavuot':
			generateShavuotDocument();
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
	  }
    // Hebcal API URL to get the Jewish holiday dates for the given year
    const holidayUrl = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&M=on&s=on&yt=H`;
    
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

