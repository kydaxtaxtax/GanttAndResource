# Generated by Django 4.1.7 on 2023-03-22 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gantt', '0012_alter_task_sort_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='type',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
