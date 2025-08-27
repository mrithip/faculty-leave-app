from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Generic login endpoint that returns user role along with tokens
    """
    print(f"Login request received for: {request.data.get('username')}")
    
    serializer = CustomTokenObtainPairSerializer(data=request.data)
    
    if serializer.is_valid():
        print("Login successful")
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    else:
        print("Login failed:", serializer.errors)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)