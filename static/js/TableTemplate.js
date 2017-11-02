'use strict';

class TableTemplate {
    constructor() {

    }

    static fillIn(id, dict, columnName) {
        let rows = document.getElementById(id).childNodes[1].getElementsByTagName('TR');
        let countRows = rows.length;
        let header = rows[0];
        let headerCol = header.children;
        let countCol = headerCol.length;        
        let order = {};
        // Заменяем шапку таблицы
        for(let i=0; i<countCol; ++i) {
            order[headerCol[i].innerHTML.replace(new RegExp(/[{}]/ig), "")] = i;
            for(let key in dict) {
                headerCol[i].innerHTML = headerCol[i].innerHTML.replace(new RegExp("{{"+ key +"}}","g"), dict[key]);
            }
            // Поиск свойств, которые отсутствуют в словаре и замена их на пустые строки
            if(headerCol[i].innerHTML.match(new RegExp(/{{.*?}}/gi))) {
                headerCol[i].innerHTML = headerCol[i].innerHTML.replace(new RegExp(/{{.*?}}/gi), "");
            }
            // Проверка правильности оформления шаблока
            if (headerCol[i].innerHTML.search(/[{}]/i) !== -1) {
                console.log(id + " have invalid table template");
                return;
            }
        }
        // Заменяем остальные строки таблицы определенной колонки
        if(columnName !== undefined) {
            let index = order[columnName.replace(" ", "")];
            for(let i=1; i<countRows; ++i) {
                let col = rows[i].childNodes[index];
                for(let key in dict) {
                    col.innerHTML = col.innerHTML.replace(new RegExp("{{"+ key +"}}","g"), dict[key]);
                }
                // Поиск свойств, которые отсутствуют в словаре и замена их на пустые строки
                if(col.innerHTML.match(new RegExp(/{{.*?}}/gi))) {
                    col.innerHTML = col.innerHTML.replace(new RegExp(/{{.*?}}/gi), "");
                }
                // Проверка правильности оформления шаблока
                if (col.innerHTML.search(/[{}]/i) !== -1) {
                    console.log(id + " have invalid table template");
                    return;
                }            
            }
        } else {
            for(let i=1; i<countRows; ++i) {
                for(let l=0; l<countCol; ++l) {
                    let col = rows[i].childNodes[l];
                    for(let key in dict) {
                        col.innerHTML = col.innerHTML.replace(new RegExp("{{"+ key +"}}","g"), dict[key]);
                    }
                    // Поиск свойств, которые отсутствуют в словаре и замена их на пустые строки
                    if(col.innerHTML.match(new RegExp(/{{.*?}}/gi))) {
                        col.innerHTML = col.innerHTML.replace(new RegExp(/{{.*?}}/gi), "");
                    }
                    // Проверка правильности оформления шаблока
                    if (col.innerHTML.search(/[{}]/i) !== -1) {
                        console.log(id + " have invalid table template");
                        return;
                    }
                }
            }
        }
        document.getElementById(id).setAttribute('style', 'visibility:visible;');
    }
}