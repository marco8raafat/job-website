from django.urls import path
from . import views
from .views import register
urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('forget-pass/', views.forget_pass, name='forget-pass'),
    path('user-dashboard/', views.user_dashboard, name='user-dashboard'),
    path('job-list/', views.job_list, name='job-list'),
    path('job-details/', views.job_details, name='job-details'),
    path('company-dashboard/', views.company_dashboard, name='company-dashboard'),
    path('company-jobs/', views.company_jobs, name='company-jobs'),
    path('add-job/', views.add_job, name='add-job'),
    path('edit-job/<int:job_id>/', views.edit_job, name='edit-job-with-id'),
    path('edit-job/', views.edit_job, name='edit-job'),
    path('register/', views.register, name='register'),
    path('api/login/', views.login_user, name='api-login'), # New API endpoint
    path('api/create-job/', views.create_job, name='create-job'),
    path('api/get-jobs/', views.get_jobs, name='get-jobs'),
    path('api/get-all-jobs/', views.get_all_jobs, name='get-all-jobs'),
    path('api/delete-job/<int:job_id>/', views.delete_job, name='delete-job'),
    path('api/get-job/<int:job_id>/', views.get_job, name='get-job'),
    path('api/update-job/<int:job_id>/', views.update_job, name='update_job'),
    path('api/submit-application/', views.submit_application, name='submit-application'),
]