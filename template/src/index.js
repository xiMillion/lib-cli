import './index.{{cssSuffix}}';

class App {
    constructor(name){
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