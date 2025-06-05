from django.urls import path
from .views import *

urlpatterns = [
    path('profit/', ProfitStatsView.as_view(), name='dashboard-profit' )
]