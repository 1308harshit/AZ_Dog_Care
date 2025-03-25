# Importing necessary modules from Django

# Importing models from django.db to create models for the database
from django.db import models
# Importing the built-in User model from django.contrib.auth.models to link our models with Django's authentication system
from django.contrib.auth.models import User
# Importing RegexValidator from django.core.validators to validate fields using regular expressions
from django.core.validators import RegexValidator


# Defining a model to store Stripe payment details
class StripeModel(models.Model):
    # Field to store the email associated with the Stripe account; can be left blank or null
    email = models.EmailField(null=True, blank=True)
    # Field to store the name as it appears on the card; can be left blank or null
    name_on_card = models.CharField(max_length=200, null=True, blank=True)
    # Field to store the customer ID from Stripe; can be left blank or null
    customer_id = models.CharField(max_length=200, blank=True, null=True)
    # Field to store the card number; it must be unique across the database, can be left blank or null
    card_number = models.CharField(max_length=16, unique=True, null=True, blank=True)
    # Field to store the expiration month of the card; validated to ensure it's a number, can be left blank or null
    exp_month = models.CharField(max_length=2, validators=[RegexValidator(r'^\d{0,9}$')], null=True, blank=True)
    # Field to store the expiration year of the card; validated to ensure it's a number, can be left blank or null
    exp_year = models.CharField(max_length=4, validators=[RegexValidator(r'^\d{0,9}$')], null=True, blank=True)
    # Field to store the card ID from Stripe; can be left blank or null
    card_id = models.TextField(max_length=100, null=True, blank=True)
    # ForeignKey field to link this model with a User; if the user is deleted, the related Stripe data is also deleted
    user = models.ForeignKey(User, related_name="stripemodel", on_delete=models.CASCADE, null=True, blank=True)
    # Field to store the city from the billing address; can be left blank or null
    address_city = models.CharField(max_length=120, null=True, blank=True)
    # Field to store the country from the billing address; can be left blank or null
    address_country = models.CharField(max_length=120, null=True, blank=True)
    # Field to store the state from the billing address; can be left blank or null
    address_state = models.CharField(max_length=120, null=True, blank=True)
    # Field to store the zip code from the billing address; validated to ensure it's a number, can be left blank or null
    address_zip = models.CharField(max_length=6, validators=[RegexValidator(r'^\d{0,9}$')], null=True, blank=True)

    # Method to return the email when the object is represented as a string
    def __str__(self):
        return self.email


# Defining a model to store the billing address details
class BillingAddress(models.Model):
    # Field to store the name of the person associated with the billing address; required field
    name = models.CharField(max_length=200, null=False, blank=False)
    # ForeignKey field to link this billing address with a User; if the user is deleted, the related billing address is also deleted
    user = models.ForeignKey(User, related_name="billingmodel", on_delete=models.CASCADE, null=True, blank=True)
    # Field to store the phone number; validated to ensure it follows a specific pattern, required field
    phone_number = models.CharField(max_length=10, validators=[RegexValidator(r'^\+?1?\d{9,15}$')], null=False, blank=False)
    # Field to store the pin code of the billing address; validated to ensure it's a number, required field
    pin_code = models.CharField(max_length=6, validators=[RegexValidator(r'^\d{0,9}$')], null=False, blank=False)
    # Field to store the house number or address line 1; required field
    house_no = models.CharField(max_length=300, null=False, blank=False)
    # Field to store a landmark near the billing address; required field
    landmark = models.CharField(max_length=120, null=False, blank=False)
    # Field to store the city of the billing address; required field
    city = models.CharField(max_length=120, null=False, blank=False)
    # Field to store the state of the billing address; required field
    state = models.CharField(max_length=120, null=False, blank=False)

    # Method to return the name when the object is represented as a string
    def __str__(self):
        return self.name


# Defining a model to store order details
class OrderModel(models.Model):
    # Field to store the name of the person who placed the order
    name = models.CharField(max_length=120)
    # Field to store the ordered item; has a default value if not provided, can be left blank or null
    ordered_item = models.CharField(max_length=200, null=True, blank=True, default="Not Set")
    # Field to store the card number used for the order; can be left blank or null
    card_number = models.CharField(max_length=16, null=True, blank=True)
    # Field to store the address where the order is to be delivered; can be left blank or null
    address = models.CharField(max_length=300, null=True, blank=True)
    # Field to indicate if the order has been paid for; defaults to False (not paid)
    paid_status = models.BooleanField(default=False)
    # Field to store the date and time when the payment was made; can be left blank or null
    paid_at = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    # Field to store the total price of the order; can be left blank or null, allows up to 8 digits with 2 decimal places
    total_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    # Field to indicate if the order has been delivered; defaults to False (not delivered)
    is_delivered = models.BooleanField(default=False)
    # Field to store the date and time when the order was delivered; can be left blank or null
    delivered_at = models.CharField(max_length=200, null=True, blank=True)
    # ForeignKey field to link this order with a User; if the user is deleted, the related order is also deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    # Method to return the name when the object is represented as a string
    def __str__(self):
        return self.name
