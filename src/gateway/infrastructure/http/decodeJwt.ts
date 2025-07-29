export default function decodeJWT(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch (err) {
    throw new Error('Cannot decode JWT, invalid token format');
  }
}
