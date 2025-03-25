# from .models import StripeModel, BillingAddress, OrderModel
# from django.http import Http404
# from rest_framework import status
# from rest_framework.views import APIView
# from django.contrib.auth.models import User
# from rest_framework.response import Response
# from django.contrib.auth.hashers import make_password
# from rest_framework import authentication, permissions
# from rest_framework.decorators import permission_classes
# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
# from rest_framework_simplejwt.views import TokenObtainPairView # for login page
# from django.contrib.auth.hashers import check_password
# from django.shortcuts import get_object_or_404
# from .serializers import (
#     UserSerializer, 
#     UserRegisterTokenSerializer, 
#     CardsListSerializer, 
#     BillingAddressSerializer,
#     AllOrdersListSerializer
# )


# # register user
# class UserRegisterView(APIView):
#     """To Register the User"""

#     def post(self, request, format=None):
#         data = request.data # holds username and password (in dictionary)
#         username = data["username"]
#         email = data["email"]

#         if username == "" or email == "":
#             return Response({"detial": "username or email cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

#         else:
#             check_username = User.objects.filter(username=username).count()
#             check_email =  User.objects.filter(email=email).count()

#             if check_username:
#                 message = "A user with that username already exist!"
#                 return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
#             if check_email:
#                 message = "A user with that email address already exist!"
#                 return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
#             else:
#                 user = User.objects.create(
#                     username=username,
#                     email=email,
#                     password=make_password(data["password"]),
#                 )
#                 serializer = UserRegisterTokenSerializer(user, many=False)
#                 return Response(serializer.data)

# # login user (customizing it so that we can see fields like username, email etc as a response 
# # from server, otherwise it will only provide access and refresh token)
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
#     def validate(self, attrs):
#         data = super().validate(attrs)

#         serializer = UserRegisterTokenSerializer(self.user).data

#         for k, v in serializer.items():
#             data[k] = v
        
#         return data

# class MyTokenObtainPairView(TokenObtainPairView):
#     serializer_class = MyTokenObtainPairSerializer


# # list all the cards (of currently logged in user only)
# class CardsListView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         # show stripe cards of only that user which is equivalent 
#         #to currently logged in user
#         stripeCards = StripeModel.objects.filter(user=request.user)
#         serializer = CardsListSerializer(stripeCards, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# # get user details
# class UserAccountDetailsView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request, pk):
#         try:
#             user = User.objects.get(id=pk)
#             serializer = UserSerializer(user, many=False)
#             return Response(serializer.data, status=status.HTTP_200_OK)
            
#         except:
#             return Response({"details": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# # update user account
# class UserAccountUpdateView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def put(self, request, pk):
#         user = User.objects.get(id=pk)
#         data = request.data

#         if user:
#             if request.user.id == user.id:
#                 user.username = data["username"]
#                 user.email = data["email"]

#                 if data["password"] != "":
#                     user.password = make_password(data["password"])

#                 user.save()
#                 serializer = UserSerializer(user, many=False)
#                 message = {"details": "User Successfully Updated.", "user": serializer.data}
#                 return Response(message, status=status.HTTP_200_OK)
#             else:
#                 return Response({"details": "Permission Denied."}, status.status.HTTP_403_FORBIDDEN)
#         else:
#             return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# # delete user account
# class UserAccountDeleteView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request, pk):

#         try:
#             user = User.objects.get(id=pk)
#             data = request.data

#             if request.user.id == user.id:
#                 if check_password(data["password"], user.password):
#                     user.delete()
#                     return Response({"details": "User successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
#                 else:
#                     return Response({"details": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 return Response({"details": "Permission Denied."}, status=status.HTTP_403_FORBIDDEN)
#         except:
#             return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# # get billing address (details of user address, all addresses)
# class UserAddressesListView(APIView):

#     def get(self, request):
#         user = request.user
#         user_address = BillingAddress.objects.filter(user=user)
#         serializer = BillingAddressSerializer(user_address, many=True)
        
#         return Response(serializer.data, status=status.HTTP_200_OK)


# # get specific address only
# class UserAddressDetailsView(APIView):

#     def get(self, request, pk):
#         user_address = BillingAddress.objects.get(id=pk)
#         serializer = BillingAddressSerializer(user_address, many=False)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# # create billing address
# class CreateUserAddressView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def post(self, request):
#         data = request.data
        
#         new_address = {
#             "name": request.data["name"],
#             "user": request.user.id,
#             "phone_number": request.data["phone_number"],
#             "pin_code": request.data["pin_code"],
#             "house_no": request.data["house_no"],
#             "landmark": request.data["landmark"],
#             "city": request.data["city"],
#             "state": request.data["state"],
#         }

#         serializer = BillingAddressSerializer(data=new_address, many=False)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # edit billing address
# class UpdateUserAddressView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def put(self, request, pk):
#         data = request.data

#         try:
#             user_address = BillingAddress.objects.get(id=pk)

#             if request.user.id == user_address.user.id:

#                 updated_address = {
#                     "name": data["name"] if data["name"] else user_address.name,
#                     "user": request.user.id,
#                     "phone_number": data["phone_number"] if data["phone_number"] else user_address.phone_number,
#                     "pin_code": data["pin_code"] if data["pin_code"] else user_address.pin_code,
#                     "house_no": data["house_no"] if data["house_no"] else user_address.house_no,
#                     "landmark": data["landmark"] if data["landmark"] else user_address.landmark,
#                     "city": data["city"] if data["city"] else user_address.city,
#                     "state": data["state"] if data["state"] else user_address.state,
#                 }

#                 serializer = BillingAddressSerializer(user_address, data=updated_address)
#                 if serializer.is_valid():
#                     serializer.save()
#                     return Response(serializer.data, status=status.HTTP_200_OK)
#                 else:
#                     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#             else:
#                 return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
#         except:
#             return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)


# # delete address
# class DeleteUserAddressView(APIView):

#     def delete(self, request, pk):
        
#         try:
#             user_address = BillingAddress.objects.get(id=pk)

#             if request.user.id == user_address.user.id:
#                 user_address.delete()
#                 return Response({"details": "Address successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
#             else:
#                 return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
#         except:
#             return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)


# # all orders list
# class OrdersListView(APIView):

#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):

#         user_staff_status = request.user.is_staff
        
#         if user_staff_status:
#             all_users_orders = OrderModel.objects.all()
#             serializer = AllOrdersListSerializer(all_users_orders, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         else:
#             all_orders = OrderModel.objects.filter(user=request.user)
#             serializer = AllOrdersListSerializer(all_orders, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)

# # change order delivered status
# class ChangeOrderStatus(APIView):

#     permission_classes = [permissions.IsAdminUser]

#     def put(self, request, pk):
#         data = request.data       
#         order = OrderModel.objects.get(id=pk)

#         # only update this
#         order.is_delivered = data["is_delivered"]
#         order.delivered_at = data["delivered_at"]
#         order.save()
        
        
#         serializer = AllOrdersListSerializer(order, many=False)
#         return Response(serializer.data, status=status.HTTP_200_OK)


from .models import StripeModel, BillingAddress, OrderModel
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework_simplejwt.views import TokenObtainPairView # for login page
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from .serializers import (
    UserSerializer, 
    UserRegisterTokenSerializer, 
    CardsListSerializer, 
    BillingAddressSerializer,
    AllOrdersListSerializer
)

# Register user
class UserRegisterView(APIView):
    """To Register the User"""

    def post(self, request, format=None):
        data = request.data # Extracts data from the request
        username = data["username"]
        email = data["email"]

        # Check if username or email is empty
        if username == "" or email == "":
            return Response({"detail": "username or email cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            # Check if the username already exists
            check_username = User.objects.filter(username=username).count()
            # Check if the email already exists
            check_email = User.objects.filter(email=email).count()

            if check_username:
                message = "A user with that username already exists!"
                return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
            if check_email:
                message = "A user with that email address already exists!"
                return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
            else:
                # Create a new user
                user = User.objects.create(
                    username=username,
                    email=email,
                    password=make_password(data["password"]), # Encrypt the password
                )
                # Serialize user data
                serializer = UserRegisterTokenSerializer(user, many=False)
                return Response(serializer.data) # Return user data

# Customizing the JWT token serializer to include user details
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs) # Get default token data

        # Include additional user details
        serializer = UserRegisterTokenSerializer(self.user).data
        for k, v in serializer.items():
            data[k] = v
        
        return data

# Customizing the JWT token view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# List all cards for the currently logged-in user
class CardsListView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def get(self, request):
        # Filter Stripe cards associated with the currently logged-in user
        stripeCards = StripeModel.objects.filter(user=request.user)
        serializer = CardsListSerializer(stripeCards, many=True) # Serialize data
        return Response(serializer.data, status=status.HTTP_200_OK)

# Get details of a specific user
class UserAccountDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk) # Get user by ID
            serializer = UserSerializer(user, many=False) # Serialize user data
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"details": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Update user account information
class UserAccountUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def put(self, request, pk):
        user = User.objects.get(id=pk) # Get user by ID
        data = request.data

        if user:
            if request.user.id == user.id: # Check if the request user matches the target user
                user.username = data["username"]
                user.email = data["email"]

                if data["password"] != "":
                    user.password = make_password(data["password"]) # Encrypt the new password

                user.save() # Save the updated user data
                serializer = UserSerializer(user, many=False) # Serialize updated user data
                message = {"details": "User Successfully Updated.", "user": serializer.data}
                return Response(message, status=status.HTTP_200_OK)
            else:
                return Response({"details": "Permission Denied."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)

# Delete a user account
class UserAccountDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def post(self, request, pk):
        try:
            user = User.objects.get(id=pk) # Get user by ID
            data = request.data

            if request.user.id == user.id: # Check if the request user matches the target user
                if check_password(data["password"], user.password): # Verify the password
                    user.delete() # Delete the user account
                    return Response({"details": "User successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({"details": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"details": "Permission Denied."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)

# Get all billing addresses for the currently logged-in user
class UserAddressesListView(APIView):
    def get(self, request):
        user = request.user
        user_address = BillingAddress.objects.filter(user=user) # Filter addresses by user
        serializer = BillingAddressSerializer(user_address, many=True) # Serialize data
        
        return Response(serializer.data, status=status.HTTP_200_OK)

# Get a specific billing address by ID
class UserAddressDetailsView(APIView):
    def get(self, request, pk):
        user_address = BillingAddress.objects.get(id=pk) # Get address by ID
        serializer = BillingAddressSerializer(user_address, many=False) # Serialize data
        return Response(serializer.data, status=status.HTTP_200_OK)

# Create a new billing address
class CreateUserAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def post(self, request):
        data = request.data
        
        new_address = {
            "name": request.data["name"],
            "user": request.user.id,
            "phone_number": request.data["phone_number"],
            "pin_code": request.data["pin_code"],
            "house_no": request.data["house_no"],
            "landmark": request.data["landmark"],
            "city": request.data["city"],
            "state": request.data["state"],
        }

        serializer = BillingAddressSerializer(data=new_address, many=False) # Serialize new address data
        if serializer.is_valid():
            serializer.save() # Save the new address
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Update an existing billing address
class UpdateUserAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def put(self, request, pk):
        data = request.data

        try:
            user_address = BillingAddress.objects.get(id=pk) # Get address by ID

            if request.user.id == user_address.user.id: # Check if the request user matches the address owner

                # Prepare updated address data
                updated_address = {
                    "name": data["name"] if data["name"] else user_address.name,
                    "user": request.user.id,
                    "phone_number": data["phone_number"] if data["phone_number"] else user_address.phone_number,
                    "pin_code": data["pin_code"] if data["pin_code"] else user_address.pin_code,
                    "house_no": data["house_no"] if data["house_no"] else user_address.house_no,
                    "landmark": data["landmark"] if data["landmark"] else user_address.landmark,
                    "city": data["city"] if data["city"] else user_address.city,
                    "state": data["state"] if data["state"] else user_address.state,
                }

                serializer = BillingAddressSerializer(user_address, data=updated_address) # Serialize updated data
                if serializer.is_valid():
                    serializer.save() # Save updated address
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)

# Delete a billing address
class DeleteUserAddressView(APIView):
    def delete(self, request, pk):
        try:
            user_address = BillingAddress.objects.get(id=pk) # Get address by ID

            if request.user.id == user_address.user.id: # Check if the request user matches the address owner
                user_address.delete() # Delete the address
                return Response({"details": "Address successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        except:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)

# List all orders for the user or all users if the user is staff
class OrdersListView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Ensure user is authenticated

    def get(self, request):
        user_staff_status = request.user.is_staff # Check if the user is a staff member
        
        if user_staff_status:
            all_users_orders = OrderModel.objects.all() # Get all orders
            serializer = AllOrdersListSerializer(all_users_orders, many=True) # Serialize data
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            all_orders = OrderModel.objects.filter(user=request.user) # Get orders for the current user
            serializer = AllOrdersListSerializer(all_orders, many=True) # Serialize data
            return Response(serializer.data, status=status.HTTP_200_OK)

# Change the delivery status of an order
class ChangeOrderStatus(APIView):
    permission_classes = [permissions.IsAdminUser] # Ensure only admins can change order status

    def put(self, request, pk):
        data = request.data       
        order = OrderModel.objects.get(id=pk) # Get order by ID

        # Update delivery status and delivery time
        order.is_delivered = data["is_delivered"]
        order.delivered_at = data["delivered_at"]
        order.save() # Save the updated order
        
        serializer = AllOrdersListSerializer(order, many=False) # Serialize updated order data
        return Response(serializer.data, status=status.HTTP_200_OK)
