const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const directoryPath = __dirname;

    if (req.url === '/') {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>小报</title>
                        <style>
                            h1,p {
                                text-align: center;
                            }
                            body {
                                font-family: Arial, sans-serif;
                            }
                            ul {
                                list-style-type: disc;
                                padding: 0;
                                max-width: 600px;
                                margin: 0 auto;
                            }
                            li {
                                margin-bottom: 10px;
                            }
                            a {
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>小报</h1>
                        <p>传播思想</p>
                `);

                const htmlFiles = files.filter(file => path.extname(file) === '.html');
                const sortedFiles = sortFilesByDate(htmlFiles);

                res.write('<ul>');
                sortedFiles.forEach(file => {
                    const encodedFileName = encodeURIComponent(file);
                    const displayName = getDisplayName(file);
                    res.write(`
                        <li>
                            <a href="${encodedFileName}">${displayName}</a>
                        </li>
                    `);
                });
                res.write('</ul>');

                res.write(`
                    </body>
                    </html>
                `);
                res.end();
            }
        });
    } else {
        const requestedFileName = decodeURIComponent(req.url.slice(1)); // Decode the file name
        const filePath = path.join(directoryPath, requestedFileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`);
});

function getDisplayName(fileName) {
    // Remove the date and extension from the file name
    return fileName.replace(/(\d{8}.\d{6})\.(.+)\.html/, '$2');
}

function sortFilesByDate(files) {
    return files.sort((a, b) => {
        const dateA = extractDate(a);
        const dateB = extractDate(b);
        if (dateA > dateB) return -1; // Sort in descending order by date
        if (dateA < dateB) return 1;
        return 0;
    });
}

function extractDate(fileName) {
    const match = /(\d{8}.\d{6})/.exec(fileName);
    if (match) {
        return match[1];
    }
    return '';
}
