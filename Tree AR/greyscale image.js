// Get the canvas element and its context
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

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

            // Draw the uploaded image onto the canvas
            context.drawImage(img, 0, 0, 600, 600);

            // Get the image data from the canvas
            var imageData = context.getImageData(0, 0, 600, 600);

            // Convert the image to grayscale using Jsfeat
            var gray_img = new jsfeat.matrix_t(600, 600, jsfeat.U8_t | jsfeat.C1_t);
            var code = jsfeat.COLOR_RGBA2GRAY;
            jsfeat.imgproc.grayscale(imageData.data, 600, 600, gray_img, code);

            // Render the grayscale result back to the canvas
            var data_u32 = new Uint32Array(imageData.data.buffer);
            var alpha = (0xff << 24);
            var i = 600 * 600;
            while (i-- >= 0) {
                var pix = gray_img.data[i];
                data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
            }
            context.putImageData(imageData, 0, 0);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});