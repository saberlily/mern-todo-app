FROM nginx

COPY ./build /usr/share/nginx/html

RUN printf "server {\n listen 80;\n location / {\n  root /usr/share/nginx/html;\n  index index.html;\n  try_files \$uri \$uri/ /index.html;\n }\n}" > /etc/nginx/conf.d/default.conf
