from django.shortcuts import render
# views.py
# views.py (add this function)
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from .models import User
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from .models import Job
from django.views.decorators.http import require_http_methods
import json
from .models import Application

# views.py
@csrf_exempt
def create_job(request):
    if request.method == 'POST':
        try:
            print("Processing job creation request")
            print("POST data:", request.POST)
            
            # Get the username from the session
            username = request.session.get('username')
            
            if not username:
                return JsonResponse({
                    'success': False, 
                    'error': 'Authentication required. Please log in as a company.'
                })
            
            try:
                # Find the company user
                company_user = User.objects.get(username=username, usertype='option2')
                print(f"Creating job for company user: {username}")
            except User.DoesNotExist:
                return JsonResponse({
                    'success': False, 
                    'error': 'User not found or not authorized to create jobs'
                })
            
            # Get form values with proper type conversion
            experience = request.POST.get('Experience', '0')
            try:
                experience = int(experience)
            except ValueError:
                experience = 0  # Default to 0 if conversion fails
                
            job = Job.objects.create(
                job_title=request.POST.get('title'),
                salary=request.POST.get('Salary'),
                company_name=request.POST.get('company name'),
                year_of_experience=experience,
                description=request.POST.get('description'),
                status=request.POST.get('status', 'open'),
                posted_by=company_user
            )
            # Print to console for debugging
            print(f"Job created: {job.id} - {job.job_title} by user {username}")
            return JsonResponse({'success': True, 'message': 'Job created successfully!'})
        except Exception as e:
            print(f"Error creating job: {str(e)}")
            import traceback
            traceback.print_exc()
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):  # Verify hashed password
                # Store user in session
                request.session['username'] = user.username
                request.session['usertype'] = user.usertype
                request.session['user_id'] = user.id
                
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
    if not request.session.get('username'):
        return render(request, 'pages/login.html')  # Redirect if not logged in
    
    try:
        user = User.objects.get(username=request.session['username'])
        
        # Get user's applications
        applications = Application.objects.filter(email=user.email).order_by('-appliedAt')[:5]  # Last 5 applications
        
        # Get saved jobs (if you have a SavedJob model)
        # saved_jobs = SavedJob.objects.filter(user=user)
        
        context = {
            'username': user.username,
            'applications': applications,
            'application_count': applications.count(),
            # 'saved_jobs': saved_jobs,
            # 'saved_jobs_count': saved_jobs.count(),
        }
        
        return render(request, 'pages/user-dashboard.html', context)
        
    except User.DoesNotExist:
        return render(request, 'pages/login.html')

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

@csrf_exempt
def get_jobs(request):
    """API endpoint to fetch jobs for a specific company user"""
    try:
        # Get the username from the session
        username = request.session.get('username')
        
        if username:
            try:
                # Find the company user
                company_user = User.objects.get(username=username, usertype='option2')
                
                # Get only the jobs posted by this company user
                jobs = Job.objects.filter(posted_by=company_user).order_by('-posted_date')
                
                print(f"Found {jobs.count()} jobs for company user: {username}")
            except User.DoesNotExist:
                # If user not found or not a company, return empty jobs
                print(f"User not found or not a company: {username}")
                jobs = Job.objects.none()
        else:
            # If no user in session, return empty jobs
            print("No user in session")
            jobs = Job.objects.none()
        
        # Serialize jobs to JSON
        jobs_data = []
        for job in jobs:
            jobs_data.append({
                'id': job.id,
                'job_title': job.job_title,
                'salary': job.salary,
                'company_name': job.company_name,
                'year_of_experience': job.year_of_experience,
                'description': job.description,
                'status': job.status,
                'posted_date': job.posted_date.strftime('%Y-%m-%d'),
                'posted_by': job.posted_by.username if job.posted_by else None,
            })
        
        return JsonResponse({'success': True, 'jobs': jobs_data})
    except Exception as e:
        print(f"Error fetching jobs: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_job(request, job_id):
    """API endpoint to delete a job"""
    try:
        # Get the username from the session
        username = request.session.get('username')
        
        if not username:
            return JsonResponse({'success': False, 'error': 'Authentication required'})
        
        try:
            # Find the company user
            company_user = User.objects.get(username=username, usertype='option2')
            
            # Try to get the job, ensuring it belongs to this company user
            job = Job.objects.get(id=job_id, posted_by=company_user)
            
            # Delete the job
            job.delete()
            print(f"Job {job_id} deleted by user {username}")
            return JsonResponse({'success': True})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found or not authorized'})
        except Job.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Job not found or you are not authorized to delete it'})
    except Exception as e:
        print(f"Error deleting job: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)})

# views.py
# views.py
def edit_job(request, job_id=None):
    # If job_id comes from URL path
    if job_id is not None:
        try:
            job = Job.objects.get(id=job_id)
            context = {'job': job}
            return render(request, 'pages/edit-job.html', context)
        except Job.DoesNotExist:
            return render(request, 'pages/404.html')
    
    # If job_id comes from query parameter (legacy support)
    job_id = request.GET.get('id')
    if job_id:
        try:
            job = Job.objects.get(id=job_id)
            context = {'job': job}
            return render(request, 'pages/edit-job.html', context)
        except Job.DoesNotExist:
            return render(request, 'pages/404.html')
    
    # No job_id provided
    return render(request, 'pages/404.html')
@csrf_exempt
def update_job(request, job_id):
    if request.method == 'POST':
        try:
            username = request.session.get('username')
            if not username:
                return JsonResponse({
                    'success': False, 
                    'error': 'Authentication required'
                })
            
            company_user = User.objects.get(username=username, usertype='option2')
            job = Job.objects.get(id=job_id, posted_by=company_user)
            
            # Update job fields
            job.job_title = request.POST.get('job-title')
            job.salary = request.POST.get('salary')
            job.year_of_experience = request.POST.get('experience')
            job.status = request.POST.get('job-status')
            job.description = request.POST.get('job-description')
            job.save()
            
            return JsonResponse({
                'success': True, 
                'message': 'Job updated successfully!'
            })
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'error': str(e)
            })
    return JsonResponse({
        'success': False, 
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
        return JsonResponse({
            'success': True,
            'job_title': job.job_title,
            'salary': job.salary,
            'company_name': job.company_name,
            'year_of_experience': job.year_of_experience,
            'status': job.status,
            'description': job.description,
            'posted_date': job.posted_date.strftime('%Y-%m-%d')
        })
    except Job.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Job not found'
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

@csrf_exempt
def get_all_jobs(request):
    """API endpoint to fetch all jobs for job seekers"""
    try:
        # Get query parameters
        experience = request.GET.get('experience')
        
        # Start with all open jobs
        jobs = Job.objects.filter(status='open')
        
        # Apply experience filter if provided
        if experience:
            try:
                exp_years = int(experience)
                jobs = jobs.filter(year_of_experience__lte=exp_years)
            except ValueError:
                pass
        
        # Order by posted date
        jobs = jobs.order_by('-posted_date')
        
        print(f"Found {jobs.count()} open jobs for job seekers")
        
        # Serialize jobs to JSON
        jobs_data = []
        for job in jobs:
            jobs_data.append({
                'id': job.id,
                'job_title': job.job_title,
                'salary': job.salary,
                'company_name': job.company_name,
                'year_of_experience': job.year_of_experience,
                'description': job.description,
                'status': job.status,
                'posted_date': job.posted_date.strftime('%Y-%m-%d'),
                'posted_by': job.posted_by.username if job.posted_by else None,
            })
        
        return JsonResponse({'success': True, 'jobs': jobs_data})
    except Exception as e:
        print(f"Error fetching jobs: {str(e)}")
        return JsonResponse({'success': False, 'error': str(e)})
    
@csrf_exempt
def submit_application(request):
    if request.method == 'POST':
        try:
            # Check if user is logged in
            if not request.session.get('username'):
                return JsonResponse({
                    'success': False,
                    'error': 'Please log in to apply for jobs'
                })
            
            # Get the user
            user = User.objects.get(username=request.session['username'])
            
            # Get the job
            job_id = request.POST.get('job_id')
            try:
                job = Job.objects.get(id=job_id)
            except Job.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Job not found'
                })
            
            # Check if user already applied
            if Application.objects.filter(job=job, email=user.email).exists():
                return JsonResponse({
                    'success': False,
                    'error': 'You have already applied for this job'
                })
            
            # Handle CV file upload
            cv_file = request.FILES.get('cv')
            if not cv_file:
                return JsonResponse({
                    'success': False,
                    'error': 'Please upload your CV'
                })
            
            # Validate PDF file
            if not cv_file.name.lower().endswith('.pdf'):
                return JsonResponse({
                    'success': False,
                    'error': 'Please upload your CV in PDF format only'
                })
            
            # Create the application with CV file
            application = Application.objects.create(
                job=job,
                jobTitle=job.job_title,
                companyName=job.company_name,
                email=user.email,
                status="Pending Review",
                cv_file=cv_file  # This will automatically save the file in the cvs/ directory
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Application submitted successfully!'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })