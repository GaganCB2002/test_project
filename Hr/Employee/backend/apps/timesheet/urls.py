from django.urls import path
from .views import (
    TimeSheetListView,
    TimeSheetCreateView,
    TimeSheetUpdateView,
    WeeklySummaryView,
    TodayTimeSheetView,
    CurrentWorkSessionView,
    StartBreakView,
    EndBreakView,
    TimeTrackingSummaryView,
)

urlpatterns = [
    path('', TimeSheetListView.as_view(), name='timesheet-list'),
    path('create/', TimeSheetCreateView.as_view(), name='timesheet-create'),
    path('<uuid:id>/', TimeSheetUpdateView.as_view(), name='timesheet-detail'),
    path('weekly-summary/', WeeklySummaryView.as_view(), name='weekly-summary'),
    path('today/', TodayTimeSheetView.as_view(), name='today-timesheet'),
    path('session/current/', CurrentWorkSessionView.as_view(), name='current-work-session'),
    path('session/start-break/', StartBreakView.as_view(), name='start-break'),
    path('session/end-break/', EndBreakView.as_view(), name='end-break'),
    path('summary/', TimeTrackingSummaryView.as_view(), name='time-summary'),
]
