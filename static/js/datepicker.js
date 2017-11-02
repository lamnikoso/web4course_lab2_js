'use strict';

function DatePicker(id, callback) {
    this.id = id;
    this.callback = callback;    
    this.firstDayOfWeek = 1;
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.current = {};
    this.init();
}

DatePicker.prototype.init = function() {
    document.removeEventListener('click', this.bindAction, false);
    document.addEventListener('click', this.bindAction.bind(this), false);
};

DatePicker.prototype.rebuild = function() {
    let container = document.getElementById(this.id);
    if (container) {
        let datePicker = container.firstChild;
        if (datePicker) {
            datePicker.remove();
        }
    }
};

DatePicker.prototype.render = function(date) {
    if (date !== undefined) {
        this.current = {
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate()
        };

        this.rebuild();

        this.picker = document.createElement('div');
        this.picker.classList.add('datepicker');
        this.picker.appendChild(this.drawNavigation());
        this.picker.appendChild(this.drawWeekHeader());
        var weeks = this.getWeeks();
        for (var i=0; i<weeks.length; i++) {
            this.picker.appendChild(weeks[i]);
        }
        
        let node = document.getElementById(this.id);
        node.appendChild(this.picker);
    } else {
        console.log("Arguments not found <Date>");
    }
};

DatePicker.prototype.drawNavigation = function() {
    let nav = document.createElement('div');
    nav.classList.add('top');

    let previousMonth = document.createElement('div');
    previousMonth.classList.add('arrow-prev');
    previousMonth.innerHTML = '&lsaquo;';

    let currentMonthYear = document.createElement('div');
    currentMonthYear.classList.add('info');
    currentMonthYear.innerHTML = this.months[this.current.month].toUpperCase() + '</br> <span>' + this.current.year + '</span>';

    let nextMonth = document.createElement('div');
    nextMonth.classList.add('arrow-next');
    nextMonth.innerHTML = '&rsaquo;';

    nav.appendChild(previousMonth);
    nav.appendChild(currentMonthYear);
    nav.appendChild(nextMonth);
    return nav;
};

DatePicker.prototype.drawWeekHeader = function() {
    let weekdays = this.weekdays.slice(this.firstDayOfWeek)
        .concat(this.weekdays.slice(0, this.firstDayOfWeek));
    let weekHeader = document.createElement('div');
    weekHeader.classList.add('week-header');
    for (let i=0; i<7; i++) {
        let dayOfWeek = document.createElement('div');
        dayOfWeek.innerHTML = weekdays[i];
        weekHeader.appendChild(dayOfWeek);
    }
    return weekHeader;
};

DatePicker.prototype.getWeeks = function() {
    // Get week days according to options
    var weekdays = this.weekdays.slice(this.firstDayOfWeek)
        .concat(this.weekdays.slice(0, this.firstDayOfWeek));
    // Get first day of month and update acconding to options
    var firstOfMonth = new Date(this.current.year, this.current.month, 1).getDay();
    firstOfMonth = firstOfMonth < this.firstDayOfWeek ? 7+(firstOfMonth - this.firstDayOfWeek ) : firstOfMonth - this.firstDayOfWeek;

    var daysInPreviousMonth = new Date(this.current.year, this.current.month, 0).getDate();
    var daysInMonth = new Date(this.current.year, this.current.month+1, 0).getDate();

    var days = [], weeks = [];
    // Define last days of previous month if current month does not start on `firstOfMonth`
    for (let i=firstOfMonth-1; i>=0; i--) {
        let day = document.createElement('div');
        day.classList.add('no-select');
        day.innerHTML = daysInPreviousMonth - i;
        days.push(day);
    }
    // Define days in current month
    for (let i=0; i<daysInMonth; i++) {
        if (i && (firstOfMonth+i)%7 === 0) {
            weeks.push(this.addWeek(days) );
            days = [];
        }
        let day = document.createElement('div');
        day.classList.add('day');
        if (this.current.day === i+1) {
            day.classList.add('selected');
        }
        day.innerHTML = i+1;
        days.push(day);
    }
    // Define days of next month if last week is not full
    if (days.length) {
        var len = days.length;
        for (let i=0; i<7-len; i++) {
            var day = document.createElement('div');
            day.classList.add('no-select');
            day.innerHTML = i+1;
            days.push(day);
        }
        weeks.push(this.addWeek(days));
    }
    return weeks;
};

DatePicker.prototype.getPreviousMonth = function() {
    this.render(new Date(this.current.year, this.current.month - 1));        
};

DatePicker.prototype.getNextMonth = function() {
    this.render(new Date(this.current.year, this.current.month + 1));
};

DatePicker.prototype.addWeek = function(days) {
    let week = document.createElement('div');
    week.classList.add('week');
    for (let i=0; i<days.length; ++i) {
        week.appendChild(days[i]);
    }
    return week;
};

DatePicker.prototype.getParent = function(obj, parentId) {
    try {
        return obj.id===parentId ? obj : this.getParent(obj.parentNode, parentId);
    } catch (e) {
        try {
            return this.getParent(obj.parentNode, parentId);
        } catch (e) {
            return;
        }
    }
};

DatePicker.prototype.bindAction = function(event) {
    let target = event.target;
    let parent = this.getParent(target, this.id);
    if(parent) {
        if (target.className === 'arrow-next') {
            this.getNextMonth();
        } else if (target.className === 'arrow-prev') {
            this.getPreviousMonth();
        } else if (target.className === 'day') {
            let current = {
                year: this.current.year,
                month: this.current.month,
                day: target.innerHTML
            };
            this.render(new Date(current.year, current.month, current.day));
            if (this.callback !== undefined) {
                current.month++;
                this.callback(this.id, current);
            } else {
                console.log('Arguments not found <callback>');
            }
        }
    }
};