module.exports = function handler(req, res) {
  res.status(200).json({
    method: req.method,
    message: "wishes api works"
  });
}