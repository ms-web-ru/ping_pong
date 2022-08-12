# ping_pong
Веб приложение для автоматического подсчета очков в настольном теннисе. Требуется подключение устройств ввода и сетевого интерфейса для взаимодействия через GET протокол. Для тестирования подключения устройств не обязательно.


1) выполнить npm install 
2) Запустить start_server.bat 
3) Открыть в двух вкладках браузера файлы /public/index.html и /public/test.html 
4) Нажимая кнопки в test.html должен выполнятся подсчёт очков в index.html 
5) Можно включить звук во вкладке index.html кнопка  внизу

в test.html показано как отправлять команды через сокет
также можно после запуска сервера открыть в браузере http://127.0.0.1:8112/ и протестить как команды посылаются GET запросами 


A web application for automatic scoring in table tennis. It requires the connection of input devices and a network interface to interact via the GET protocol. Device connections are not required for testing.


1) run npm install 
2) Run start_server.bat 
3) Open files in two browser tabs /public/index.html and /public/test.html
4) By pressing the buttons in test.html the scoring must be performed in index.html 
5) You can turn on the sound in the tab index.html button at the bottom

in test.html it shows how to send commands via socket
you can also open it in the browser after starting the server http://127.0.0.1:8112 / and test how commands are sent by GET requests
