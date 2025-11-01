from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.user_home, name='home_user'),
    path('catalog_user', views.catalog_user, name='catalog_user'),
    path('create_ad', views.create_ad, name='create_ad')
]