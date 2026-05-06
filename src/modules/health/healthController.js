import { sendSuccess } from '../../shared/utils/response.js';

export function getHealth(req, res) {
  const data = {
    timestamp: new Date().toISOString(),
  };
  return sendSuccess(res, data, 'API is running');
}
