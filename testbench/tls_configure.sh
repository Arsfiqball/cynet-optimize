echo "\n[tls_configure] Generate CA Key & Certificate"
openssl req -new -x509 -days 9999 -config tls_ca.cnf -keyout tls_ca_key.pem -out tls_ca_cert.pem

echo "\n[tls_configure] Generate Localhost Key & CSR"
openssl genrsa -out tls_localhost_key.pem 2048
openssl req -new -sha256 -key tls_localhost_key.pem -out tls_localhost_csr.pem -config tls_localhost.csr.cnf

echo "\n[tls_configure] Generate Localhost Cert & Sign it"
openssl x509 -req -in tls_localhost_csr.pem -passin "pass:password" -extfile tls_v3.ext -days 999 -CA tls_ca_cert.pem -CAkey tls_ca_key.pem -CAcreateserial -out tls_localhost_cert.pem

echo "\n[tls_configure] Verification"
openssl verify -CAfile tls_ca_cert.pem tls_localhost_cert.pem
