import cv2
import numpy as np
import face_recognition
import os
from datetime import datetime
import requests

# Configurations
STUDENT_IMAGE_PATH = "C:\\Users\\Windows\\Desktop\\SIH 2024\\main-gate\\scripts\\Students"  
ADMIN_ALERT_URL = "http://localhost:5000/api/alert"

# Load student images and names
images = []
classNames = []
for file_name in os.listdir(STUDENT_IMAGE_PATH):
    image_path = os.path.join(STUDENT_IMAGE_PATH, file_name)
    image = cv2.imread(image_path)
    if image is not None:
        images.append(image)
        classNames.append(os.path.splitext(file_name)[0])

# Encode known faces
def find_encodings(images):
    encode_list = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        try:
            encode = face_recognition.face_encodings(img)[0]
            encode_list.append(encode)
        except IndexError:
            print("Face encoding failed for an image.")
    return encode_list

encode_known = find_encodings(images)
print("Encoding Complete")

# Initialize webcam
cap = cv2.VideoCapture(0)

# Track alerts to avoid duplicate notifications
alerted_faces = set()

def send_alert_to_admin(name, status):
    try:
        data = {"name": name, "status": status, "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
        response = requests.post(ADMIN_ALERT_URL, json=data)
        print("Admin Alert Sent: ", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Failed to send alert: {e}")

def log_unauthorized_entry(name):
    with open("unauthorized_log.txt", "a") as log_file:
        log_file.write(f"{datetime.now()}: Unauthorized access attempt by {name}\n")

def log_terminal_message(name, status):
    if status == "Unauthorized":
        print(f"{name}: Unauthorised attempt detected!")
    elif status == "Authorized":
        print(f"{name}: Permitted inside.")

while True:
    success, img = cap.read()
    if not success:
        print("Failed to capture frame from webcam.")
        break

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = face_recognition.face_locations(img_rgb)
    encodes = face_recognition.face_encodings(img_rgb, faces)

    for encode, face in zip(encodes, faces):
        matches = face_recognition.compare_faces(encode_known, encode)
        face_dis = face_recognition.face_distance(encode_known, encode)
        name = "UNKNOWN"

        if True in matches:
            match_idx = np.argmin(face_dis)
            name = classNames[match_idx].upper()

        y1, x2, y2, x1 = face
        color = (0, 0, 255)  # Red for unauthorized

        if name == "UNKNOWN":
            cv2.putText(img, "UNAUTHORIZED", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            if name not in alerted_faces:
                log_unauthorized_entry(name)
                send_alert_to_admin(name, "Unauthorized")
                log_terminal_message(name, "Unauthorized")
                alerted_faces.add(name)
        else:
            color = (0, 255, 0)  # Green for authorized
            cv2.putText(img, f"{name} - AUTHORIZED", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
            if name not in alerted_faces:
                send_alert_to_admin(name, "Authorized")
                log_terminal_message(name, "Authorized")
                alerted_faces.add(name)

        cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)

    # Display the frame
    cv2.imshow("Main Gate", img)
    if cv2.waitKey(1) & 0xFF == 27:  # Exit on 'Esc'
        break

cap.release()
cv2.destroyAllWindows()