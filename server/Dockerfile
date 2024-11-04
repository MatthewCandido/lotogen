# Use the official Node.js 18 image as the base image
FROM node:22

# Install necessary dependencies for Puppeteer and Chrome
RUN apt-get update && apt-get install -y --no-install-recommends \
	wget \
	ca-certificates \
	libnss3 \
	libxss1 \
	libasound2 \
	libatk-bridge2.0-0 \
	libatk1.0-0 \
	libcups2 \
	libdbus-1-3 \
	libgdk-pixbuf2.0-0 \
	libnspr4 \
	libxcomposite1 \
	libxrandr2 \
	dbus \
	x11-xserver-utils \
	libglib2.0-0 \
	xdg-utils \
	libappindicator3-1 \
	fonts-liberation && \
	wget -q -O /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
	dpkg -i /tmp/google-chrome.deb || apt-get -y -f install && \
	rm -rf /tmp/google-chrome.deb && \
	apt-get clean && \
	apt-get autoremove && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

#ENV PUPPETEER_CACHE_DIR=/opt/render/project/puppeteer

COPY . .

RUN chmod +x render-build.sh

# Run the script with error trapping for debugging
RUN ./render-build.sh || (echo "Debug Info: render-build.sh failed" && exit 1)

EXPOSE 5000

CMD ["node", "server.js"]
