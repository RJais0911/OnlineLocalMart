# Use a lightweight web server image
FROM nginx:alpine

# Copy the static files to the nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Default command to start nginx
CMD ["nginx", "-g", "daemon off;"]