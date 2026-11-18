const correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
}

/* Структура возвращаемого ассоциативного массива:
{
    input_id: input_value,
    ...
}
*/
const dataFilter = (dataForm) => {

    let dictFilter = {};
    // перебираем все элементы формы с фильтрами
    for (const item of dataForm.elements) {    
        // получаем значение элемента
        let valInput = item.value;
        // если поле типа text - приводим его значение к нижнему регистру
        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        } 
        /* САМОСТОЯТЕЛЬНО обработать значения числовых полей:
        - если в поле занесено значение - преобразовать valInput к числу;
        - если поле пусто и его id включает From  - занести в valInput 
           -бесконечность
        - если поле пусто и его id включает To  - занести в valInput 
           +бесконечность
        */
        if (item.type === "number") {
            valInput = Number(valInput);
        }
        if (item.value === "" && item.id.includes("From")){
            valInput = -Infinity;
        }
        if (item.value === "" && item.id.includes("To")){
            valInput = +Infinity;
        }
         // формируем очередной элемент ассоциативного массива
        dictFilter[item.id] = valInput;
    }       
    return dictFilter;
}

// фильтрация таблицы
const filterTable = (data, idTable, dataForm) =>{   
    // получаем данные из полей формы
    const datafilter = dataFilter(dataForm);   
    // выбираем данные соответствующие фильтру и формируем таблицу из них
    let tableFilter = data.filter(item => {

        /* в этой переменной будут "накапливаться" результаты сравнения данных
           с параметрами фильтра */
        let result = true;
        
        // строка соответствует фильтру, если сравнение всех значения из input 
        // со значением ячейки очередной строки - истина
        Object.entries(item).map(([key, val]) => {
            
            // текстовые поля проверяем на вхождение
            if (typeof val == 'string') {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]]) 
            }
			
            // САМОСТОЯТЕЛЬНО проверить числовые поля на принадлежность интервалу

            if (Array.isArray(correspond[key])) {
                let min = datafilter[correspond[key][0]];
                let max = datafilter[correspond[key][1]];
                
                result &&= (val >= min && val <= max);
            }
        });

        return result;
    });     
    if (tableFilter.length === 0) {
        clearTable(idTable);
        createTable([], idTable); 
    }
    clearTable(idTable);
    createTable(tableFilter, idTable);  
}

const clearFilter = (idTable, data, dataForm) => {
    dataForm.reset();
    clearTable(idTable);
    createTable(data, idTable);
    const sortForm = document.getElementById('sort');
    if (typeof resetSort === 'function' && sortForm) {
        resetSort(idTable, sortForm);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    const filterForm = document.querySelector('form');
    const idTable = "list";
    const data = buildings; 
    
    const btnSearch = document.querySelector('input[value="Найти"]');
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            filterTable(data, idTable, filterForm);
        });
    }

    const btnClear = document.querySelector('input[value="Очистить фильтры"]');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            clearFilter(idTable, data, filterForm);
        });
    }
});