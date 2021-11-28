//Создаём переменные текущей даты и массив названий месяцев
let myDate = new Date();
let day = String(myDate.getDate());
let month = myDate.getMonth() + 1;
let year = myDate.getFullYear();
let month_mas = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let mas_selectWeekends = [];
//Необходимые переменные по DOM
let days_of_month = document.querySelector('.days__of__month');
let cur_month = document.querySelector('.cur__month');
let cur_year = document.querySelector('.cur__year');
let cur_time = document.querySelector('.cur__time');
let pre_month_btn = document.querySelector('.pre__month');
let next_month_btn = document.querySelector('.next__month');
let radio_su = document.querySelector('#radioButtonSU');
//Label с текущим месяцем
cur_month.innerHTML = `${month_mas[month - 1]}`;
//Label с текущим годом
cur_year.innerHTML = `${year}`;
//Label с текущим временем
cur_time.innerHTML = `${new Date().toLocaleTimeString()}`;
//Функция времени на часах
setInterval(function () {
    cur_time.innerHTML = (new Date()).toLocaleTimeString();
}, 1000);
//Функция отображения текущей даты в label
document.querySelector('.cur__date').insertAdjacentHTML('afterbegin', `<p style="margin: 0;"><span style="cursor: pointer;">${day}th ${month_mas[month - 1]} ${year}</span></p>`);
//Условие Если выбраны выходные дни
let ifSelectWeekend = () => {
    if (mas_selectWeekends.length !== 0) {
        mas_selectWeekends.forEach(y => {
            document.querySelectorAll(`.main__day__${y}`).forEach((x) => {
                x.classList.add('select__weekend');
                x.style.background = 'rgba(132, 146, 131, .9)';
                x.style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                x.style.color = 'white';
            });
        });
    }
};
//При клике на текущую дату, открывает её
document.querySelector('.cur__date').addEventListener('click', () => {
    cur_month.innerHTML = `${month_mas[myDate.getMonth()]}`;
    cur_year.innerHTML = `${String(myDate.getFullYear())}`;
    month = myDate.getMonth() + 1;
    year = myDate.getFullYear();
    clearCal();
    createCal(year, month);
    //localStorage.getItem(mas_selectWeekends)
    ifSelectWeekend();
    tapToDoList();
    markToDoDays();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').addEventListener('click', () => {
        });
    }
    document.querySelector('#radio__cur__month').addEventListener('click', () => {
    });
});
//Получаем номер дня недели, делаем воскресенье 7-ым вместо 0-вого.
let getDay = (date) => {
    let day = date.getDay();
    if (day === 0) {
        day = 7;
    }
    return day - 1;
};
//Основная функция формирования расположения дней в календаре
let createCal = (yy, mm) => {
    let d = new Date(yy, mm - 1);
    //Пустые клетки прошлого месяца
    for (let i = 0; i < getDay(d); i++) {
        let x = new Date(yy, mm - 2, (new Date(yy, mm - 1).getUTCDate())).getDate();
        days_of_month.insertAdjacentHTML('afterbegin', `<button class="days clear__day cld1__${x - i}">${x - i}</button>`);
        //Отмечаем выходные прошлого месяца,если есть(может быть только суббота)
        if ((i + 1) % 6 === 0) {
            document.querySelector(`.cld1__${x}`).classList.add('weekend');
        }
        if (radio_su.checked && (i + 1) % 6 === 0) {
            document.querySelector(`.cld1__${x}`).classList.remove('weekend');
        }
        if (radio_su.checked && new Date(yy, mm - 2, x - i).getDay() + 1 === 1) {
            document.querySelector(`.cld1__${x - i}`).classList.add('weekend');
        }
    }
    //Клетки текущего месяца
    while (d.getMonth() === mm - 1) {
        days_of_month.insertAdjacentHTML('beforeend', `<button class="days main__day main__day__${d.getDate()}">${d.getDate()}</button>`);
        //Отмечаем выходные текущего месяца
        if ((getDay(d) + 1) % 6 === 0 || (getDay(d) + 1) % 7 === 0) {
            document.querySelector(`.main__day__${d.getDate()}`).classList.add('weekend');
        }
        if (radio_su.checked && (getDay(d) + 1) % 6 === 0) {
            document.querySelector(`.main__day__${d.getDate()}`).classList.remove('weekend');
        }
        else if (radio_su.checked && (getDay(d) + 1) === 1) {
            document.querySelector(`.main__day__${d.getDate()}`).classList.add('weekend');
        }
        d.setDate(d.getDate() + 1);
    }
    //Пустые клетки нового месяца
    if (getDay(d) !== 0) {
        for (let i = getDay(d); i < 7; i++) {
            days_of_month.insertAdjacentHTML('beforeend', `<button class="days clear__day2 cld2__${(i + 1) - getDay(d)}">${(i + 1) - getDay(d)}</button>`);
            //Отмечаем выходные нового месяца,если есть
            if ((i + 1) % 6 === 0 || (i + 1) % 7 === 0) {
                document.querySelector(`.cld2__${(i + 1) - getDay(d)}`).classList.add('weekend');
            }
            if (radio_su.checked && (i + 1) % 6 === 0) {
                document.querySelector(`.cld2__${(i + 1) - getDay(d)}`).classList.remove('weekend');
            }
            else if (radio_su.checked && (i + 1) === 1) {
                document.querySelector(`.cld2__${(i + 1) - getDay(d)}`).classList.add('weekend');
            }
        }
    }
    //Отметка текущего дня месяца рамкой
    document.querySelectorAll('.days').forEach((x) => {
        if (x.innerText === day && !x.classList.contains('clear__day') && !x.classList.contains('clear__day2') && month === myDate.getMonth() + 1 && year === myDate.getFullYear())
            x.classList.add('active');
    });
};
createCal(year, month);
//Функция очистки дней
let clearCal = () => {
    days_of_month.innerHTML = '';
};
//Переключение месяцев назад (стрелка вверх)
pre_month_btn.onclick = (event) => {
    if (event.target) {
        month--;
        cur_month.innerText = `${month_mas[month - 1]}`;
        if (month === 1) {
            cur_month.innerText = `${month_mas[month - 1]}`;
        }
        else if (month < 1) {
            month = 12;
            cur_month.innerText = `${month_mas[month - 1]}`;
            year--;
            cur_year.innerText = `${year}`;
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
next_month_btn.onclick = (event) => {
    if (event.target) {
        month++;
        cur_month.innerText = `${month_mas[month - 1]}`;
        if (month === 12) {
            cur_month.innerText = `${month_mas[month - 1]}`;
        }
        else if (month > 12) {
            month = 1;
            cur_month.innerText = `${month_mas[month - 1]}`;
            year++;
            cur_year.innerText = `${year}`;
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
document.querySelector('.cur__month_and_year').onclick = () => {
    document.querySelector('.cur__month_and_year').style.display = 'none';
    document.querySelector('.date__input__div').style.display = 'flex';
};
//Обработка клика по Accept
document.querySelector('.btn__accept').onclick = (event) => {
    if (event.target) {
        let selectValue = document.querySelector('.input__input__div').value;
        if (!selectValue.match(/\d{1,2}\/\d{4}/g)) {
            alert('Введены некорректные данные');
            return document.querySelector('.input__input__div').value = '';
        }
        let selectMonth = Number(selectValue.substring(0, selectValue.indexOf('/')));
        let selectYear = Number(selectValue.substring(selectValue.indexOf('/') + 1));
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
    document.querySelector('.cur__month_and_year').style.display = 'flex';
    clearCal();
    createCal(year, month);
    localStorage.getItem(mas_selectWeekends);
    ifSelectWeekend();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick(event);
    }
    cur_month.innerText = `${month_mas[month - 1]}`;
    cur_year.innerText = `${year}`;
    document.querySelector('.input__input__div').value = '';
    document.querySelector('#radio__cur__month').onclick(event);
    tapToDoList();
    markToDoDays();
};
//Обработка клика по Back
document.querySelector('.btn__back').onclick = () => {
    document.querySelector('.date__input__div').style.display = 'none';
    document.querySelector('.cur__month_and_year').style.display = 'flex';
    document.querySelector('.input__input__div').value = '';
};
//Обработка клика по Settings
document.querySelector('.btn__settings').onclick = () => {
    document.querySelector('.btn__settings').style.display = 'none';
    document.querySelector('.settings__div').style.display = 'flex';
};
//Обработка клика по Select Weekends
document.querySelector('.btn__select__weekends').onclick = () => {
    document.querySelector('.cal__div').style.backgroundImage = "url('./src/styles/images/weekend__fon.jpg')";
    document.querySelector('.btn__select__weekends').style.background = 'rgba(132, 146, 131, .8)';
    document.querySelector('.btn__select__weekends').style.color = 'black';
    document.querySelector('.btn__select__weekends').style.boxShadow = 'inset 0 0 5px 0 black';
    document.querySelector('.btn__select__weekends').classList.add('inProgress');
    localStorage.getItem(mas_selectWeekends);
    if (localStorage.getItem(mas_selectWeekends) === null) {
        document.querySelectorAll('.days').forEach((x) => x.onclick = () => {
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
        });
    }
    markToDoDays();
};
//Переключение первого дня недели(по-умолчанию Понедельник)
//Воскресенье - первый день
document.querySelector('#radioButtonSU').onclick = () => {
    if (document.querySelector('#radioButtonMO').checked === true) {
        document.querySelector('#radioButtonMO').checked = false;
        document.querySelector('#radioButtonSU').checked = true;
    }
    if (document.querySelector('#radioButtonSU').checked === true) {
        document.querySelector('.monday').remove();
        document.querySelector('.sunday').remove();
        document.querySelector('.days__of__week').insertAdjacentHTML('afterbegin', `<div class="monday">MO</div>`);
        document.querySelector('.days__of__week').insertAdjacentHTML('afterbegin', `<div class="sunday">SU</div>`);
        clearCal();
        getDay = (date) => {
            let day = date.getDay() + 1;
            if (day === 0) {
                day = 7;
            }
            return day - 1;
        };
        createCal(year, month);
    }
    localStorage.getItem(mas_selectWeekends);
    ifSelectWeekend();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick;
    }
    document.querySelector('#radio__cur__month').onclick;
    tapToDoList();
    markToDoDays();
};
//Понедельник - первый день
document.querySelector('#radioButtonMO').onclick = () => {
    if (document.querySelector('#radioButtonSU').checked === true) {
        document.querySelector('#radioButtonSU').checked = false;
        document.querySelector('#radioButtonMO').checked = true;
    }
    if (document.querySelector('#radioButtonMO').checked === true) {
        document.querySelector('.monday').remove();
        document.querySelector('.sunday').remove();
        document.querySelector('.days__of__week').insertAdjacentHTML('afterbegin', `<div class="monday">MO</div>`);
        document.querySelector('.days__of__week').insertAdjacentHTML('beforeend', `<div class="sunday">SU</div>`);
        clearCal();
        getDay = (date) => {
            let day = date.getDay();
            if (day === 0) {
                day = 7;
            }
            return day - 1;
        };
        createCal(year, month);
    }
    localStorage.getItem(mas_selectWeekends);
    ifSelectWeekend();
    if (document.querySelector('.btn__select__weekends').classList.contains('inProgress')) {
        document.querySelector('.btn__select__weekends').onclick;
    }
    document.querySelector('#radio__cur__month').onclick;
    tapToDoList();
    markToDoDays();
};
//Обработка клика по To Do radio
//ON
document.querySelector('#ON').onclick = () => {
    if (document.querySelector('#OFF').checked === true) {
        document.querySelector('#OFF').checked = false;
        document.querySelector('#ON').checked = true;
    }
    tapToDoList();
    markToDoDays();
};
//OFF
document.querySelector('#OFF').onclick = () => {
    if (document.querySelector('#ON').checked === true) {
        document.querySelector('#ON').checked = false;
        document.querySelector('#OFF').checked = true;
    }
    document.querySelectorAll(`.main__day`).forEach((x) => {
        x.style.boxShadow = '';
        x.style.color = 'black';
        x.onclick = () => {
        };
    });
};
//Обработка checked Only current month
document.querySelector('#radio__cur__month').onclick = () => {
    if (document.querySelector('#radio__cur__month').checked === true) {
        document.querySelectorAll('.clear__day').forEach((x) => x.style.opacity = '0');
        document.querySelectorAll('.clear__day2').forEach((x) => x.style.opacity = '0');
    }
    if (document.querySelector('#radio__cur__month').checked === false) {
        document.querySelectorAll('.clear__day').forEach((x) => x.style.opacity = '');
        document.querySelectorAll('.clear__day2').forEach((x) => x.style.opacity = '');
    }
};
//Обработка клика по Back from Settings
document.querySelector('.btn__back__from__settings').onclick = () => {
    document.querySelector('.btn__settings').style.display = 'unset';
    document.querySelector('.settings__div').style.display = 'none';
};
//Обработка Cancel
document.querySelector('.btn__cancel').onclick = () => {
    document.querySelectorAll('.select__weekend').forEach((x) => {
        x.style.background = '';
        x.style.color = '';
        x.style.boxShadow = '';
        x.classList.remove('select__weekend');
    });
    document.querySelector('#radio__cur__month').checked = false;
    document.querySelectorAll('.clear__day').forEach((x) => x.style.opacity = '');
    document.querySelectorAll('.clear__day2').forEach((x) => x.style.opacity = '');
    mas_selectWeekends = [];
    localStorage.removeItem('mas_selectWeekends');
    document.querySelector('#radioButtonMO').onclick;
    document.querySelector('#ON').onclick;
    document.querySelector('.btn__select__weekends').classList.remove('inProgress');
    document.querySelector('.cal__div').style.backgroundImage = "url('./src/styles/images/cal__fon.jpg')";
    document.querySelectorAll('.days').forEach((x) => x.onclick = () => {
    });
    document.querySelector('.btn__select__weekends').style.backgroundColor = '';
    document.querySelector('.btn__select__weekends').style.color = '';
    document.querySelector('.btn__select__weekends').style.boxShadow = '';
    document.querySelector('.btn__settings').style.display = 'unset';
    document.querySelector('.settings__div').style.display = 'none';
    tapToDoList();
    markToDoDays();
};
//Обработка клика по Confirm
document.querySelector('.confirm__settings').onclick = () => {
    document.querySelector('.cal__div').style.backgroundImage = "url('./src/styles/images/cal__fon.jpg')";
    localStorage.setItem('mas_selectWeekends', mas_selectWeekends);
    document.querySelectorAll('.days').forEach((x) => x.onclick = () => {
    });
    if (document.querySelector('#radioButtonMO').checked === true) {
        document.querySelector('#radioButtonMO').onclick;
    }
    else if (document.querySelector('#radioButtonSU').checked === true) {
        document.querySelector('#radioButtonSU').onclick;
    }
    document.querySelector('.btn__select__weekends').style.background = 'white';
    document.querySelector('.btn__select__weekends').style.color = 'coral';
    document.querySelector('.btn__select__weekends').style.boxShadow = '0 0 3px 3px coral';
    document.querySelectorAll('.days').forEach(x => {
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
            document.querySelectorAll('.days').forEach((x) => x.onclick = () => {
            });
            document.querySelector('.cal__div').style.backgroundImage = "url('./src/styles/images/cal__fon.jpg')";
            document.querySelector('.btn__settings').style.display = 'unset';
            document.querySelector('.settings__div').style.display = 'none';
        }
    });
    document.querySelector('.btn__select__weekends').classList.remove('inProgress');
    tapToDoList();
    markToDoDays();
    if (document.querySelector('#OFF').checked === true) {
        document.querySelector('#OFF').onclick;
    }
    else if (document.querySelector('#ON').checked === true) {
        document.querySelector('#ON').onclick;
    }
};
//To Do List и всё,что с ним связано
//Создание листа при нажатии дня
let tapToDoList = () => {
    document.querySelectorAll('.main__day').forEach((dayX) => {
        dayX.onclick = () => {
            if (document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`)) {
                document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).classList.toggle('hide__element');
            }
            else {
                document.querySelector('.cal__div').insertAdjacentHTML('afterbegin', `<div class="to__do__list__div day__${dayX.innerText}__${month_mas[month - 1]}__${year}"></div>`);
                document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).insertAdjacentHTML('afterbegin', `<button class="to__do__btn to__do__back">Back</button>`);
                document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).insertAdjacentHTML('afterbegin', `<button class="to__do__btn to__do__delete btn__delete__${dayX.innerText}__${month_mas[month - 1]}__${year}" style="display: none">Delete</button>`);
                document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).insertAdjacentHTML('afterbegin', `<button class="to__do__btn to__do__add">Add</button>`);
                document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).insertAdjacentHTML('afterbegin', `<ul class="to__do__ul ul__${dayX.innerText}__${month_mas[month - 1]}__${year}"></ul>`);
                document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).insertAdjacentHTML('afterbegin', `<p class="to__do__p">To Do List on ${dayX.innerText}th ${month_mas[month - 1]}:</p>`);
            }
            //Отключить лишние нажатия,пока открыт To Do List
            if (document.querySelector('.to__do__list__div')) {
                document.querySelector('.arrows').style.pointerEvents = 'none';
                document.querySelector('.cur__date').style.pointerEvents = 'none';
                document.querySelectorAll('.days').forEach((x) => x.style.pointerEvents = 'none');
                document.querySelector('.settings__div').style.display = 'none';
            }
            //Back from To Do List
            document.querySelector('.to__do__back').onclick = () => {
                if (document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).classList.contains('withInfo')) {
                    document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).classList.add('hide__element');
                }
                else {
                    document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).remove();
                    localStorage.removeItem(`td__${dayX.innerText}__${month_mas[month - 1]}__${year}`);
                    document.querySelector(`.main__day__${dayX.innerText}`).style.boxShadow = '';
                    document.querySelector(`.main__day__${dayX.innerText}`).style.color = '';
                    if (document.querySelector(`.main__day__${dayX.innerText}`).classList.contains('select__weekend')) {
                        document.querySelector(`.main__day__${dayX.innerText}`).style.boxShadow = '0 0 6px 6px rgba(132, 146, 131, .9)';
                        document.querySelector(`.main__day__${dayX.innerText}`).style.color = 'white';
                    }
                }
                document.querySelector('.arrows').style.pointerEvents = '';
                document.querySelector('.cur__date').style.pointerEvents = '';
                document.querySelectorAll('.days').forEach((x) => x.style.pointerEvents = '');
                document.querySelector('.btn__settings').style.display = 'unset';
                markToDoDays();
            };
            //Добавление,удаление строк To Do List
            //Добавление
            document.querySelector('.to__do__add').onclick = () => {
                if (document.querySelectorAll(`.li__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).length === 0) {
                    document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).classList.add('withInfo');
                    document.querySelector(`.btn__delete__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.display = '';
                    localStorage.setItem(`td__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`, `${dayX.innerText},${month},${year}`);
                }
                if (document.querySelectorAll(`.li__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).length > 9) {
                    return;
                }
                else {
                    document.querySelector(`.ul__${dayX.innerText}__${month_mas[month - 1]}__${year}`).insertAdjacentHTML('beforeend', `<li class="to__do__li li__day__${dayX.innerText}__${month_mas[month - 1]}__${year}">
                        <button class="to__do__input__radio task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}">&#10004</button>
                        <button class="to__do__input__radio task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year} to__do__input__cansel">&#10006</button>
                        <input type="text" class="to__do__input task__day__${dayX.innerText}__${month_mas[month - 1]}__${year}"> 
                    </li>`);
                    //ДОРАБОТАТЬ,ЧТОБЫ КАЖДЫЙ radiobutton БЫЛ КАК ОТДЕЛЬНОЕ ЦЕЛОЕ(ОТМЕТКА ВЫПОЛНЕНО ИЛИ НЕТ ЗАДАНИЕ ДНЯ)
                    document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).addEventListener('click', function () {
                        document.querySelector(`.task__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.textDecoration = 'line-through';
                        document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.background = 'black';
                        document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.boxShadow = '0 0 2px 2px floralwhite';
                        document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.color = 'floralwhite';
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).classList.remove('to__do__input__cansel');
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.background = '';
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.boxShadow = '';
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.color = '';
                    });
                    document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).addEventListener('click', function () {
                        document.querySelector(`.task__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.textDecoration = 'none';
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.background = 'black';
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.boxShadow = '0 0 2px 2px floralwhite';
                        document.querySelector(`.task__radio2__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.color = 'floralwhite';
                        document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.background = '';
                        document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.boxShadow = '';
                        document.querySelector(`.task__radio1__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.color = '';
                    });
                }
            };
            //Удаление
            document.querySelector('.to__do__delete').onclick = () => {
                let myLastInput;
                for (let child in document.querySelector(`.ul__${dayX.innerText}__${month_mas[month - 1]}__${year}`).children) {
                    myLastInput = child;
                }
                if (myLastInput.classList.contains('.to__do__delete') && document.querySelectorAll(`.li__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).length > 0) {
                    myLastInput.remove();
                }
                if (document.querySelectorAll(`.li__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).length === 0) {
                    document.querySelector(`.day__${dayX.innerText}__${month_mas[month - 1]}__${year}`).classList.remove('withInfo');
                    localStorage.removeItem(`td__day__${dayX.innerText}__${month_mas[month - 1]}__${year}`);
                    document.querySelector(`.btn__delete__${dayX.innerText}__${month_mas[month - 1]}__${year}`).style.display = 'none';
                }
            };
        };
    });
};
tapToDoList();
//Обводим день,если есть дела To Do
let markToDoDays = () => {
    for (let i = 0; i < localStorage.length; i++) {
        let myMasWithKeys = localStorage.getItem(localStorage.key(i)).split(',');
        if (month == +myMasWithKeys[1] && year == +myMasWithKeys[2] && document.querySelector('#ON').checked === true && document.querySelector(`.day__${myMasWithKeys[0]}__${month_mas[month - 1]}__${year}`)) {
            document.querySelector(`.main__day__${myMasWithKeys[0]}`).style.boxShadow = 'inset 0 0 17px 4px black';
            document.querySelector(`.main__day__${myMasWithKeys[0]}`).style.color = 'white';
        }
        else if (document.querySelector('#ON').checked === false) {
            return;
        }
    }
};
//Работа с погодой
let cur__city = 'Mogilev';
let url__weather = `https://api.openweathermap.org/data/2.5/forecast?q=${cur__city}&appid=df7de813ed047bccc7578b4b0cd34470&units=metric`;
//При нажатии на город показывает инпут куда вводим город
document.querySelector('.weather__city__name').onclick = () => {
    document.querySelector('.weather__city__name').style.display = 'none';
    document.querySelector('.weather__city__input').style.display = 'unset';
};
//Таймер на ввод названия города
let timer = null;
document.querySelector('.weather__city__input').addEventListener('input', function (e) {
    clearTimeout(timer);
    timer = setTimeout(function () {
        let x = (e.target).value;
        cur__city = x;
        url__weather = `https://api.openweathermap.org/data/2.5/forecast?q=${cur__city}&appid=df7de813ed047bccc7578b4b0cd34470&units=metric`;
        document.querySelector('.weather__city__name').style.display = 'unset';
        document.querySelector('.weather__city__input').style.display = 'none';
        //Если ввели то,на что не делает запрос,то очищает input и оставляет предыдущие параметры
        if (url__weather) {
            document.querySelector('.weather__city__input').value = '';
        }
        //Запрос fetch после изменения города
        fetch(url__weather)
            .then(response => response.json())
            .then(json => {
            let averageTemp1 = 0;
            let averageTemp2 = 0;
            let averageTemp3 = 0;
            let averageTemp4 = 0;
            //Перебираем list
            for (let jsonKey in json.list) {
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
            document.querySelector('.temp__today').innerText = `${Math.round(json.list[0].main.temp)} C`;
            document.querySelector('.weather__img').src = `http://openweathermap.org/img/w/${json.list[0].weather[0].icon}.png`;
            document.querySelector('.weather__city__name').innerText = `${cur__city}`;
            document.querySelector('.t1').innerText = `${+day + 1}th:${Math.round(averageTemp1 - 1)}..${Math.round(averageTemp1 + 1)}C`;
            document.querySelector('.t2').innerText = `${+day + 2}th:${Math.round(averageTemp2 - 1)}..${Math.round(averageTemp2 + 1)}C`;
            document.querySelector('.t3').innerText = `${+day + 3}th:${Math.round(averageTemp3 - 1)}..${Math.round(averageTemp3 + 1)}C`;
            document.querySelector('.t4').innerText = `${+day + 4}th:${Math.round(averageTemp4 - 1)}..${Math.round(averageTemp4 + 1)}C`;
        });
    }, 1200);
});
//Запрос fetch до изменения города на мой город Могилёв(по умолчанию)
fetch(url__weather)
    .then(response => response.json())
    .then(json => {
    let averageTemp1 = 0;
    let averageTemp2 = 0;
    let averageTemp3 = 0;
    let averageTemp4 = 0;
    //Перебираем list
    for (let jsonKey in json.list) {
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
    document.querySelector('.temp__today').innerText = `${Math.round(json.list[0].main.temp)} C`;
    document.querySelector('.weather__img').src = `http://openweathermap.org/img/w/${json.list[0].weather[0].icon}.png`;
    document.querySelector('.weather__city__name').innerText = `${cur__city}`;
    document.querySelector('.t1').innerText = `${+day + 1}th:${Math.round(averageTemp1 - 1)}..${Math.round(averageTemp1 + 1)}C`;
    document.querySelector('.t2').innerText = `${+day + 2}th:${Math.round(averageTemp2 - 1)}..${Math.round(averageTemp2 + 1)}C`;
    document.querySelector('.t3').innerText = `${+day + 3}th:${Math.round(averageTemp3 - 1)}..${Math.round(averageTemp3 + 1)}C`;
    document.querySelector('.t4').innerText = `${+day + 4}th:${Math.round(averageTemp4 - 1)}..${Math.round(averageTemp4 + 1)}C`;
});
console.log(cur_month);
