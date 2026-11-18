/*формируем массив для сортировки по двум уровням вида 
  [
    {column: номер столбца, по которому осуществляется сортировка, 
     direction: порядок сортировки (true по убыванию, false по возрастанию)
    }, 
    ...
   ]
*/
const createSortArr = (data) => {
    let sortArr = [];
    
    const sortSelects = data.getElementsByTagName('select');
    
    for (const item of sortSelects) {   
       // получаем номер выбранной опции
        const keySort = item.value;
        // в случае, если выбрана опция Нет, заканчиваем формировать массив
        if (keySort == 0) {
            break;
        }
        // получаем порядок сортировки очередного уровня
        // имя флажка сформировано как имя поля SELECT и слова Desc
        const desc = document.getElementById(item.id + 'Desc').checked;
        // очередной элемент массива - по какому столбцу и в каком порядке сортировать 
        sortArr.push(
          {column: keySort - 1, 
           direction: desc}
        );
    }
    return sortArr; 
};

const sortTable = (idTable, formData) => {
    
    // формируем управляющий массив для сортировки
    const sortArr = createSortArr(formData);
    
    // сортировать таблицу не нужно, во всех полях выбрана опция Нет
    if (sortArr.length === 0) {
        const filterForm = document.getElementById('filter'); //1
        filterTable(buildings, idTable, filterForm);
        return; 
    }
    //находим нужную таблицу
    let table = document.getElementById(idTable);

    // преобразуем строки таблицы в массив 
    let rowData = Array.from(table.rows);
    
    // удаляем элемент с заголовками таблицы
     const headerRow = rowData.shift();
    
    //сортируем данные по всем уровням сортировки
    rowData.sort((first, second) => {
        for (let { column, direction } of sortArr) {
           const firstCell = first.cells[column].innerHTML;
           const secondCell = second.cells[column].innerHTML;

           // используем localeCompare для корректного сравнения
           let comparison;

           //2
           if (!isNaN(firstCell) && !isNaN(secondCell)) {
               comparison = Number(firstCell) - Number(secondCell);
           } else {
               comparison = firstCell.localeCompare(secondCell);
           }
		      
           // учитываем направление сортировки
           if (comparison !== 0) {
             return (direction ? -comparison : comparison);
          }
        }
        return 0; 
    });
    
    //выводим отсортированную таблицу на страницу
    table.append(headerRow);
	
	let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
	table.append(tbody);
}

const resetSort = (idTable, sortForm) => {
    sortForm.reset();
    const secondSelect = document.getElementById('fieldsSecond');
    if (secondSelect) {
        secondSelect.disabled = true;
    }
    const filterForm = document.getElementById('filter');
    filterTable(buildings, idTable, filterForm);
};