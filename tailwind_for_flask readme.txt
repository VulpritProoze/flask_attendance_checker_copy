1. install node.js
2. root folder then -> npm init -y
3. npm install tailwindcss
4. npx tailwindcss init
5. go to tailwind.config.js
6. replace content with 
content: ["./templates/*"]
7. go to static. create src folder. create 'input.css' then place this ->
@tailwind base;
@tailwind components;
@tailwind utilities;
8. go to css folder, create 'main.css'
9. run this in cmd -> npx tailwindcss -i ./static/src/input.css -o ./static/css/main.css --watch
10. within package.json > scripts > add this ->
"tailwind": "npx tailwindcss -i ./static/src/input.css -o ./static/css/main.css --watch"
11. then append this in html -> <link rel='stylesheet' href='/static/css/main.css'>