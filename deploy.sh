#!/bin/bash

rm -rf /etc/nginx/html/*
cp -a build/* /etc/nginx/html/
sudo systemctl restart nginx