# Generated by Django 4.1.7 on 2023-03-30 09:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gantt', '0028_rename_resourceon_task_resource'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='resource',
            new_name='resources',
        ),
    ]
