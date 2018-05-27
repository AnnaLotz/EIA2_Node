/* Aufgabe: Aufgabe 6: StudiVZ
  Name: Anna Lotz
  Matrikel: 257449
  Datum: 27.05.18
  Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe. Er wurde nicht kopiert und auch nicht diktiert.
*/
import * as Http from "http";
import * as Url from "url";

namespace Server {

    interface AssocStringString {
        [key: string]: string;
    }

    interface Studi {
        name: string;
        firstname: string;
        matrikel: number;
        age: number;
        curriculum: string;
        gender: boolean;
    }

    // Struktur des homogenen assoziativen Arrays, bei dem ein Datensatz der Matrikelnummer zugeordnet ist
    interface Studis {
        [matrikel: string]: Studi;
    }


    // Homogenes assoziatives Array zur Speicherung einer Person unter der Matrikelnummer
    let studiHomoAssoc: Studis = {};
    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8200;

    let server: Http.Server = Http.createServer((_request: Http.IncomingMessage, _response: Http.ServerResponse) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Ich höre Stimmen!");
        let query: AssocStringString = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        if (query["command"]) {
            switch (query["command"]) {
                case "insert":
                    insert(query, _response);
                    break;

                case "refresh":
                    refresh(_response);
                    break;

                case "search":
                    search(query, _response);
                    break;

                default:
                    error();
            }
        }
        _response.end();

    }

    function insert(query: AssocStringString, _response: Http.ServerResponse): void {
        let obj: Studi = JSON.parse(query["data"]);
        let _name: string = obj.name;
        let _firstname: string = obj.firstname;
        let matrikel: string = obj.matrikel.toString();
        let _age: number = obj.age;
        let _curriculum: string = obj.curriculum;
        let _gender: boolean = obj.gender;
        let studi: Studi;
        studi = {
            name: _name,
            firstname: _firstname,
            matrikel: parseInt(matrikel),
            age: _age,
            curriculum: _curriculum,
            gender: _gender
        };
        studiHomoAssoc[matrikel] = studi;
        _response.write("Daten empfangen");
    }

    function refresh(_response: Http.ServerResponse): void {
        console.log(studiHomoAssoc);
        for (let matrikel in studiHomoAssoc) {
            let studi: Studi = studiHomoAssoc[matrikel];
            let line: string = matrikel + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(m)" : "(f), ";
            line += studi.curriculum;
            _response.write(line + "\n");
        }
    }

    function search(query: AssocStringString, _response: Http.ServerResponse): void {
        let studi: Studi = studiHomoAssoc[query["searchFor"]];
        /* if (studi) {
            let line: string = query["searchFor"] + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(m)" : "(f), ";
            line += studi.curriculum;
            _response.write(line);
        } else {
            _response.write("No Student found");
        }*/
        
        if (typeof studi === "undefined") {
            console.log("studi=undefined");
            _response.write("No Student found");
        } else {
            let line: string = query["searchFor"] + ": ";
            line += studi.name + ", " + studi.firstname + ", " + studi.age + " Jahre ";
            line += studi.gender ? "(m)" : "(f), ";
            line += studi.curriculum;
            _response.write(line);
        }
    }

    function error(): void {
        alert("Error");
    }



}