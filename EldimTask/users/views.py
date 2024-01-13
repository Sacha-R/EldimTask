from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from users.models import User

# Create your views here.

def home(request):
    return JsonResponse({'message': 'Hello World!'})

def users_endpoint(request):
    users = User.objects.all()  # Query the User model
    users_list = list(users.values())  # Convert the query set to a list of dictionaries
    return JsonResponse(users_list, safe=False)  # Return the JSON response