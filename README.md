### Начало работы:<br>


1. Выбор деректории для создания проекта:<br>
   `cd Documents`<br>

2. Клонируем проект в выбранную деректорию:<br>
   `git clone https://github.com/kydaxtaxtax/GanttAndResource.git ganttAndResource`<br>

3. Открываем проект(желательно в `PyCharm`)<br>
4. Устанавливаем `Python` (на windows нужно перезагрузить систему после установки)<br>
5. Устанавливаем зависимости<br>
 `pip install -r requirements.txt`<br>

6. Запускаем миграции:<br>
   `python manage.py migrate` <br>
   
7. Подключаемся к БД (запускаем файл db.sqlite3)<br>

8. Запускаем файл `test_tasks.sql` для наполнения БД<br>

9. Запускаем проект:<br>
   `python manage.py runserver`
