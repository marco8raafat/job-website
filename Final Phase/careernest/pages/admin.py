from traceback import format_tb
from django.contrib import admin
from .models import User, Job, Application

# Custom Admin for User model
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'usertype')
    list_display_links = ('id', 'username')
    search_fields = ('username', 'email')
    list_filter = ('usertype',)
    ordering = ('id',)

# Custom Admin for Job model
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_title', 'company_name', 'salary', 'status', 'posted_date', 'posted_by')
    list_display_links = ('id', 'job_title')
    search_fields = ('job_title', 'company_name')
    list_filter = ('status', 'posted_date', 'company_name')
    raw_id_fields = ('posted_by',)  # Better for ForeignKey fields with many entries
    date_hierarchy = 'posted_date'
    ordering = ('-posted_date',)

# Custom Admin for Application model
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'jobTitle', 'companyName', 'email', 'status', 'appliedAt', 'cv_file')
    list_display_links = ('id', 'jobTitle')
    search_fields = ('jobTitle', 'companyName', 'email')
    list_filter = ('status', 'appliedAt')
    date_hierarchy = 'appliedAt'
    ordering = ('-appliedAt',)
    
    def cv_file_link(self, obj):
        if obj.cv_file:
            return format_tb("<a href='{url}' download>Download CV</a>", url=obj.cv_file.url)
        return "No CV"
    cv_file_link.short_description = 'CV File'

# Register your models with their admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(Application, ApplicationAdmin)