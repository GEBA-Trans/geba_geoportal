# Use the official Nginx image as a base
FROM nginx:alpine

# Copy the HTML files to the Nginx server directory
COPY ./html /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80
