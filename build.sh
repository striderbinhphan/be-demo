#!/bin/bash
pwd >> /usr/share/nginx/html/logs/fixture-listing
docker-compose build >> /usr/share/nginx/html/logs/fixture-listing
#docker-compose up -d --no-deps --build >> /usr/share/nginx/html/logs/fixture-listing
docker-compose up -d >> /usr/share/nginx/html/logs/fixture-listing
echo "=1=======================$CI_COMMIT_SHORT_SHA=========================" >> /usr/share/nginx/html/logs/fixture-listing