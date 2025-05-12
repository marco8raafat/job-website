from django.db import models

class User(models.Model):
    USER_TYPE_CHOICES = [
        ('option1', 'User'),
        ('option2', 'Company'),
    ]
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(unique=True)
    usertype = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)

    def __str__(self):
        return self.username

class Job(models.Model):
    job_title = models.CharField(max_length=255)
    salary = models.CharField(max_length=50)
    company_name = models.CharField(max_length=255)
    year_of_experience = models.PositiveIntegerField()
    description = models.TextField()
    status = models.CharField(max_length=50)
    posted_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    jobTitle = models.CharField(max_length=255)
    companyName = models.CharField(max_length=255)
    email = models.EmailField()
    appliedAt = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="Pending Review")

    def __str__(self):
        return f"{self.email} applied to {self.jobTitle}"