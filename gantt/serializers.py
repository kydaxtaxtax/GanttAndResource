from .models import Task
from .models import Link
from rest_framework import serializers

class TaskSerializer(serializers.ModelSerializer):
    start_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    end_date = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    planned_start = serializers.DateTimeField(format='%Y-%m-%d %H:%M')
    planned_end = serializers.DateTimeField(format='%Y-%m-%d %H:%M')

    class Meta:
        model = Task
        fields = ('id', 'parent', 'text', 'start_date', 'end_date', 'duration',
                  'planned_start', 'planned_end', 'duration_plan', 'progress',
                  'type', 'render', 'capacity', 'resources', 'ob_fact', 'ob_plan',
                  'open', 'sort_order')

class LinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = Link
        fields = ('id', 'source', 'target', 'type', 'lag')
