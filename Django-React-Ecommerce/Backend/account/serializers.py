# Importing the necessary models and serializers


# Importing the serializers module from Django REST Framework to create serializers for our models
from rest_framework import serializers
# Importing the built-in User model from Django's authentication system to create serializers related to users
from django.contrib.auth.models import User
# Importing RefreshToken from the Django REST Framework Simple JWT package to manually create JWT tokens
from rest_framework_simplejwt.tokens import RefreshToken
# Importing the models from the current package's models module
from .models import StripeModel, BillingAddress, OrderModel

# Defining a serializer for the User model to control how user data is serialized and deserialized
class UserSerializer(serializers.ModelSerializer):
    # Adding a custom field to the serializer that determines if the user is an admin (staff)
    admin = serializers.SerializerMethodField(read_only=True)

    # Meta class to define the model and fields that will be serialized
    class Meta:
        model = User  # The model that this serializer will work with is the User model
        fields = ["id", "username", "email", "admin"]  # The fields to include in the serialized output

    # Method to get the value for the 'admin' field; returns True if the user is a staff member
    def get_admin(self, obj):
        return obj.is_staff


# Serializer for user registration that also creates JWT tokens manually
class UserRegisterTokenSerializer(UserSerializer):
    # Adding a custom field to the serializer that generates a JWT token for the user
    token = serializers.SerializerMethodField(read_only=True)

    # Meta class to define the model and fields that will be serialized
    class Meta:
        model = User  # The model that this serializer will work with is the User model
        fields = ["id", "username", "email", "admin", "token"]  # The fields to include in the serialized output

    # Method to generate a JWT token for the user; this token can be used for authentication
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)  # Creates a new RefreshToken for the user
        return str(token.access_token)  # Returns the access token as a string


# Serializer for listing Stripe card details
class CardsListSerializer(serializers.ModelSerializer):

    # Meta class to define the model and fields that will be serialized
    class Meta:
        model = StripeModel  # The model that this serializer will work with is the StripeModel
        fields = "__all__"  # Serializes all fields in the StripeModel


# Serializer for billing address details
class BillingAddressSerializer(serializers.ModelSerializer):

    # Meta class to define the model and fields that will be serialized
    class Meta:
        model = BillingAddress  # The model that this serializer will work with is the BillingAddress model
        fields = "__all__"  # Serializes all fields in the BillingAddress model


# Serializer for listing all orders
class AllOrdersListSerializer(serializers.ModelSerializer):

    # Meta class to define the model and fields that will be serialized
    class Meta:
        model = OrderModel  # The model that this serializer will work with is the OrderModel
        fields = "__all__"  # Serializes all fields in the OrderModel
