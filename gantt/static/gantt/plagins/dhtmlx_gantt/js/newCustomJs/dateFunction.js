

function contentOfDays(startD, endD, dateS, dateE) {// колличество дней нагрузки в указанный период

    var result = 0;
    var sD = startD.valueOf();
    var eD = endD.valueOf();
    var dS = dateS.valueOf();
    var dE = dateE.valueOf();

    if((dS < sD) && (dE <= eD)) {
        result = calcBusinessDays(startD, dateE);
        return result;
    }

    if((dS >= sD) && (dE <= eD)) {
        result = calcBusinessDays(dateS, dateE);
        return result;
    }

    if((dS >= sD) && (dE > eD)) {
        result = calcBusinessDays(dateS, endD);
        return result;
    }

    if((dS < sD) && (dE > eD)) {
        result = calcBusinessDays(startD, endD);
        return result;
    }
}


Date.prototype.daysInMonth = function() //колличесто дней в месяце
{
	return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};




function daysInYear(year) //колличесто дней в году
{
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}



function addDays(date, days)// прибавление дней к дате
{
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}



function calcBusinessDays(startDate, endDate) { // результатом функции является разница в днях между 2 датами без учета выходных дней
    var startDate = moment(startDate, "YYYY-MM-DD");
    var endDate = moment(endDate, "YYYY-MM-DD");
    var businessDays = 0;
    while (startDate.isSameOrBefore(endDate,'day')) {
        if (startDate.day() != 0 && startDate.day() != 6) businessDays++;
        startDate.add(1,'d');
        }
    if (endDate.day() == 6){
      return businessDays;
    }
return businessDays - 1 ;
}



function endDays(startDate, duration)// подчет конечной даты без учета выходных
{
  var datevar = moment(startDate);
  var i = 0;
  while (i < duration)
  {
    if (datevar.day() != 0 && datevar.day() != 6)// если не выходной
    {
      i += 1;
    }
    datevar = moment(addDays(datevar, 1));
  }
  datevar = new Date(datevar)
  datevar.setHours(0);
  datevar.setMinutes(0);
  datevar.setSeconds(0);
  return datevar;
}

function zeroTime(date)// обнуление часов минут и секунд
{
  date = new Date(date)
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}
