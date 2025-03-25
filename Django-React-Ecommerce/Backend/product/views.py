from .models import Product  
from rest_framework import status 
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ProductSerializer
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes

# View to handle requests related to products
class ProductView(APIView):

    def get(self, request):
        # Retrieve all product instances from the database
        products = Product.objects.all()
        # Serialize the product instances into JSON format
        serializer = ProductSerializer(products, many=True)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

# View to handle requests for a specific product based on its primary key (ID)
class ProductDetailView(APIView):

    def get(self, request, pk):
        # Retrieve a single product instance by its ID
        product = Product.objects.get(id=pk)
        # Serialize the product instance into JSON format
        serializer = ProductSerializer(product, many=False)
        # Return the serialized data with a 200 OK status
        return Response(serializer.data, status=status.HTTP_200_OK)

# View to handle the creation of new products
class ProductCreateView(APIView):

    permission_classes = [permissions.IsAdminUser]  # Only admin users can create products

    def post(self, request):
        # Get the data sent in the request
        data = request.data

        # Create a dictionary with the new product data
        product = {
            "name": data["name"],
            "description": data["description"],
            "price": data["price"],
            "stock": data["stock"],
            "image": data["image"],
        }

        # Serialize the product data for validation and saving
        serializer = ProductSerializer(data=product, many=False)
        if serializer.is_valid():
            # Save the new product to the database
            serializer.save()
            # Return the serialized data with a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return the validation errors with a 400 Bad Request status
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# View to handle the deletion of a specific product based on its primary key (ID)
class ProductDeleteView(APIView):

    permission_classes = [permissions.IsAdminUser]  # Only admin users can delete products

    def delete(self, request, pk):
        try:
            # Retrieve the product instance by its ID
            product = Product.objects.get(id=pk)
            # Delete the product from the database
            product.delete()
            # Return a success message with a 204 No Content status
            return Response({"detail": "Product successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
        except:
            # Return an error message with a 404 Not Found status if the product does not exist
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

# View to handle the updating of a specific product based on its primary key (ID)
class ProductEditView(APIView):
    
    permission_classes = [permissions.IsAdminUser]  # Only admin users can update products

    def put(self, request, pk):
        # Get the data sent in the request
        data = request.data
        # Retrieve the product instance by its ID
        product = Product.objects.get(id=pk)
        
        # Create a dictionary with the updated product data
        updated_product = {
            "name": data["name"] if data["name"] else product.name,
            "description": data["description"] if data["description"] else product.description,
            "price": data["price"] if data["price"] else product.price,
            "stock": data["stock"],  # Stock is required, so no default value
            "image": data["image"] if data["image"] else product.image,
        }

        # Serialize the updated product data for validation and saving
        serializer = ProductSerializer(product, data=updated_product)
        if serializer.is_valid():
            # Save the updated product data to the database
            serializer.save()
            # Return the serialized data with a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Return the validation errors with a 400 Bad Request status
            return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
