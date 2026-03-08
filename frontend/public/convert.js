const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcFiles = [
    { size: 192, name: 'logo-192.png' },
    { size: 512, name: 'logo-512.png' }
];

const inputFile = path.join(__dirname, 'logo.jpeg');

async function convert() {
    for (const file of srcFiles) {
        await sharp(inputFile)
            .resize(file.size, file.size)
            .png()
            .toFile(path.join(__dirname, file.name));
        console.log(`Created ${file.name}`);
    }
}

convert().catch(console.error);
