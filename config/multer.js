const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('image', 3);

module.exports = upload;
