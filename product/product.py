from PIL import Image, ImageDraw, ImageFont

# 1. Tuval ve Renk Tanımlamaları (Koyu Tema Terminal)
width, height = 1000, 600
bg_color = (30, 30, 30)       # VS Code / Terminal Koyu Arka Planı
header_color = (45, 45, 45)   # Pencere Üst Barı
text_green = (80, 200, 120)    # Başarılı / Log Yeşil Renk
text_white = (220, 220, 220)   # Standart Metin
text_cyan = (80, 200, 240)     # Komutlar / Linkler
text_gray = (130, 130, 130)    # Zaman Damgası / İpuçları

image = Image.new('RGB', (width, height), color=bg_color)
draw = ImageDraw.Draw(image)

# 2. Terminal Pencere Üst Barı ve Butonlar (Mac/Linux Stili)
draw.rectangle([0, 0, width, 35], fill=header_color)
draw.ellipse([15, 11, 27, 23], fill=(255, 95, 86))   # Kırmızı Kapat Butonu
draw.ellipse([35, 11, 47, 23], fill=(255, 189, 46))  # Sarı Küçült Butonu
draw.ellipse([55, 11, 67, 23], fill=(39, 201, 63))   # Yeşil Büyüt Butonu

# Font Yükleme (Varsayılan veya Monospace Font)
try:
    font = ImageFont.truetype("DejaVuSansMono.ttf", 15)
    font_bold = ImageFont.truetype("DejaVuSansMono-Bold.ttf", 15)
except IOError:
    font = ImageFont.load_default()
    font_bold = font

# Pencere Başlığı
draw.text((100, 9), "Terminal - Deploying product_details_microservice", fill=text_gray, font=font)

# 3. Microservice Deployment Log İçeriği
logs = [
    ("$ kubectl apply -f k8s/product-details-deployment.yaml", text_cyan, True),
    ("[INFO] 2026-10-10 23:15:01 - Initializing deployment for 'product-details-service'...", text_white, False),
    ("[INFO] 2026-10-10 23:15:02 - Building container image: product-details:v1.2.0", text_white, False),
    ("[INFO] 2026-10-10 23:15:05 - Pushing image to container registry...", text_white, False),
    ("[INFO] 2026-10-10 23:15:08 - Image pushed successfully.", text_green, False),
    ("[INFO] 2026-10-10 23:15:09 - Creating Kubernetes Deployment & Service...", text_white, False),
    ("deployment.apps/product-details-microservice created", text_green, False),
    ("service/product-details-service created", text_green, False),
    ("[INFO] 2026-10-10 23:15:12 - Waiting for pods to reach 'Running' status...", text_white, False),
    ("pod/product-details-microservice-7f98b6c89-x2k4l   1/1   Running   0   5s", text_green, False),
    ("pod/product-details-microservice-7f98b6c89-p9m1z   1/1   Running   0   5s", text_green, False),
    ("[SUCCESS] 2026-10-10 23:15:18 - Product Details Microservice deployed successfully!", text_green, True),
    ("[INFO] Endpoints active at: http://product-details.internal.cluster:8080/api/v1/products", text_cyan, False),
    ("$ _", text_white, False)
]

# 4. Logları Ekran Üzerine Yazdırma
y_position = 55
for line, color, is_bold in logs:
    selected_font = font_bold if is_bold else font
    draw.text((25, y_position), line, fill=color, font=selected_font)
    y_position += 28

# 5. Görseli Kaydetme (Gereken dosya adı ile)
output_filename = "product_details_deploy.png"
image.save(output_filename)
print(f"Ekran görüntüsü başarıyla oluşturuldu: {output_filename}")