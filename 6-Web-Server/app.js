const http = require('http');
const fs = require('fs');


http
    .createServer((req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        const url = req.url;

        function getFile(path, res) {
            // read html file, if not found throw error
            fs.readFile(path, 'utf-8', function (err, data) {
                if (err) {
                    res.writeHead(404);
                    res.write('<h1>Error: page not found</h1>');
                } else {
                    res.write(data);
                }
                res.end();
            });
        }


        if (url === '/about') {
            //call function to get about page
            getFile('./about.html', res);
        } else if (url === '/contact') {
            //call function to get contact page
            getFile('./contact.html', res);
        } else {
            //call function to get main page
            getFile('./index.html', res)
        }
    })

    .listen(3000, () => {
        console.log('server is listening on port 3000:')
    }) 