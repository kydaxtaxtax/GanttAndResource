# GanttAndResource

1. Выбор деректории для создания проекта:
  cd Documents/

2. Клонирование проекта:
git clone https://github.com/kydaxtaxtax/GanttAndResource.git ganttAndResource

3. Откруываем проект(желательно в в pyCharm)

4. Запускаем: 
5. python manage.py runserver






Комменты
echo "from django.shortcuts import render def index(request):return render(request, 'gantt/index.html')" >> gantt/views.py
printf '%s\n' '1,$d' '0a' 'from django.urls import include, re_path' 'from django.contrib import admin' '' 'urlpatterns = [' "re_path(r'', include('gantt.urls'))," ']' '.' 'wq' | ed -s gantt_rest_python/urls.py
sed -i '' '1i\import os\' gantt_rest_python/settings.py
sed -i '' "s/'DIRS': \[\],/'DIRS': \[os.path.join(BASE_DIR, 'gantt\/templates')\],/" gantt_rest_python/settings.py
echo "STATICFILES_DIRS = [os.path.join(BASE_DIR, \"gantt/static\")]" >> gantt_rest_python/settings.py

