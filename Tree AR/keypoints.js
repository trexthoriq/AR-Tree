var keypointsCanvas = document.getElementById('keypointsCanvas');
var keypointsContext = keypointsCanvas.getContext('2d');

// Function to handle image upload
document.getElementById('uploadInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            // Set canvas dimensions to 600x600 pixels
            canvas.width = 600;
            canvas.height = 600;
            keypointsCanvas.width = 600;
            keypointsCanvas.height = 600;

            // Draw the uploaded image onto the canvas
            context.drawImage(img, 0, 0, 600, 600);

            // Convert the image to grayscale using Jsfeat
            var gray_img = new jsfeat.matrix_t(600, 600, jsfeat.U8_t | jsfeat.C1_t);
            var code = jsfeat.COLOR_RGBA2GRAY;
            jsfeat.imgproc.grayscale(context.getImageData(0, 0, 600, 600).data, 600, 600, gray_img, code);

            // Perform YAPE keypoints detection
            var corners = [];
            var image_width = 600;
            var image_height = 600;
            var radius = 5;
            var pyramid_levels = 1;
            jsfeat.yape.init(image_width, image_height, radius, pyramid_levels);

            for (var i = 0; i < 600 * 600; ++i) {
                corners[i] = new jsfeat.keypoint_t(0, 0, 0, 0);
            }

            var count = jsfeat.yape.detect(gray_img, corners, 4);

            // Draw keypoints on the keypoints canvas
            keypointsContext.drawImage(canvas, 0, 0); // Copy grayscale image to keypoints canvas

            keypointsContext.fillStyle = 'red';
            for (var i = 0; i < count; i++) {
                var x = corners[i].x;
                var y = corners[i].y;
                keypointsContext.beginPath();
                keypointsContext.arc(x, y, 3, 0, 2 * Math.PI);
                keypointsContext.fill();
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});
