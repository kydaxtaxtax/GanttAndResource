# Generated by Django 4.1.7 on 2023-03-22 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gantt', '0019_task_resourceon'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='end_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
