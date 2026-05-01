from django.urls import path
from .views import (
    AttendanceListView,
    LoginView,
    LogoutView,
    TodayAttendanceView,
    AttendanceStatsView,
    LeaveRequestListCreateView,
    LeaveBalanceView
)

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance-list'),
    path('login/', LoginView.as_view(), name='attendance-login'),
    path('logout/', LogoutView.as_view(), name='attendance-logout'),
    path('today/', TodayAttendanceView.as_view(), name='today-attendance'),
    path('stats/', AttendanceStatsView.as_view(), name='attendance-stats'),
    path('leaves/', LeaveRequestListCreateView.as_view(), name='leave-requests'),
    path('leaves/balance/', LeaveBalanceView.as_view(), name='leave-balance'),
]
