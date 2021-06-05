import './index.{{cssSuffix}}';

declare var window: any;
declare var document: any;
declare var navigator: any;

class App {
    name:string;
    constructor(name:string){
        this.name = name;
    }
    render(){
        const dom = document.createElement('h1');
        
        dom.innerText = this.name;
        document.body.appendChild(dom);
    }
}

new App('hello world').render();

{{serviceWorkerJS}}

export default App;