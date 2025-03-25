# Importing the AppConfig class from django.apps to create a configuration class for the application
from django.apps import AppConfig

# Defining a configuration class for the 'account' application
class AccountConfig(AppConfig):
    # Setting the default field type for auto-incrementing primary keys in models within this app
    default_auto_field = 'django.db.models.BigAutoField'
    # Specifying the name of the application that this configuration applies to
    name = 'account'
