//Создаём переменные текущей даты и массив названий месяцев
var myDate = new Date();
var day = String(myDate.getDate());
var month = myDate.getMonth() + 1;
var year = myDate.getFullYear();
var month_mas = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var mas_selectWeekends = [];
//Необходимые переменные по DOM
var days_of_month = document.querySelector('.days__of__month');
var cur_month = document.querySelector('.cur__month');
var cur_year = document.querySelector('.cur__year');
var cur_time = document.querySelector('.cur__time');
var pre_month_btn = document.querySelector('.pre__month');
var next_month_btn = document.querySelector('.next__month');
var radio_su = document.querySelector('#radioButtonSU');
//Label с текущим месяцем
cur_month.innerHTML = "" + month_mas[month - 1];
//Label с текущим годом
cur_year.innerHTML = "" + year;
//Label с текущим временем
cur_time.innerHTML = "" + new Date().toLocaleTimeString();
//Функция времени на часах
setInterval(function () {
    cur_time.innerHTML = (new Date()).toLocaleTimeString();
}, 1000);
//Функция отображения текущей даты в label
document.querySelector('.cur__date').insertAdjacentHTML('afterbegin', "<p style=\"margin: 0;\"><span style=\"cursor: pointer;\">" + day + "th " + month_mas[month - 1] + " " + year + "</span></p>");
//Условие Если выбраны выходные дни
var ifSelectWeekend = function () {
    if (mas_selectWeekends.length !== 0) {
        mas_selectWeekends.forEach(function (y) {
            document.querySelectorAll(".main__day__" + y).forEach(function (x) {
                x.classList.add('select__weekend');
                x.style.background = 'rgba(132, 146, 131, .9)';
                x.style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                x.style.color = 'white';
            });
        });
    }
};
//При клике на текущую дату, открывает её
document.querySelector('.cur__date').addEventListener('click', function () {
    cur_month.innerHTML = "" + month_mas[myDate.getMonth()];
    cur_year.innerHTML = "" + String(myDate.getFullYear());
    month = myDate.getMonth() + 1;
    year = myDate.getFullYear();
    clearCal();
    createCal(year, month);
    //localStorage.getItem(mas_selectWeekends)
    ifSelectWeekend();
    tapToDoList();
    markToDoDays();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').addEventListener('click', function () { });
    }
    document.querySelector('#radio__cur__month').addEventListener('click', function () { });
});
//Получаем номер дня недели, делаем воскресенье 7-ым вместо 0-вого.
var getDay = function (date) {
    var day = date.getDay();
    if (day === 0) {
        day = 7;
    }
    return day - 1;
};
//Основная функция формирования расположения дней в календаре
var createCal = function (yy, mm) {
    var d = new Date(yy, mm - 1);
    //Пустые клетки прошлого месяца
    for (var i = 0; i < getDay(d); i++) {
        var x = new Date(yy, mm - 2, (new Date(yy, mm - 1).getUTCDate())).getDate();
        days_of_month.insertAdjacentHTML('afterbegin', "<button class=\"days clear__day cld1__" + (x - i) + "\">" + (x - i) + "</button>");
        //Отмечаем выходные прошлого месяца,если есть(может быть только суббота)
        if ((i + 1) % 6 === 0) {
            document.querySelector(".cld1__" + x).classList.add('weekend');
        }
        if (radio_su.checked && (i + 1) % 6 === 0) {
            document.querySelector(".cld1__" + x).classList.remove('weekend');
        }
        if (radio_su.checked && new Date(yy, mm - 2, x - i).getDay() + 1 === 1) {
            document.querySelector(".cld1__" + (x - i)).classList.add('weekend');
        }
    }
    //Клетки текущего месяца
    while (d.getMonth() === mm - 1) {
        days_of_month.insertAdjacentHTML('beforeend', "<button class=\"days main__day main__day__" + d.getDate() + "\">" + d.getDate() + "</button>");
        //Отмечаем выходные текущего месяца
        if ((getDay(d) + 1) % 6 === 0 || (getDay(d) + 1) % 7 === 0) {
            document.querySelector(".main__day__" + d.getDate()).classList.add('weekend');
        }
        if (radio_su.checked && (getDay(d) + 1) % 6 === 0) {
            document.querySelector(".main__day__" + d.getDate()).classList.remove('weekend');
        }
        else if (radio_su.checked && (getDay(d) + 1) === 1) {
            document.querySelector(".main__day__" + d.getDate()).classList.add('weekend');
        }
        d.setDate(d.getDate() + 1);
    }
    //Пустые клетки нового месяца
    if (getDay(d) !== 0) {
        for (var i = getDay(d); i < 7; i++) {
            days_of_month.insertAdjacentHTML('beforeend', "<button class=\"days clear__day2 cld2__" + ((i + 1) - getDay(d)) + "\">" + ((i + 1) - getDay(d)) + "</button>");
            //Отмечаем выходные нового месяца,если есть
            if ((i + 1) % 6 === 0 || (i + 1) % 7 === 0) {
                document.querySelector(".cld2__" + ((i + 1) - getDay(d))).classList.add('weekend');
            }
            if (radio_su.checked && (i + 1) % 6 === 0) {
                document.querySelector(".cld2__" + ((i + 1) - getDay(d))).classList.remove('weekend');
            }
            else if (radio_su.checked && (i + 1) === 1) {
                document.querySelector(".cld2__" + ((i + 1) - getDay(d))).classList.add('weekend');
            }
        }
    }
    //Отметка текущего дня месяца рамкой
    document.querySelectorAll('.days').forEach(function (x) {
        if (x.innerText === day && !x.classList.contains('clear__day') && !x.classList.contains('clear__day2') && month === myDate.getMonth() + 1 && year === myDate.getFullYear())
            x.classList.add('active');
    });
};
createCal(year, month);
//Функция очистки дней
var clearCal = function () {
    days_of_month.innerHTML = '';
};
//Переключение месяцев назад (стрелка вверх)
pre_month_btn.onclick = function (event) {
    if (event.target) {
        month--;
        cur_month.innerText = "" + month_mas[month - 1];
        if (month === 1) {
            cur_month.innerText = "" + month_mas[month - 1];
        }
        else if (month < 1) {
            month = 12;
            cur_month.innerText = "" + month_mas[month - 1];
            year--;
            cur_year.innerText = "" + year;
        }
    }
    clearCal();
    createCal(year, month);
    localStorage.getItem(mas_selectWeekends);
    ifSelectWeekend()(document.querySelector('#radio__cur__month')).onclick(event);
    tapToDoList();
    markToDoDays();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick(event);
    }
};
//Переключение месяцев вперёд (стрелка вниз)
next_month_btn.onclick = function (event) {
    if (event.target) {
        month++;
        cur_month.innerText = "" + month_mas[month - 1];
        if (month === 12) {
            cur_month.innerText = "" + month_mas[month - 1];
        }
        else if (month > 12) {
            month = 1;
            cur_month.innerText = "" + month_mas[month - 1];
            year++;
            cur_year.innerText = "" + year;
        }
    }
    clearCal();
    createCal(year, month);
    localStorage.getItem(mas_selectWeekends);
    ifSelectWeekend()(document.querySelector('#radio__cur__month')).onclick(event);
    tapToDoList();
    markToDoDays();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick(event);
    }
};
//Блок date__input__div
document.querySelectorAll('.cur__month_and_year').forEach(function (x) {
    x.onclick = function () {
        document.querySelector('.cur__month').style.display = 'none';
        document.querySelector('.cur__year').style.display = 'none';
        document.querySelector('.date__input__div').style.display = 'flex';
    };
})(document.querySelector('.btn__accept')).onclick = function (event) {
    if (event.target) {
        var selectValue = document.querySelector('.input__input__div').value;
        if (!selectValue.match(/\d{1,2}\/\d{4}/g)) {
            alert('Введены некорректные данные');
            return document.querySelector('.input__input__div').value = '';
        }
        var selectMonth = Number(selectValue.substring(0, selectValue.indexOf('/')));
        var selectYear = Number(selectValue.substring(selectValue.indexOf('/') + 1));
        if (selectMonth > 0 && selectMonth <= 12 && selectYear >= 1970 && selectYear < 287586) {
            month = +selectMonth;
            year = +selectYear;
        }
        else {
            alert('Введены некорректные данные');
            return document.querySelector('.input__input__div').value = '';
        }
    }
    document.querySelector('.date__input__div').style.display = 'none';
    document.querySelector('.cur__month').style.display = 'unset';
    document.querySelector('.cur__year').style.display = 'unset';
    clearCal();
    createCal(year, month);
    localStorage.getItem(mas_selectWeekends);
    if (mas_selectWeekends.length !== 0) {
        mas_selectWeekends.forEach(function (y) {
            document.querySelectorAll(".main__day__" + y).forEach(function (x) {
                x.classList.add('select__weekend');
                x.style.background = 'rgba(132, 146, 131, .9)';
                x.style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                x.style.color = 'white';
            });
        });
    }
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick();
    }
    cur_month.innerText = "" + month_mas[month - 1];
    cur_year.innerText = "" + year;
    document.querySelector('.input__input__div').value = '';
    document.querySelector('#radio__cur__month').onclick();
    tapToDoList();
    markToDoDays();
};
//Обработка клика по Back
document.querySelector('.btn__back').onclick = function () {
    document.querySelector('.date__input__div').style.display = 'none';
    document.querySelector('.cur__month').style.display = 'unset';
    document.querySelector('.cur__year').style.display = 'unset';
    document.querySelector('.input__input__div').value = '';
};
//Обработка клика по Settings
document.querySelector('.btn__settings').onclick = function () {
    document.querySelector('.btn__settings').style.display = 'none';
    document.querySelector('.settings__div').style.display = 'flex';
};
//Обработка клика по Select Weekends
document.querySelector('.btn__select__weekends').onclick = function () {
    document.querySelector('.cal__div').style.backgroundImage = "url('styles/images/weekend__fon.jpg')";
    document.querySelector('.btn__select__weekends').style.background = 'rgba(132, 146, 131, .8)';
    document.querySelector('.btn__select__weekends').style.color = 'black';
    document.querySelector('.btn__select__weekends').style.boxShadow = 'inset 0 0 5px 0 black';
    document.querySelector('.btn__select__weekends').classList.add('inProgress');
    localStorage.getItem(mas_selectWeekends);
    if (localStorage.getItem(mas_selectWeekends) === null) {
        document.querySelectorAll('.days').forEach(function (x) { return x.onclick = function () {
            if (x.style.background === '') {
                x.classList.add('select__weekend');
                x.style.background = 'rgba(132, 146, 131, .9)';
                x.style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                x.style.color = 'white';
                mas_selectWeekends.push(x.innerText);
            }
            else if (x.style.color === 'white') {
                x.classList.remove('select__weekend');
                x.style.background = '';
                x.style.boxShadow = '';
                x.style.color = '';
                mas_selectWeekends.splice(mas_selectWeekends.indexOf(x.innerText), 1);
            }
        }; });
    }
    markToDoDays();
};
//Переключение первого дня недели(по-умолчанию Понедельник)
//Воскресенье - первый день
document.querySelector('#radioButtonSU').onclick = function () {
    if (document.querySelector('#radioButtonMO').checked === true) {
        document.querySelector('#radioButtonMO').checked = false;
        document.querySelector('#radioButtonSU').checked = true;
    }
    if (document.querySelector('#radioButtonSU').checked === true) {
        document.querySelector('.monday').remove();
        document.querySelector('.sunday').remove();
        document.querySelector('.days__of__week').insertAdjacentHTML('afterbegin', "<div class=\"monday\">MO</div>");
        document.querySelector('.days__of__week').insertAdjacentHTML('afterbegin', "<div class=\"sunday\">SU</div>");
        clearCal();
        getDay = function (date) {
            var day = date.getDay() + 1;
            if (day === 0) {
                day = 7;
            }
            return day - 1;
        };
        createCal(year, month);
    }
    localStorage.getItem(mas_selectWeekends);
    if (mas_selectWeekends.length !== 0) {
        mas_selectWeekends.forEach(function (y) {
            document.querySelectorAll(".main__day__" + y).forEach(function (x) {
                x.classList.add('select__weekend');
                x.style.background = 'rgba(132, 146, 131, .9)';
                x.style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                x.style.color = 'white';
            });
        });
    }
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick();
    }
    document.querySelector('#radio__cur__month').onclick();
    tapToDoList();
    markToDoDays();
};
//Понедельник - первый день
document.querySelector('#radioButtonMO').onclick = function () {
    if (document.querySelector('#radioButtonSU').checked === true) {
        document.querySelector('#radioButtonSU').checked = false;
        document.querySelector('#radioButtonMO').checked = true;
    }
    if (document.querySelector('#radioButtonMO').checked === true) {
        document.querySelector('.monday').remove();
        document.querySelector('.sunday').remove();
        document.querySelector('.days__of__week').insertAdjacentHTML('afterbegin', "<div class=\"monday\">MO</div>");
        document.querySelector('.days__of__week').insertAdjacentHTML('beforeend', "<div class=\"sunday\">SU</div>");
        clearCal();
        getDay = function (date) {
            var day = date.getDay();
            if (day === 0) {
                day = 7;
            }
            return day - 1;
        };
        createCal(year, month);
    }
    localStorage.getItem(mas_selectWeekends);
    if (mas_selectWeekends.length !== 0) {
        mas_selectWeekends.forEach(function (y) {
            document.querySelectorAll(".main__day__" + y).forEach(function (x) {
                x.classList.add('select__weekend');
                x.style.background = 'rgba(132, 146, 131, .9)';
                x.style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                x.style.color = 'white';
            });
        });
    }
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick();
    }
    document.querySelector('#radio__cur__month').onclick();
    tapToDoList();
    markToDoDays();
};
//Обработка клика по To Do radio
//ON
document.querySelector('#ON').onclick = function () {
    if (document.querySelector('#OFF').checked === true) {
        document.querySelector('#OFF').checked = false;
        document.querySelector('#ON').checked = true;
    }
    tapToDoList();
    markToDoDays();
};
//OFF
document.querySelector('#OFF').onclick = function () {
    if (document.querySelector('#ON').checked === true) {
        document.querySelector('#ON').checked = false;
        document.querySelector('#OFF').checked = true;
    }
    document.querySelectorAll(".main__day").forEach(function (x) {
        x.style.boxShadow = '';
        x.style.color = 'black';
        x.onclick = function () {
        };
    });
};
//Обработка checked Only current month
document.querySelector('#radio__cur__month').onclick = function () {
    if (document.querySelector('#radio__cur__month').checked === true) {
        document.querySelectorAll('.clear__day').forEach(function (x) { return x.style.opacity = '0'; });
        document.querySelectorAll('.clear__day2').forEach(function (x) { return x.style.opacity = '0'; });
    }
    if (document.querySelector('#radio__cur__month').checked === false) {
        document.querySelectorAll('.clear__day').forEach(function (x) { return x.style.opacity = ''; });
        document.querySelectorAll('.clear__day2').forEach(function (x) { return x.style.opacity = ''; });
    }
};
//Обработка клика по Back from Settings
document.querySelector('.btn__back__from__settings').onclick = function () {
    document.querySelector('.btn__settings').style.display = 'unset';
    document.querySelector('.settings__div').style.display = 'none';
};
//Обработка Cancel
document.querySelector('.btn__cancel').onclick = function () {
    document.querySelectorAll('.select__weekend').forEach(function (x) {
        x.style.background = '';
        x.classList.remove('select__weekend');
    });
    document.querySelector('#radio__cur__month').checked = false;
    document.querySelectorAll('.clear__day').forEach(function (x) { return x.style.opacity = ''; });
    document.querySelectorAll('.clear__day2').forEach(function (x) { return x.style.opacity = ''; });
    mas_selectWeekends = [];
    localStorage.removeItem('mas_selectWeekends');
    document.querySelector('#radioButtonMO').onclick();
    document.querySelector('#ON').onclick();
    document.querySelector('.btn__select__weekends').classList.remove('inProgress');
    document.querySelector('.cal__div').style.backgroundImage = "url('./styles/images/cal__fon.jpg')";
    document.querySelectorAll('.days').forEach(function (x) { return x.onclick = function () {
    }; });
    document.querySelector('.btn__select__weekends').style.backgroundColor = '';
    document.querySelector('.btn__select__weekends').style.color = '';
    document.querySelector('.btn__select__weekends').style.boxShadow = '';
    document.querySelector('.btn__settings').style.display = 'unset';
    document.querySelector('.settings__div').style.display = 'none';
    tapToDoList();
    markToDoDays();
};
//Обработка клика по Confirm
document.querySelector('.confirm__settings').onclick = function () {
    document.querySelector('.cal__div').style.backgroundImage = "url('./styles/images/cal__fon.jpg')";
    localStorage.setItem('mas_selectWeekends', mas_selectWeekends);
    document.querySelectorAll('.days').forEach(function (x) { return x.onclick = function () {
    }; });
    if (document.querySelector('#radioButtonMO').checked === true) {
        document.querySelector('#radioButtonMO').onclick();
    }
    else if (document.querySelector('#radioButtonSU').checked === true) {
        document.querySelector('#radioButtonSU').onclick();
    }
    document.querySelector('.btn__select__weekends').style.background = 'white';
    document.querySelector('.btn__select__weekends').style.color = 'coral';
    document.querySelector('.btn__select__weekends').style.boxShadow = '0 0 3px 3px coral';
    document.querySelectorAll('.days').forEach(function (x) {
        if (x.classList.contains('select__weekend')) {
            document.querySelector('.btn__select__weekends').style.background = 'white';
            document.querySelector('.btn__select__weekends').style.color = 'coral';
            document.querySelector('.btn__select__weekends').style.boxShadow = '0 0 3px 3px coral';
            document.querySelector('.btn__settings').style.display = 'unset';
            document.querySelector('.settings__div').style.display = 'none';
        }
        else if (!x.classList.contains('select__weekend')) {
            document.querySelector('.btn__select__weekends').style.backgroundColor = '';
            document.querySelector('.btn__select__weekends').style.color = '';
            document.querySelector('.btn__select__weekends').style.boxShadow = '';
            document.querySelectorAll('.days').forEach(function (x) { return x.onclick = function () {
            }; });
            document.querySelector('.cal__div').style.backgroundImage = "url('./styles/images/cal__fon.jpg')";
            document.querySelector('.btn__settings').style.display = 'unset';
            document.querySelector('.settings__div').style.display = 'none';
        }
    });
    document.querySelector('.btn__select__weekends').classList.remove('inProgress');
    tapToDoList();
    markToDoDays();
    if (document.querySelector('#OFF').checked === true) {
        document.querySelector('#OFF').onclick();
    }
    else if (document.querySelector('#ON').checked === true) {
        document.querySelector('#ON').onclick();
    }
};
//To Do List и всё,что с ним связано
//Создание листа при нажатии дня
var tapToDoList = function () {
    document.querySelectorAll('.main__day').forEach(function (dayX) {
        dayX.onclick = function () {
            if (document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year)) {
                document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).classList.toggle('hide__element');
            }
            else {
                document.querySelector('.cal__div').insertAdjacentHTML('afterbegin', "<div class=\"to__do__list__div day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + "\"></div>");
                document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).insertAdjacentHTML('afterbegin', "<button class=\"to__do__btn to__do__back\">Back</button>");
                document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).insertAdjacentHTML('afterbegin', "<button class=\"to__do__btn to__do__delete btn__delete__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + "\" style=\"display: none\">Delete</button>");
                document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).insertAdjacentHTML('afterbegin', "<button class=\"to__do__btn to__do__add\">Add</button>");
                document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).insertAdjacentHTML('afterbegin', "<ul class=\"to__do__ul ul__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + "\"></ul>");
                document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).insertAdjacentHTML('afterbegin', "<p class=\"to__do__p\">To Do List on " + dayX.innerText + "th " + month_mas[month - 1] + ":</p>");
            }
            //Отключить лишние нажатия,пока открыт To Do List
            if (document.querySelector('.to__do__list__div')) {
                document.querySelector('.arrows').style.pointerEvents = 'none';
                document.querySelector('.cur__date').style.pointerEvents = 'none';
                document.querySelectorAll('.days').forEach(function (x) { return x.style.pointerEvents = 'none'; });
                document.querySelector('.settings__div').style.display = 'none';
            }
            //Back from To Do List
            document.querySelector('.to__do__back').onclick = function () {
                if (document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).classList.contains('withInfo')) {
                    document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).classList.add('hide__element');
                }
                else {
                    document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).remove();
                    localStorage.removeItem("td__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year);
                    document.querySelector(".main__day__" + dayX.innerText).style.boxShadow = '';
                    document.querySelector(".main__day__" + dayX.innerText).style.color = '';
                    if (document.querySelector(".main__day__" + dayX.innerText).classList.contains('select__weekend')) {
                        document.querySelector(".main__day__" + dayX.innerText).style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                        document.querySelector(".main__day__" + dayX.innerText).style.color = 'white';
                    }
                }
                document.querySelector('.arrows').style.pointerEvents = '';
                document.querySelector('.cur__date').style.pointerEvents = '';
                document.querySelectorAll('.days').forEach(function (x) { return x.style.pointerEvents = ''; });
                document.querySelector('.btn__settings').style.display = 'unset';
                markToDoDays();
            };
            //Добавление,удаление строк To Do List
            //Добавление
            document.querySelector('.to__do__add').onclick = function () {
                if (document.querySelectorAll(".li__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).length === 0) {
                    document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).classList.add('withInfo');
                    document.querySelector(".btn__delete__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.display = '';
                    localStorage.setItem("td__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year, dayX.innerText + "," + month + "," + year);
                }
                if (document.querySelectorAll(".li__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).length > 9) {
                    return;
                }
                else {
                    document.querySelector(".ul__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).insertAdjacentHTML('beforeend', "<li class=\"to__do__li li__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + "\">\n                        <button class=\"to__do__input__radio task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + "\">&#10004</button>\n                        <button class=\"to__do__input__radio task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + " to__do__input__cansel\">&#10006</button>\n                        <input type=\"text\" class=\"to__do__input task__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year + "\"> \n                    </li>");
                    //ДОРАБОТАТЬ,ЧТОБЫ КАЖДЫЙ radiobutton БЫЛ КАК ОТДЕЛЬНОЕ ЦЕЛОЕ(ОТМЕТКА ВЫПОЛНЕНО ИЛИ НЕТ ЗАДАНИЕ ДНЯ)
                    document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).addEventListener('click', function () {
                        document.querySelector(".task__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.textDecoration = 'line-through';
                        document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.background = 'black';
                        document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.boxShadow = '0 0 2px 2px floralwhite';
                        document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.color = 'floralwhite';
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).classList.remove('to__do__input__cansel');
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.background = '';
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.boxShadow = '';
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.color = '';
                    });
                    document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).addEventListener('click', function () {
                        document.querySelector(".task__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.textDecoration = 'none';
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.background = 'black';
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.boxShadow = '0 0 2px 2px floralwhite';
                        document.querySelector(".task__radio2__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.color = 'floralwhite';
                        document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.background = '';
                        document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.boxShadow = '';
                        document.querySelector(".task__radio1__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.color = '';
                    });
                }
            };
            //Удаление
            document.querySelector('.to__do__delete').onclick = function () {
                var myLastInput;
                for (var _i = 0, _a = document.querySelector(".ul__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).children; _i < _a.length; _i++) {
                    var child = _a[_i];
                    myLastInput = child;
                }
                if (myLastInput.classList.contains('to__do__li') && document.querySelectorAll(".li__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).length > 0) {
                    myLastInput.remove();
                }
                if (document.querySelectorAll(".li__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).length === 0) {
                    document.querySelector(".day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).classList.remove('withInfo');
                    localStorage.removeItem("td__day__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year);
                    document.querySelector(".btn__delete__" + dayX.innerText + "__" + month_mas[month - 1] + "__" + year).style.display = 'none';
                }
            };
        };
    });
};
tapToDoList();
//Обводим день,если есть дела To Do
var markToDoDays = function () {
    for (var i = 0; i < localStorage.length; i++) {
        var myMasWithKeys = localStorage.getItem(localStorage.key(i)).split(',');
        if (month == myMasWithKeys[1] && year == myMasWithKeys[2] && document.querySelector('#ON').checked === true && document.querySelector(".day__" + myMasWithKeys[0] + "__" + month_mas[month - 1] + "__" + year)) {
            document.querySelector(".main__day__" + myMasWithKeys[0]).style.boxShadow = 'inset 0 0 17px 4px black';
            document.querySelector(".main__day__" + myMasWithKeys[0]).style.color = 'white';
        }
        else if (document.querySelector('#ON').checked === false) {
            return;
        }
    }
};
//Работа с погодой
var cur__city = 'Mogilev';
var url__weather = "https://api.openweathermap.org/data/2.5/forecast?q=" + cur__city + "&appid=df7de813ed047bccc7578b4b0cd34470&units=metric";
//При нажатии на город показывает инпут куда вводим город
document.querySelector('.weather__city__name').onclick = function () {
    document.querySelector('.weather__city__name').style.display = 'none';
    document.querySelector('.weather__city__input').style.display = 'unset';
};
//Таймер на ввод названия города
var timer = null;
document.querySelector('.weather__city__input').addEventListener('input', function (e) {
    clearTimeout(timer);
    timer = setTimeout(function () {
        var x = e.target.value;
        cur__city = x;
        url__weather = "https://api.openweathermap.org/data/2.5/forecast?q=" + cur__city + "&appid=df7de813ed047bccc7578b4b0cd34470&units=metric";
        document.querySelector('.weather__city__name').style.display = 'unset';
        document.querySelector('.weather__city__input').style.display = 'none';
        //Если ввели то,на что не делает запрос,то очищает input и оставляет предыдущие параметры
        if (url__weather) {
            document.querySelector('.weather__city__input').value = '';
        }
        //Запрос fetch после изменения города
        fetch(url__weather)
            .then(function (response) { return response.json(); })
            .then(function (json) {
            var averageTemp1 = 0;
            var averageTemp2 = 0;
            var averageTemp3 = 0;
            var averageTemp4 = 0;
            //Перебираем list
            for (var jsonKey in json.list) {
                if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 1) {
                    averageTemp1 += Math.round(json.list[jsonKey].main.temp) / 8;
                }
                if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 2) {
                    averageTemp2 += Math.round(json.list[jsonKey].main.temp) / 8;
                }
                if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 3) {
                    averageTemp3 += Math.round(json.list[jsonKey].main.temp) / 8;
                }
                if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 4) {
                    averageTemp4 += Math.round(json.list[jsonKey].main.temp) / 8;
                }
            }
            document.querySelector('.temp__today').innerText = Math.round(json.list[0].main.temp) + " C";
            document.querySelector('.weather__img').src = "http://openweathermap.org/img/w/" + json.list[0].weather[0].icon + ".png";
            document.querySelector('.weather__city__name').innerText = "" + cur__city;
            document.querySelector('.t1').innerText = +day + 1 + "th:" + Math.round(averageTemp1 - 1) + ".." + Math.round(averageTemp1 + 1) + "C";
            document.querySelector('.t2').innerText = +day + 2 + "th:" + Math.round(averageTemp2 - 1) + ".." + Math.round(averageTemp2 + 1) + "C";
            document.querySelector('.t3').innerText = +day + 3 + "th:" + Math.round(averageTemp3 - 1) + ".." + Math.round(averageTemp3 + 1) + "C";
            document.querySelector('.t4').innerText = +day + 4 + "th:" + Math.round(averageTemp4 - 1) + ".." + Math.round(averageTemp4 + 1) + "C";
        });
    }, 1200);
});
//Запрос fetch до изменения города на мой город Могилёв(по умолчанию)
fetch(url__weather)
    .then(function (response) { return response.json(); })
    .then(function (json) {
    var averageTemp1 = 0;
    var averageTemp2 = 0;
    var averageTemp3 = 0;
    var averageTemp4 = 0;
    //Перебираем list
    for (var jsonKey in json.list) {
        if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 1) {
            averageTemp1 += Math.round(json.list[jsonKey].main.temp) / 8;
        }
        if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 2) {
            averageTemp2 += Math.round(json.list[jsonKey].main.temp) / 8;
        }
        if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 3) {
            averageTemp3 += Math.round(json.list[jsonKey].main.temp) / 8;
        }
        if (json.list[jsonKey].dt_txt.substring(8, 10) == +day + 4) {
            averageTemp4 += Math.round(json.list[jsonKey].main.temp) / 8;
        }
    }
    document.querySelector('.temp__today').innerText = Math.round(json.list[0].main.temp) + " C";
    document.querySelector('.weather__img').src = "http://openweathermap.org/img/w/" + json.list[0].weather[0].icon + ".png";
    document.querySelector('.weather__city__name').innerText = "" + cur__city;
    document.querySelector('.t1').innerText = +day + 1 + "th:" + Math.round(averageTemp1 - 1) + ".." + Math.round(averageTemp1 + 1) + "C";
    document.querySelector('.t2').innerText = +day + 2 + "th:" + Math.round(averageTemp2 - 1) + ".." + Math.round(averageTemp2 + 1) + "C";
    document.querySelector('.t3').innerText = +day + 3 + "th:" + Math.round(averageTemp3 - 1) + ".." + Math.round(averageTemp3 + 1) + "C";
    document.querySelector('.t4').innerText = +day + 4 + "th:" + Math.round(averageTemp4 - 1) + ".." + Math.round(averageTemp4 + 1) + "C";
});
