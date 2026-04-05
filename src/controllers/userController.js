export function getUsers(req, res) {
  res.status(200).json({
    success: true,
    message: 'Users endpoint is ready',
    data: [],
  });
}
