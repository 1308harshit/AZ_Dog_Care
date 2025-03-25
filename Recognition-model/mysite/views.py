from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
import os
import cv2
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet_v2 import preprocess_input

def home(request):
    # Render the home.html template for the home page
    return render(request, "home.html")

def result(request):
    # Check if the request method is POST and if 'dogImage' is in the files
    if request.method == "POST" and 'dogImage' in request.FILES:
        # Get the uploaded dog image file
        dog_image = request.FILES['dogImage']

        # Ensure the temp directory exists where the uploaded image will be saved
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
        os.makedirs(temp_dir, exist_ok=True)

        # Define the path to save the uploaded image file temporarily
        temp_image_path = os.path.join(temp_dir, dog_image.name)
        
        # Write the uploaded image to the temporary path
        with open(temp_image_path, 'wb+') as destination:
            # Loop through the uploaded file in chunks to avoid loading large files into memory at once.
            for chunk in dog_image.chunks():
                destination.write(chunk)

        # Print the temporary path for debugging purposes
        # print(f"Temporary image path: {temp_image_path}")

        # Load the trained model from a file named "Mymodel.keras"
        model = load_model("Mymodel.keras")
        im_size = 224  # Define the size to which the image will be resized
        num_breeds = 60  # Define the number of breeds to consider

        # Read the CSV file containing breed labels
        df_labels = pd.read_csv("labels.csv")
        # Extract the list of breed names and sort them
        breed_dict = list(df_labels['breed'].value_counts().keys())
        new_list = sorted(breed_dict, reverse=True)[:num_breeds*2+1:2]
        # Filter the labels DataFrame to include only the breeds in new_list
        df_labels = df_labels.query('breed in @new_list')

        # Read the uploaded image using OpenCV
        img = cv2.imread(temp_image_path, cv2.IMREAD_COLOR)
        if img is None:
            # Return an error response if the image could not be read
            return HttpResponse(f"Image not found or cannot be read: {temp_image_path}")

        # Resize the image to the required input size of the model
        try:
            pred_img_array = cv2.resize(img, (im_size, im_size))
        except Exception as e:
            # Return an error response if resizing fails
            return HttpResponse(f"Error resizing image: {e}")

        # Convert the image to a format suitable for the model and preprocess it
        pred_img_array = preprocess_input(np.expand_dims(np.array(pred_img_array[..., ::-1].astype(np.float32)).copy(), axis=0))

        # Make a prediction using the model
        pred_val = model.predict(np.array(pred_img_array, dtype="float32"))

        # Find the breed with the highest probability from the prediction
        predicted_breed = sorted(new_list)[np.argmax(pred_val)]

        # Render the result.html template and pass the predicted breed to it
        return render(request, "result.html", {'predicted_breed': predicted_breed})

    # Return an error response if no image is uploaded
    return HttpResponse("Please upload a dog image.")
