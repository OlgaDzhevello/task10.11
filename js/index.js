// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const minInput = document.querySelector('.minweight__input');   // минимум
const maxInput = document.querySelector('.maxweight__input');   // максимум
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
	{"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
	{"kind": "Дуриан", "color": "зеленый", "weight": 35},
	{"kind": "Личи", "color": "розово-красный", "weight": 17},
	{"kind": "Карамбола", "color": "желтый", "weight": 28},
	{"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22},
	{"kind": "Мангустин", "color": "фиолетовый", "weight": 23},
	{"kind": "Дуриан", "color": "зеленый", "weight": 45},
	{"kind": "Личи", "color": "розово-красный", "weight": 27},
	{"kind": "Карамбола", "color": "желтый", "weight": 98},
	{"kind": "Тамаринд", "color": "светло-коричневый", "weight": 32},
    {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
	{"kind": "Дуриан", "color": "зеленый", "weight": 35},
	{"kind": "Личи", "color": "розово-красный", "weight": 17},
	{"kind": "Карамбола", "color": "желтый", "weight": 28},
	{"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22},
	{"kind": "Мангустин", "color": "фиолетовый", "weight": 23},
	{"kind": "Дуриан", "color": "зеленый", "weight": 45},
	{"kind": "Личи", "color": "розово-красный", "weight": 27},
	{"kind": "Карамбола", "color": "желтый", "weight": 98}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
    fruitsList.innerHTML = '';                      // очищаем fruitsList от вложенных элементов
    for (let i = 0; i < fruits.length; i++) {
		fruitsList.appendChild(newLi(fruits[i], i));  // добавляем в конец списка fruitsList новый элемент li
	};
};

// новый элемент li
const newLi = (fruit, i = null) => {         

	const li = document.createElement("li");        // формируем новый элемент <li>

    let colorClass;                                 // определяем цвета li.className 
	switch (fruit.color) {
		case "фиолетовый":
			colorClass = 'fruit_violet';
			break;
		case "зеленый":
			colorClass = 'fruit_green';
			break;
		case "розово-красный":
			colorClass = 'fruit_carmazin';
			break;
		case "желтый":
			colorClass = 'fruit_yellow';
			break;
		case "светло-коричневый":
			colorClass = 'fruit_lightbrown';
			break;
		default:
			colorClass = 'fruit_black';
	};
	li.className = `fruit__item ${colorClass}`;

	let divInfo = `<div class="fruit__info"> <div>index: ${i}</div>`;   	// формируем начинку div fruit__info и его элементы
	for (var prop in fruit) {
		divInfo += `<div>${prop}: ${fruit[prop]}</div>`
	};
	divInfo += `</div>`;

	li.innerHTML = divInfo;     // заполняем li
	return li;
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
	let result = [];
    let sourse = fruits.slice(0);
    while (fruits.length > 0) {
        let i = getRandomInt(0,fruits.length-1);
        result.push(fruits[i]);
        fruits.splice(i,1);
	};
	fruits = result;

    if (JSON.stringify(fruits) === JSON.stringify(sourse)) {
        alert(`Упс... Ничего не изменилось((`);
    }
}; 

shuffleButton.addEventListener('click', () => {
	shuffleFruits();
	display();
});

/*** ФИЛЬТРАЦИЯ ***/

// поиск максимума методом forEach
let maxWeight = 0;
fruits.forEach(item => maxWeight < item.weight ? maxWeight = item.weight : maxWeight);
maxInput.value = maxWeight;

// поиск минимума методом reduce
let minWeight = fruits.reduce ((min, item) =>  min > item.weight ? item.weight : min, maxWeight);
minInput.value = minWeight;

// фильтрация массива
const filterFruits = (min=0, max=1000) => fruits.filter((item) => (item.weight >= min && item.weight <= max));

filterButton.addEventListener('click', () => {
	fruits = filterFruits(minInput.value, maxInput.value);
	display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => a.color > b.color ? true : false;

const sortAPI = {
	bubbleSort(arr, comparation) {
        const n = arr.length;
        // внешняя итерация по элементам
        for (let i = 0; i < n-1; i++) { 
            // внутренняя итерация для перестановки элемента в конец массива
            for (let j = 0; j < n-1-i; j++) { 
                // сравниваем элементы
                if (comparation(arr[j], arr[j+1])) { 
                    // делаем обмен элементов
                    let temp = arr[j+1]; 
                    arr[j+1] = arr[j]; 
                    arr[j] = temp; 
                }
            }
        }                    
	},

	quickSort(arr, comparation) {
        // функция обмена элементов
        function swap(arr, left, right){
            const temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
        }
        // функция разделитель
        function partition(arr, left, right) {
            var pivot = arr[Math.floor((right + left) / 2)],
                i = left,
                j = right;
            while (i <= j) {
                while (comparation(pivot, arr[i])) {
                    i++;
                }
                while (comparation(arr[j], pivot)) {
                    j--;
                }
                if (i <= j) {
                    swap(arr, i, j);
                    i++;
                    j--;
                }
            }
            return i;
        }
        
        // алгоритм быстрой сортировки
        function quickSort(arr, left, right) {
            var index;
            if (arr.length > 1) {
                left = typeof left != "number" ? 0 : left;
                right = typeof right != "number" ? arr.length - 1 : right;
                index = partition(arr, left, right);
                if (left < index - 1) {
                    quickSort(arr, left, index - 1);
                }
                if (index < right) {
                    quickSort(arr, index, right);
                }
            }
            return arr;
        }
	},

	// выполняет сортировку и производит замер времени
	startSort(sort, arr, comparation) {
		const start = new Date().getTime();
		sort(arr, comparation);
		const end = new Date().getTime();
		sortTime = `${end - start} ms`;
	},
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
    sortKind === 'bubbleSort' ? sortKind = 'quickSort' : sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
    sortTimeLabel.textContent = sortTime = '-';
});

sortActionButton.addEventListener('click', () => {
    sortTimeLabel.textContent = '0 ms';
	const sort = sortAPI[sortKind];
    console.log(sort);
	sortAPI.startSort(sort, fruits, comparationColor);
	display();
	// TODO: вывести в sortTimeLabel значение sortTime
    sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
	// TODO: создание и добавление нового фрукта в массив fruits
	// необходимые значения берем из kindInput, colorInput, weightInput
	display();
});
