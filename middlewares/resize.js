const sharp = require("sharp");

module.exports = async (req, res, next) => {
  try {
    if (!req.files) return next();

    res.locals.images = [];
    await Promise.all(
      req.files.map(async file => {
        const newFilename = `${Date.now()}-image.png`;
  
        await sharp(file.buffer)
          .resize(1024, 1024, {
              fit: 'inside',
          })
          .toFormat("png")
          .png({ quality: 90 })
          .toFile(`${process.env.UPLOAD_PATH}/${newFilename}`);
        console.log("User ["+ res?.locals?.user?.username +"] uploaded: "+ newFilename);
        res.locals.images.push(newFilename);
      })
    );
  
    next();
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: "Lỗi máy chủ!"})
  }
};