# Serverside Scripting 

## Belangrijk
Wees niet zo stupid om de bende letterlijk over te nemen, want ja, dan doet 'ie het niet. Ik gebruik een eigen database, dus alles gaat stuk. Groetjes.

## Huiswerkopdracht werkcollege 3

Je gaat een loginprocedure bouwen, waarbij op basis van sessies wordt gecontroleerd of iemand is ingelogd. Neem de lees- en lesstof nog eens goed door als je niet weet waar je moet beginnen. Om de code beter te kunnen begrijpen is het verstandig om de code regel-voor-regel met de hand over te typen. Zo dwing je jezelf om over iedere regel na te denken waardoor je een beter inzicht in het geheel kunt krijgen.

1. Upload het mapje met de bestanden naar de Virtual Box server, login op de server en voer het commando ```npm install``` uit in het mapje met de opdracht-code.
2. Maak een router met routes voor de volgende paden:
    - ``` [GET] /users ```
    - ``` [GET] /users/login ```
    - ``` [POST] /users/login ```
3. Laat de routes voorlopig de gekozen route weergeven.
4. Neem de router op in app.js.
5. Zet de basis van deze router (```/users```), en zorg ervoor dat deze route: a) kijkt of de gebruikersnaam is gezet in de sessie, en b) indien niet redirect naar het inlogformulier dat je in de volgende stap gaat maken.
6. Maak een template voor het formulier en zorg ervoor dat het getoond wordt als je [192.168.56.101:3000/users/login](http://192.168.56.101:3000/users/login) opent.
7. Maak de POST route ``` router.post("/login", fn) ``` in ```routes/users.js```. Voeg een controle toe om te zien of gebruikersnaam en wachtwoord correct zijn en zet de gebruikersnaam in de sessie. Ten slotte voeg je een redirect toe waarbij je automatisch wordt doorgestuurd naar [192.168.56.101:3000/users](192.168.56.101:3000/users).
8. Nu zou de gebruikersnaam moeten worden weergegeven op [192.168.56.101:3000/users](192.168.56.101:3000/users).

Vergeet niet je code telkens te uploaden en de applicatie met ```node app.js``` te herstarten als je wijzigingen hebt doorgevoerd. Of gebruik ```nodemon app.js``` zodat de applicatie automatisch wordt herstart als de bestanden wijzigen.