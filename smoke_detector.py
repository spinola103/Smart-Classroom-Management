import yolov5
import cv2
import time
import winsound

# Load model
model = yolov5.load('keremberke/yolov5m-smoke')

# Set model parameters
model.conf = 0.25  # NMS confidence threshold
model.iou = 0.45  # NMS IoU threshold
model.agnostic = False  # NMS class-agnostic
model.multi_label = False  # NMS multiple labels per box
model.max_det = 1000  # Maximum number of detections per image

# Smoke detection timer
smoke_detected_start = None
smoke_duration_threshold = 5  # seconds

def process_frame(frame):
    """Perform inference on a single frame and draw detection boxes."""
    global smoke_detected_start

    results = model(frame, size=640)
    predictions = results.pred[0]

    smoke_detected = False

    if predictions is not None and len(predictions) > 0:
        boxes = predictions[:, :4]  # x1, y1, x2, y2
        scores = predictions[:, 4]
        categories = predictions[:, 5]

        # Draw bounding boxes and labels
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = map(int, box.tolist())
            score = scores[i]
            category = int(categories[i])
            label = f"{model.names[category]} {score:.2f}"

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            # Check if the detected category is smoke
            if model.names[category].lower() == 'smoke':
                smoke_detected = True

    # Update smoke detection timer
    if smoke_detected:
        if smoke_detected_start is None:
            smoke_detected_start = time.time()
    else:
        smoke_detected_start = None

    return frame

def check_smoke_duration():
    """Check if smoke is detected for a continuous or cumulative duration."""
    global smoke_detected_start

    if smoke_detected_start is not None:
        elapsed_time = time.time() - smoke_detected_start
        if elapsed_time >= smoke_duration_threshold:
            # Trigger the beep sound
            print("Smoke detected for 10 seconds! Generating alarm...")
            for _ in range(5):
                winsound.Beep(1000, 1000)  # Frequency: 1000Hz, Duration: 1000ms
            smoke_detected_start = None  # Reset timer

def main():
    """Main function to run detection on webcam feed."""
    cap = cv2.VideoCapture(0)  # Open default webcam
    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    print("Press 'Esc' to exit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to capture frame from webcam.")
            break

        # Process the current frame
        processed_frame = process_frame(frame)

        # Check if smoke has been detected for the threshold duration
        check_smoke_duration()

        # Display the frame with detections
        cv2.imshow("YOLOv5 Smoke Detection", processed_frame)

        # Exit on pressing 'Esc'
        if cv2.waitKey(1) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
