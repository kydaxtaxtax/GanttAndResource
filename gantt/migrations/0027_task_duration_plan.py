# Generated by Django 4.1.7 on 2023-03-29 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gantt', '0026_alter_task_resourceon'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='duration_plan',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
