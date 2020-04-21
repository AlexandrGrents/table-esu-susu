## Таблица оценок для edu.susu.ru


### Для добавления таблицы на сайт требуется:
##### 1. Редактировать требуемый раздел
![Шаг 1.1. Редактировать курс](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st1.png "Редактировать курс")
![Шаг 1.2. Редактировать раздел](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st2.png "Редактировать раздел")
![Шаг 1.3. Редактировать описание раздела](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st3.png "Редактировать описание раздела")
##### 2. Скопировать [данный код](https://github.com/AlexandrGrents/table-esu-susu/blob/master/for%20copy.hrml) и вставить в требуемое место
![Шаг 2.1. Выбрать место для добавления](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st4.png "Выбрать место для добавления")
![Шаг 2.2. Добавить таблицу](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st5.png "Добавить таблицу")
##### 3. Поменять id на id курса 
![Шаг 3. Поменять id](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st6.png)
##### 4. Поменять название колонок, если потребуется
![Шаг 4. Поменять название колонок](https://github.com/AlexandrGrents/table-esu-susu/blob/master/images/st7.png)
##### 5. Поменять параметры (подробнее [тут](#params)), если это требуется
##### 6 Сохранить

## Параметры

`var show = true;` отвечает за отображение таблицы. Если выставлено false, то таблица не отображается

`var taboo = ["экзамен","Промежуточная"];` требуется для скрытия некоторых категорий или заданий. Если слово (независимо от регистра) из массива присутсвует в названии категории или задания, то оно **не добавляется в таблицу** и **не учитывается при расчёте баллов**.

<span name = "params"></span>

`var byzero = ["аттестация"];` требуется для неучитывания в оценках некоторых категорий или заданий. Если слово (независимо от регистра) из массива присутсвует в названии категории или задания, то оно **добавляется в таблицу**, но **не учитывается при расчёте баллов**.

`var frozenmax = ["дополнительные баллы"];` требуется для учитывания категорий, для которых нет пересчёта в итоговые баллы. Если слово (независимо от регистра) из массива присутсвует в названии категории, то **при расчёте баллов за категорию не учитывается соотношение суммы баллов к сумме максимумов всех заданий категории**. Например, если за категорию за все задания можно получить 20 баллов, по БРС определено максимум 15, а слушатель получил 17 баллов, то он получит 15 баллов за эту категорию.

`var convert = {	"Итого в категории":"Total in",}` требуется для изменения названия категории или задания на другое словосочетание. Меняет выражение слева от двоеточие на выражение справа. Меняет только точные совпадения, **зависит от регистра**.

`var type = "exam";` тип контрольного мероприятия: экзамен (*"exam"*) или зачёт (*"test"*)

Настройка цветов

<span name = "type"></span>
```
var colors = {
		"category-title":"#d6fffe",
		"category-result":"#ccffcc",
		"final":
		[
			"#ffa1a1",
			"#faee96",
			"#d9fa96",
			"#9cfa89"
		],
		"practic":
		["#ffffff","#e5e5e5"],
	};
```
Подробнее:
`"category-title":"#d6fffe",` - настройка цвета фона названия категории;

`"category-result":"#ccffcc",` - настройка цвета фона итогов категории;

`"final": ["#ffa1a1", "#faee96",	"#d9fa96",	"#9cfa89"],` - настройка цвета для итоговой оценки. Если экзамен, то используется по порядку для оценки 2, 3, 4, 5. Если зачёт, то используется только первый (для оценки "не зачёт") и последний (для оценки "зачёт");

`"practic":		["#ffffff","#e5e5e5"],` - настройка цвета для строк с заданиями. По умолчанию чередуется белый и серый.

Цвет можно выбрать [тут](https://htmlcolorcodes.com/color-picker/).


Комментарии для оценок
```
if (type == "exam")
	{
		brs = 
		{"(Неудовл.)":65,
		"(Удовл.)":75,
		"(Хор.)":85,
		"(Отл.)":200}
	}
	else
	{
		brs = 
		{"(Не зачёт)":60,
		"(Зачёт)":200};
	}
```
В зависимости от типа, выбранного [тут](#type), выбирается комментарий и цвет для набранного количества баллов. Указывается максимальная граница оценки, сравнение строкое (знак ).

<hr>

Подсчёт оценок производится по следующей формуле:

###### Оценка за категорию
    category_grade[i] = sum (for practic in category[i]) * category_max / sum(for practics_max in category[i])
    или (*) category_grade[i] = min (sum (for practic in category[i]), category_max)
###### Оценка за курс
    grade = sum (for category_grade[i] in categories) + stuff_category_grade

, где

    for practicin category[i] - все задания в определённой категории, которые не содержаться в массивах byzero и taboo
    (*) - расчёт категории из массива frozenmax
    category_max - максимум, который можно получить за категорию (конец диапазона в оценках)
    sum(for practics_max in category[i]) - сумма максимумов за каждое задание 
    stuff_category_grade - сумма всех заданий, для которых нет категорий, но они не содержкаться в массивах byzero и taboo
    
<hr>


###### [Исходный код](https://github.com/AlexandrGrents/table-esu-susu/blob/master/script.js)
По умолчанию код получается с [данной](https://raw.githack.com/AlexandrGrents/table-esu-susu/master/script.js) страницы
###### [Пример использования](https://github.com/AlexandrGrents/table-esu-susu/blob/master/example.html)
###### [Пример сгенерированной таблицы](https://github.com/AlexandrGrents/table-esu-susu/blob/master/example.md)

[Александр Гренц](mailto:alx.grents@gmail.com)
