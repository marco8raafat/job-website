from django.shortcuts import render
# views.py
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from .models import User
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import check_password

def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):  # Verify hashed password
                return JsonResponse({
                    'success': True,
                    'usertype': user.usertype,
                    'username': user.username
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid password'
                })
        except User.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'User does not exist'
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })
def register(request):
    if request.method == 'POST':
        errors = {}
        
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        usertype = request.POST.get('usertype')
        
        # Validate username uniqueness
        if User.objects.filter(username=username).exists():
            errors['username'] = 'Username already taken'
        
        # Validate email uniqueness
        if User.objects.filter(email=email).exists():
            errors['email'] = 'Email already registered'
        
        if errors:
            return JsonResponse({'success': False, 'errors': errors})
        
        try:
            # Create the user
            user = User.objects.create(
                username=username,
                password=make_password(password),  # Hash the password
                email=email,
                usertype=usertype
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'errors': {'__all__': str(e)}})
    
    return JsonResponse({'success': False, 'errors': {'__all__': 'Invalid request method'}})

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

def signup_user_dashboard(request):
    return render(request, 'pages/signup/user-dashboard.html')

def login_user_dashboard(request):
    return render(request, 'pages/login/user-dashboard.html')

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

