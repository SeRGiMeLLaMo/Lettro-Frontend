FROM node:20-alpine

WORKDIR /app

# Enable host mapping so Vite is accessible from outside the container.
# In a development environment, the code is mounted as a volume.
# However, we still need node_modules installed. If we just run npm install
# on startup every time, it might be slow.
# Assuming the user will run npm install from inside the container or via host initially.

# Let's start the dev server, using host 0.0.0.0
CMD npm install && npm run dev -- --host
