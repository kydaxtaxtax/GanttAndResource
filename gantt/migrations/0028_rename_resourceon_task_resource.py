# Generated by Django 4.1.7 on 2023-03-30 09:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gantt', '0027_task_duration_plan'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='resourceOn',
            new_name='resource',
        ),
    ]
