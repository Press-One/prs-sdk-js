curl -X POST https://beta.press.one/api/v2/apps/6b16c956d963e2c38e07d49af37b66a1de490a97/authenticate \
  -H "Content-Type: application/json" \
  -H "X-Po-Auth-Address: 6b16c956d963e2c38e07d49af37b66a1de490a97" \
  -H "X-Po-Auth-Msghash: 7b61f7ee90d333017e4fc822adf196030ef8ae457c6f8d7b2f6b8776a6a50c6e" \
  -H "X-Po-Auth-Sig: 7a405ca5a2f8d925e70be5346b7b3974a8f9b172c755555ba149cca8cc9c737e6c3e7d35e17893ea5893fb0515d0c5019f3ddd5ce716e813506a4f146eeefd9a1" \
  -d '{ "payload": { "code": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTExOTU5MTUsImp0aSI6Ijg5M2NiMjAwLTNiNTQtNDYzNC1hODNlLWU3ZmJmNzQ3YjVjNiIsImRhdGEiOnsidXNlckFkZHJlc3MiOiJjYjdiNzUxMDNjNzMzY2M1NzQzYTM5MGZhZjdiZGVkYzYxNzg2ZTI5IiwiYXBwQWRkcmVzcyI6IjZiMTZjOTU2ZDk2M2UyYzM4ZTA3ZDQ5YWYzN2I2NmExZGU0OTBhOTciLCJ0eXBlIjoicGhvbmUifSwicHJvdmlkZXIiOiJwcmVzc29uZSIsImV4cCI6MTU1MTQ1NTExNX0.KQeimVWpEnTs-8FyvDYh-mppG1_kMKiPGZOf8mY3pfA" } }'
