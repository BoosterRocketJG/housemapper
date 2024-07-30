import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

# Create an image with a white background
img = Image.new('RGB', (800, 400), color='white')
draw = ImageDraw.Draw(img)

# Load a font
font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 20)

# Draw header
draw.text((20, 20), "Google Sheets Data Fetcher", fill='black', font=font)

# Draw form
draw.text((20, 80), "Key:", fill='black', font=font)
draw.rectangle(((70, 75), (370, 110)), outline="black", width=2)  # Input box
draw.text((380, 75), "Fetch Data", fill='black', font=font)  # Button

# Draw data display area
draw.rectangle(((20, 150), (780, 380)), outline="black", width=2)
draw.text((30, 160), "Fetched Data will appear here...", fill='grey', font=font)

# Save the image
img_path = "/Users/James/Desktop/Beanz/google_sheets_data_fetcher_preview.png"
img.save(img_path)

img.show()

img_path
