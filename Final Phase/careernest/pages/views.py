from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'pages/index.html')

def login(request):
    return render(request, 'pages/login.html')

def signup(request):
    return render(request, 'pages/signUp.html')

def forget_pass(request):
    return render(request, 'pages/forget-pass.html')

def user_dashboard(request):
    return render(request, 'pages/user-dashboard.html')

def job_list(request):
    return render(request, 'pages/job-list.html')

def job_details(request):
    return render(request, 'pages/job-details.html')

def company_dashboard(request): 
    return render(request, 'pages/company-dashboard.html')

def company_jobs(request):
    return render(request, 'pages/company-jobs.html')

def add_job(request):   
    return render(request, 'pages/add-job.html')

def edit_job(request):   
    return render(request, 'pages/edit-job.html')