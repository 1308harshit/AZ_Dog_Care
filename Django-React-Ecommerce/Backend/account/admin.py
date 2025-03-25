# Importing the necessary Django admin module to customize the admin interface
from django.contrib import admin

# Importing the models that will be registered in the Django admin site
from .models import StripeModel, BillingAddress, OrderModel

# Customizing the admin interface for the StripeModel
class StripeModelAdmin(admin.ModelAdmin):
    # Specifying the fields to be displayed in the list view of the admin site for StripeModel
    list_display = ("id", "email", "card_number", "user", "exp_month", "exp_year", "customer_id", "card_id")

# Customizing the admin interface for the BillingAddress model
class BillingAddressModelAdmin(admin.ModelAdmin):
    # Specifying the fields to be displayed in the list view of the admin site for BillingAddress
    list_display = ("id", "name", "user", "phone_number", "pin_code", "house_no", "landmark", "city", "state")

# Customizing the admin interface for the OrderModel
class OrderModelAdmin(admin.ModelAdmin):
    # Specifying the fields to be displayed in the list view of the admin site for OrderModel
    list_display = ("id", "name", "card_number", "address", "ordered_item", "paid_status", "paid_at", 
                    "total_price", "is_delivered", "delivered_at", "user")

# Registering the StripeModel with the admin site using the custom StripeModelAdmin configuration
admin.site.register(StripeModel, StripeModelAdmin)

# Registering the BillingAddress model with the admin site using the custom BillingAddressModelAdmin configuration
admin.site.register(BillingAddress, BillingAddressModelAdmin)

# Registering the OrderModel with the admin site using the custom OrderModelAdmin configuration
admin.site.register(OrderModel, OrderModelAdmin)
