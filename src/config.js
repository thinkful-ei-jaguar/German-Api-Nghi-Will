module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL
    || 'postgresql://sr-admin:Nhgi-Will@localhost/sparep',
  JWT_SECRET: process.env.JWT_SECRET || 'abcITSeasyAS123',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
