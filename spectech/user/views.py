from django.shortcuts import render

# Create your views here.
def user_home(request):
    return render(request, 'main/index.html')

def catalog_user(request):
    return render(request, 'user/catalog_user.html')

def create_ad(request):
    return render(request, 'user/сreate_ad.html')