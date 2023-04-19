from django.db import models


class Task(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    parent = models.CharField(null=True, blank=True, max_length=100)
    text = models.CharField(blank=True, max_length=100)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    planned_start = models.DateTimeField(null=True, blank=True)
    planned_end = models.DateTimeField(null=True, blank=True)
    duration_plan = models.IntegerField(null=True, blank=True)
    progress = models.FloatField(null=True, blank=True)
    type = models.CharField(null=True, blank=True, max_length=20, default="project")
    render = models.CharField(null=True, blank=True, max_length=20)
    capacity = models.JSONField(null=True, blank=True, default=[])
    resources = models.JSONField(null=True, blank=True, default=[])
    ob_fact = models.FloatField(null=True, blank=True)
    ob_plan = models.FloatField(null=True, blank=True)
    open = models.BooleanField(null=True, blank=True, default=1)
    sort_order = models.IntegerField(null=True, blank=True)


class Link(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    source = models.CharField(max_length=100)
    target = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    lag = models.IntegerField(blank=True, default=0)

